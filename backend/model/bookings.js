const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Therapist',
        required: true
    },

    sessionType: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },

    sessionDate: {
        type: Date,
        required: true
    },

    sessionTime: {
        type: String,
        required: true
    },

    fee: {
        type: Number,
        default: 0
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'free'],
        default: 'free'
    },

    meetingLink: {
        type: String
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);