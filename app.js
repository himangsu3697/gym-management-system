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
const memberRoutes = require("./routes/member.js");
const App = express();
const port = 8080;

//body parser
App.use(express.urlencoded({ extended: true}));
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
});

//home route
App.get("/flexora", async (req, res) => {
  res.render("./home.ejs");
});

//membership routes
App.use("/flexora/membership", membershipRoutes);

//trainer routes
App.use("/flexora/trainer", trainerRoutes);

//member routes
App.use("/flexora/member", memberRoutes);

App.listen(port, () => {
  console.log("App is listning at the port : ", port);
});



