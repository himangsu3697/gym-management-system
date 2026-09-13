const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Member = require("./models/member.js");
const Membership = require("./models/membership.js");
const Trainer = require("./models/trainer.js");
const methodOverride = require("method-override");
const membershipRoutes = require("./routes/membership.js");
const trainerRoutes = require("./routes/trainer.js");
const App = express();
const port = 8080;

//body parser
App.use(express.urlencoded({ extended: true }));
App.use(express.json());

//view engine setup
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "views"));
App.engine("ejs", ejsMate);

//handle method override
App.use(methodOverride("_method"));


//database connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
}
main().then((res) => {
  console.log("connection successfull");
});

//home route
App.get("/flexora", async (req, res) => {
  res.render("./home.ejs");
});

//membership routes
App.use("/flexora/membership", membershipRoutes);

//trainer routes
App.use("/flexora/trainer", trainerRoutes);

//member crud operation
//get all members
App.get("/flexora/member", async (req, res) => {
  const members = await Member.find();
  res.render("./member/index.ejs", { members });
});

//get new member form
App.get("/flexora/member/new", (req, res) => {
  res.render("./member/new.ejs");
});

//view a specific member
App.get("/flexora/member/:id", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);
  res.render("./member/show.ejs", { member });
});

//add new member
App.post("/flexora/member", async (req, res) => {
  const { mname, email, age, workoutPlan } = req.body;
  await Member.insertOne({ mname, email, age, workoutPlan });
  res.redirect("/flexora/member");
});

//get update member form
App.get("/flexora/member/:id/edit", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);
  res.render("./member/edit.ejs", { member });
});

//update member
App.put("/flexora/member/:id", async (req, res) => {
  const { id } = req.params;
  const { mname, email, age, workoutPlan } = req.body;
  await Member.findByIdAndUpdate(id, { mname, email, age, workoutPlan });
  res.redirect(`/flexora/member/${id}`);
});

//delete member
App.delete("/flexora/member/:id", async (req, res) => {
  const { id } = req.params;
  await Member.findByIdAndDelete(id);
  res.redirect("/flexora/member");
});

//get membership assignment form
App.get("/flexora/member/:id/membership", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  //if membership already assigned
  if (member.membership != null) {
    return res.send("membership already assigned go for change membership");
  }
  const memberships = await Membership.find();
  res.render("./member/selectMembership.ejs", { memberships, id });
});

//membership assignment
App.post("/flexora/member/:id/membership", async (req, res) => {
  const { id } = req.params;
  const { membershipId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(membershipId);

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
App.get("/flexora/member/:id/membership/change", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  //if membership dosent exist
  if (member.membership == null) {
    return res.send("membership not assigned");
  }

  const memberships = await Membership.find();
  res.render("./member/changeMembership.ejs", { memberships, id });
});

//change membership
App.put("/flexora/member/:id/membership", async (req, res) => {
  const { id } = req.params;
  const { membershipId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(membershipId);

  //if membership dosent exist
  if (member.membership == null) {
    return res.send("membership not assigned");
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
App.delete("/flexora/member/:id/membership", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  //if membership dosent assigned
  if (member.membership == null) {
    return res.send("membership not assigned");
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
App.get("/flexora/member/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    return res.send("only elite members can have personal trainers");
  }

  //if trainer already assigned
  if (member.trainer != null) {
    return res.send("trainer already assigned go for change trainer");
  }
  const trainers = await Trainer.find();
  res.render("./member/selectTrainer.ejs", { trainers, id });
});

//trainer assignment
App.post("/flexora/member/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const { trainerId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    return res.send("only elite members can have personal trainers");
  }

  //if trainer already assigned
  if (member.trainer != null) {
    return res.send("trainer already assigned go for change trainer");
  }

  member.trainer = trainerId;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});

//get change trainer form
App.get("/flexora/member/:id/trainer/change", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    return res.send("only elite members can have personal trainers");
  }

  //trainer not assigned
  if (member.trainer == null) {
    return res.send("trainer not assigned");
  }

  const trainers = await Trainer.find();
  res.render("./member/changeTrainer.ejs", { trainers, member });
});

//change trainer
App.put("/flexora/member/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const { trainerId } = req.body;
  const member = await Member.findById(id);
  const membership = await Membership.findById(member.membership);

  //membership plan check
  if (!membership || membership.planName !== "Elite") {
    return res.send("only elite members can have personal trainers");
  }

  member.trainer = trainerId;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});

//delete trainer 
App.delete("/flexora/member/:id/trainer", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);

  //checks for trainer exist
  if (member.trainer == null) {
    return res.send("trainer dosent exist");
  }
  member.trainer = null;
  await member.save();
  res.redirect(`/flexora/member/${id}`);
});

App.listen(port, () => {
  console.log("App is listning at the port : ", port);
})




