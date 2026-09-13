const mongoose = require("mongoose");
const trannerSchema = new mongoose.Schema({
    tname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        min: 18
    },

    experience: {
        type: Number,
        required: true,
        min: 2
    }
});

const Tranner = mongoose.model("Tranner", trannerSchema);

module.exports = Tranner;

