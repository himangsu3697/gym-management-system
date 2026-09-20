const mongoose = require("mongoose");
const Membership = require("../models/membership.js");
const Trainer = require("../models/trainer.js");
const memberSchema = new mongoose.Schema({
    mname: {
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
        min: 16
    },

    workoutPlan: {
        type: String
    },

    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer"
    },

    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Membership"
    },
    
    membershipStartDate: {
        type: Date
    },

    membershipEndDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;