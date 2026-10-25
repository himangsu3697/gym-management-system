const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
planName: {
    type: String,
    required: [true, "Membership plan is required"],
    enum: {
        values: ["Basic", "Premium", "Elite"],
        message: "Membership plan must be Basic, Premium, or Elite"
    },
    trim: true
},

durationInMonths: {
    type: Number,
    required: [true, "Membership duration is required"],
    enum: {
        values: [1, 3, 6, 12],
        message: "Membership duration must be 1, 3, 6, or 12 months"
    }
},

price: {
    type: Number,
    required: [true, "Membership price is required"],
    min: [1, "Membership price must be greater than 0"]
},

facilities: {
    type: [{
        type: String,
        enum: {
            values: [
                "Gym Access",
                "Locker",
                "Cardio Area",
                "Group Classes",
                "Personal Trainer",
                "Diet Consultation"
            ],
            message: "Invalid facility selected."
        },
        trim: true
    }],
    required: [true, "At least Gym Access and Locker are required"],
    validate: {
        validator: function (facilities) {
            return facilities.includes("Gym Access") &&
                   facilities.includes("Locker");
        },
        message: "Gym Access and Locker are mandatory facilities"
    }
},

description: {
    type: String,
    required: [true, "Membership description is required"],
    minlength: [10, "Membership description must contain at least 10 characters"],
    maxlength: [500, "Membership description cannot exceed 500 characters"],
    trim: true
},

status: {
    type: String,
    required: [true, "Membership status is required"],
    enum: {
        values: ["active", "inactive"],
        message: "Membership status must be either active or inactive"
    },
    default: "active"
}

});

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;
