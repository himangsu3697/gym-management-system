const express = require("express");
const App = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const membershipRoutes = require("./routes/membership.js");
const trainerRoutes = require("./routes/trainer.js");
const memberRoutes = require("./routes/member.js");
const handleExpiredMembership = require("./util/removeExpiredMembership.js");
const customError = require("./util/customError.js");
const port = 8080;

//body parser
App.use(express.urlencoded({ extended: true }));
App.use(express.json());

//view engine setup
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "views"));
App.engine("ejs", ejsMate);

//public folder setup
App.use(express.static(path.join(__dirname, "public")));

//handle method override
App.use(methodOverride("_method"));

//database connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
}
main().then((res) => {
  console.log("connection successfull");

  //handle expiry membership
  handleExpiredMembership();

  setInterval(() => {
    handleExpiredMembership();
  }, 60 * 60 * 1000);
});

//home route
App.get("/flexora", (req, res) => {
  res.render("./home.ejs");
});

//about route
App.get("/flexora/about", (req, res) => {
  res.render("./about.ejs");
});

//contact route
App.get("/flexora/contact", (req, res) => {
  res.render("./contact.ejs");
});

//membership routes
App.use("/flexora/membership", membershipRoutes);

//trainer routes
App.use("/flexora/trainer", trainerRoutes);

//member routes
App.use("/flexora/member", memberRoutes);

//invalid route
App.use((req, res) => {
  throw new customError(404, "Page not found");
});

//error handling middlewere
App.use((err, req, res, next) => {

  //mongoose invalid id error
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).render("./error.ejs", {status : 400, message : "Invalid ID"});
  }
  //normal error
  const { status = 500, message = "Something went wrong" } = err;
  res
  .status(status)
  .render("./error.ejs", {status, message});
});

App.listen(port, () => {
  console.log("App is listning at the port : ", port);
});





