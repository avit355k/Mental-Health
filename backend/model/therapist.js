const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    qualifications: {
        type: String,
        required: true,
        trim: true
    },

    availableSlots: [
        {
            date: {
                type: Date,
                required: true
            },

            times: [
                {
                    time: {
                        type: String,
                        required: true
                    },
                    isBooked: {
                        type: Boolean,
                        default: false
                    }
                }
            ]
        }
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    pricePerSession: {
        type: Number,
    },
    bio: {
        type: String,
        trim: true
    },
    videoCallEneabled: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Therapist", therapistSchema);