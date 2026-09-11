const mongoose = require("mongoose");
const Membership = require("../models/membership.js");
const membershipData = require("./membershipData.js");
const Trainer = require("../models/trainer.js");
const trainerData = require("./trainerData.js");


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

main().then((res) =>{
    console.log("connection successfull");
});

const initDb = async () => {
    await Membership.deleteMany();
    await Trainer.deleteMany();
    await Membership.insertMany(membershipData);
    await Trainer.insertMany(trainerData);
};
initDb().then((res) => {
    console.log("data inserted successfully");
});







