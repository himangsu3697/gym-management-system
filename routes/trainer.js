const express = require("express");
const Router = express.Router();
const Trainer = require("../models/trainer.js");
const Member = require("../models/member.js");
const Membership = require("../models/membership.js");

//get all trainers
Router.get("/", async(req, res) => {
  const trainers = await Trainer.find();
  res.render("./trainer/index.ejs", {trainers});
});

//get new trainer form
Router.get("/new", (req, res) => {
  res.render("./trainer/new.ejs");
});

//get a speific trainer
Router.get("/:id", async(req, res) => {
  const {id} = req.params;
  const trainer = await Trainer.findById(id);
  const members = await Member.find({trainer : id});
  res.render("./trainer/show.ejs", {trainer, members});
});

//create new Trainer
Router.post("/", async(req, res) => {
  const {tname, email, age, experience} = req.body;
  await Trainer.insertOne({tname, email, age, experience});
  res.redirect("/flexora/trainer");
});

//get update trainer form
Router.get("/:id/edit", async(req, res) => {
  const {id} = req.params;
  const trainer = await Trainer.findById(id);
  res.render("./trainer/edit.ejs", {trainer});
});

//update trainer
Router.put("/:id", async(req, res) => {
  const {id} = req.params;
  const {tname, email, age, experience} = req.body;
  await Trainer.findByIdAndUpdate(id, {tname, email, age, experience});
  res.redirect(`/flexora/trainer/${id}`);
});

//delete tariner
Router.delete("/:id", async(req, res) => {
  const {id} = req.params;
  await Trainer.findByIdAndDelete(id);
  res.redirect("/flexora/trainer");
});

module.exports = Router;