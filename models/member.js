const mongoose = require("mongoose");
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
    }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;