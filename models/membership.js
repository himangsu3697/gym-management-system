const mongoose = require("mongoose");
const membershipSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    durationInMonths: {
        type: Number,
        required: true,
        min: 1
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    facilities: [{
        type: String
    }],

    description: {
        type: String
    },
    
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
});

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;