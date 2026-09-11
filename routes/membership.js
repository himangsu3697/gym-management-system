const express = require("express");
const Membership = require("../models/membership.js");
const Router = express.Router();

//get all memberships
Router.get("/", async(req, res) => {
  const memberships = await Membership.find();
  res.render("./membership/index.ejs", {memberships}); 
});

//get add membership form
Router.get("/new", (req, res) => {
  res.render("./membership/new.ejs");
});

//get a specific membership
Router.get("/:id", async(req, res) => {
  const {id} = req.params;
  const membership = await Membership.findById(id);
  res.render("./membership/show.ejs", {membership});
});

//add new membership
Router.post("/", async(req, res) => {
  const {planName, durationInMonths, price, facilities, description, status} = req.body;
  await Membership.insertOne({planName, durationInMonths, price, facilities, description, status});
  res.redirect("/flexora/membership");
});

//get update membership form
Router.get("/:id/edit", async(req, res) => {
  const  {id} = req.params;
  const membership = await Membership.findById(id);
  res.render("./membership/edit.ejs", {membership});
});

//update the membership
Router.put("/:id", async(req, res) => {
  const {id} = req.params;
  const {planName, durationInMonths, price, facilities, description, status} = req.body;
  await Membership.findByIdAndUpdate(id, {planName, durationInMonths, price, facilities, description, status});
  res.redirect(`/flexora/membership/${id}`);
});

//delete a membership
Router.delete("/:id", async(req, res) => {
  const {id} = req.params;
  await Membership.findByIdAndDelete(id);
  res.redirect("/flexora/membership");
});

module.exports = Router;
