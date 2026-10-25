const express = require("express");
const Router = express.Router();
const Membership = require("../models/membership.js");
const customError = require("../util/customError.js");


//get all memberships
Router.get("/", async (req, res) => {
  const memberships = await Membership.find();
  if (memberships.length === 0) {
    throw new customError(404, "No memberships were found.");
  }
  res.render("./membership/index.ejs", { memberships });
});


//get add membership form
Router.get("/new", (req, res) => {
  res.render("./membership/new.ejs");
});


//filter plans
Router.get("/filter", async (req, res) => {
  const { plan } = req.query;
  if (!plan) {
    throw new customError(400, "A valid membership plan is required.");
  }
  const memberships = await Membership.find({ planName: plan });
  if (memberships.length === 0) {
    throw new customError(404, "No memberships were found for the selected plan.");
  }
  res.render("./membership/index.ejs", { memberships });
});


//get a specific membership
Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const membership = await Membership.findById(id);
  if (!membership) {
    throw new customError(404, "The requested membership could not be found.");
  }
  res.render("./membership/show.ejs", { membership });
});


//add new membership
Router.post("/", async (req, res) => {
  const { planName, durationInMonths, price, facilities, description, status } = req.body;
  if (!planName || !durationInMonths || !price || !facilities || !description) {
    throw new customError(400, "Please provide all required membership details.");
  }
  await Membership.insertOne({ planName, durationInMonths, price, facilities, description, status });
  res.redirect("/flexora/membership");
});


//get update membership form
Router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const membership = await Membership.findById(id);
  if (!membership) {
    throw new customError(404, "The membership you are trying to edit could not be found.");
  }
  res.render("./membership/edit.ejs", { membership });
});


//update the membership
Router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { planName, durationInMonths, price, facilities, description, status } = req.body;
  if (!planName || !durationInMonths || !price || !facilities || !description || !status) {
    throw new customError(400, "Please provide all required membership details.");
  }
  const membership = await Membership.findByIdAndUpdate(id, { planName, durationInMonths, price, facilities, description, status }, { runValidators: true });
  if (!membership) {
    throw new customError(404, "The membership you are trying to update could not be found.");
  }
  res.redirect(`/flexora/membership/${id}`);
});


//delete a membership
Router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const membership = await Membership.findByIdAndDelete(id);
  if (!membership) {
    throw new customError(404, "The membership you are trying to delete could not be found.");
  }
  res.redirect("/flexora/membership");
});

module.exports = Router;

