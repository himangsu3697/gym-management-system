const express = require("express");
const Router = express.Router();
const Trainer = require("../models/trainer.js");
const Member = require("../models/member.js");
const customError = require("../util/customError.js");


// get all trainers
Router.get("/", async (req, res) => {
  const trainers = await Trainer.find();
  res.render("./trainer/index.ejs", { trainers });
});


// get new trainer form
Router.get("/new", (req, res) => {
  res.render("./trainer/new.ejs");
});


// get a specific trainer
Router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw new customError(404, "Trainer not found");
  }

  const members = await Member.find({ trainer: id });
  res.render("./trainer/show.ejs", { trainer, members });
});


// create new Trainer
Router.post("/", async (req, res) => {
  const { tname, email, age, experience } = req.body;
  if (!tname || !email || !age || !experience) {
    throw new customError(400, "Please provide all required trainer details");
  }

  await Trainer.insertOne({ tname, email, age, experience });
  res.redirect("/flexora/trainer");
});


// get update trainer form
Router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw new customError(404, "Trainer not found");
  }

  res.render("./trainer/edit.ejs", { trainer });
});


// update trainer
Router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { tname, email, age, experience } = req.body;
  if (!tname || !email || !age || !experience) {
    throw new customError(400, "Please provide all required trainer details");
  }

  const trainer = await Trainer.findByIdAndUpdate(id, { tname, email, age, experience }, { runValidators: true });
  if (!trainer) {
    throw new customError(404, "Trainer not found");
  }

  res.redirect(`/flexora/trainer/${id}`);
});


// delete trainer
Router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const trainer = await Trainer.findById(id);
  if (!trainer) {
    throw new customError(404, "Trainer not found");
  }

  const members = await Member.find({ trainer: id });
  if (members.length > 0) {
    throw new customError(400, "Unable to delete the trainer because members are currently assigned to this trainer");
  }

  await Trainer.findByIdAndDelete(id);
  res.redirect("/flexora/trainer");
});

module.exports = Router;
