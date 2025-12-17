const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },

    phoneNo: {
        type: String,
        required: true,
        unique: true,
        match: [/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number"]
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    role: {
        type: String,
        enum: ["user", "therapist", "admin"],
        default: "user"
    },

    avatar: {
        type: String,
        default: ""
    },

    dob: {
        type: Date,
        required: true
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
