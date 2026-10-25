const express = require("express");
const Router = express.Router();
const Member = require("../models/member.js");
const Membership = require("../models/membership.js");
const Trainer = require("../models/trainer.js");
const customError = require("../util/customError.js");

//get all members
Router.get("/", async (req, res) => {
  const members = await Member.find();
  if (members.length === 0) {
    throw new customError(404, "No members are currently available.");
  }

  res.render("./member/index.ejs", { members });
});


//get new member form
Router.get("/new", (req, res) => {
  res.render("./member/new.ejs");
});


//view a specific member
Router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const member = await Member.findById(id).populate("membership").populate("trainer");
  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  res.render("./member/show.ejs", { member });
});


//add new member
Router.post("/", async (req, res) => {
  const { mname, email, age, workoutPlan } = req.body;

  if (!mname || !email || !age) {
    throw new customError(400, "Please provide all required member details.");
  }

  await Member.insertOne({ mname, email, age, workoutPlan });
  res.redirect("/flexora/member");
});


//get update member form
Router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;

  const member = await Member.findById(id);
  if (!member) {
    throw new customError(404, "The member you are trying to edit could not be found.");
  }

  res.render("./member/edit.ejs", { member });
});


//update member
Router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { mname, email, age, workoutPlan } = req.body;

  if (!mname || !email || !age) {
    throw new customError(400, "Please provide all required member details.");
  }

  const member = await Member.findByIdAndUpdate(id, { mname, email, age, workoutPlan }, { runValidators: true });
  if (!member) {
    throw new customError(404, "The member you are trying to update could not be found.");
  }

  res.redirect(`/flexora/member/${id}`);
});


//delete member
Router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const member = await Member.findByIdAndDelete(id);
  if (!member) {
    throw new customError(404, "The member you are trying to delete could not be found.");
  }

  res.redirect("/flexora/member");
});


//get membership assignment form
Router.get("/:id/membership", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  //if membership already assigned
  if (member.membership != null) {
    throw new customError(400, "A membership is already assigned to this member. Please use the change membership option.");
  }

  const memberships = await Membership.find();
  res.render("./member/selectMembership.ejs", { memberships, id });
});


//membership assignment
Router.post("/:id/membership", async (req, res) => {
  const { id } = req.params;
  const { membershipId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(membershipId);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  if (!membership) {
    throw new customError(404, "The selected membership could not be found.");
  }

  //membership start and end date handling
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(
    endDate.getMonth() + membership.durationInMonths
  );

  //assigning membership and its dates 
  member.membership = membershipId;
  member.membershipStartDate = startDate;
  member.membershipEndDate = endDate;
  member.status = "active";
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});


//get change membership form
Router.get("/:id/membership/change", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  //if membership dosent exist
  if (member.membership == null) {
    throw new customError(400, "This member does not have an active membership to change.");
  }

  const memberships = await Membership.find();
  res.render("./member/changeMembership.ejs", { memberships, id });
});


//change membership
Router.put("/:id/membership", async (req, res) => {
  const { id } = req.params;
  const { membershipId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(membershipId);
  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  if (!membership) {
    throw new customError(404, "The selected membership could not be found.");
  }

  //if membership dosent exist
  if (member.membership == null) {
    throw new customError(400, "This member does not have an active membership to change.");
  }

  //manage trainer according to membership
  if (membership.planName !== "Elite") {
    member.trainer = null;
  }

  //date management
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(
    endDate.getMonth() + membership.durationInMonths
  );

  member.membership = membershipId;
  member.status = "active";
  member.membershipStartDate = startDate;
  member.membershipEndDate = endDate;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});


//delete membership 
Router.delete("/:id/membership", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  //if membership dosent assigned
  if (member.membership == null) {
    throw new customError(400, "This member does not have an active membership to remove.");
  }

  member.membership = null;
  member.membershipStartDate = null;
  member.membershipEndDate = null;
  member.status = "inactive";
  member.trainer = null;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});


//get trainer assignment from
Router.get("/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    throw new customError(400, "Personal trainer services are available only to members with an Elite membership.");
  }

  //if trainer already assigned
  if (member.trainer != null) {
    throw new customError(400, "A personal trainer is already assigned to this member. Please use the change trainer option.");
  }

  const trainers = await Trainer.find();
  res.render("./member/selectTrainer.ejs", { trainers, id });
});


//trainer assignment
Router.post("/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const { trainerId } = req.body;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    throw new customError(400, "Personal trainer services are available only to members with an Elite membership.");
  }

  //if trainer already assigned
  if (member.trainer != null) {
    throw new customError(400, "A personal trainer is already assigned to this member. Please use the change trainer option.");
  }

  //verify trainer
  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    throw new customError(404, "The selected trainer could not be found.");
  }

  member.trainer = trainerId;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});


//get change trainer form
Router.get("/:id/trainer/change", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    throw new customError(400, "Personal trainer services are available only to members with an Elite membership.");
  }

  //if trainer already assigned
  if (member.trainer == null) {
    throw new customError(400, "This member does not have a personal trainer assigned. Please use the assign trainer option.");
  }

  const trainers = await Trainer.find();
  res.render("./member/changeTrainer.ejs", { trainers, id });
});


//change trainer
Router.put("/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const { trainerId } = req.body;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    throw new customError(400, "Personal trainer services are available only to members with an Elite membership.");
  }

  //if trainer already assigned
  if (member.trainer == null) {
    throw new customError(400, "This member does not have a personal trainer assigned. Please use the assign trainer option.");
  }

  //verify trainer
  const trainer = await Trainer.findById(trainerId);
  if (!trainer) {
    throw new customError(404, "The selected trainer could not be found.");
  }

  member.trainer = trainerId;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});


//delete trainer 
Router.delete("/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  if (!member) {
    throw new customError(404, "The requested member could not be found.");
  }

  //if trainer already assigned
  if (member.trainer == null) {
    throw new customError(400, "This member does not have a personal trainer assigned.");
  }

  member.trainer = null;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});

module.exports = Router;