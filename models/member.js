const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    mname: {
        type: String,
        required: [true, "Member name is required"],
        trim: true,
        minlength: [2, "Member name must be at least 2 characters long"],
        maxlength: [50, "Member name cannot exceed 50 characters"]
    },

    email: {
        type: String,
        required: [true, "Member email address is required"],
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
        required: [true, "Member age is required"],
        min: [16, "Member must be at least 16 years old"]
    },

    workoutPlan: {
        type: String,
        maxlength: [100, "Workout plan cannot exceed 100 characters"]
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
        enum: {
            values: ["active", "inactive"],
            message: "Member status must be either active or inactive"
        },
        default: "inactive"
    }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;