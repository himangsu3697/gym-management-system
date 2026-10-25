const mongoose = require("mongoose");
const trainerSchema = new mongoose.Schema({
    tname: {
        type: String,
        required: [true, "Trainer name is required"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "Trainer email address is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    age: {
        type: Number,
        required: [true, "Trainer age is required"],
        min: [21, "Trainer must be at least 21 years old"]
    },

    experience: {
        type: Number,
        required: [true, "Trainer experience is required"],
        min: [1, "Trainer must have at least 1 year of experience"]
    }
});

const Trainer = mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;
