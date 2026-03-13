const express = require('express');
const router = express.Router();

const Booking = require("../model/booking");
const Therapist = require("../model/therapist");
const User = require("../model/user");

// Create a new booking
router.post("/create", async (req, res) => {
    try {

        const { user, therapist, sessionType, sessionDate, sessionTime } = req.body;

        // check user
        const existingUser = await User.findById(user);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // check therapist
        const therapistData = await Therapist.findById(therapist);

        if (!therapistData) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        // prevent double booking
        const existingBooking = await Booking.findOne({
            therapist,
            sessionDate,
            sessionTime,
            status: { $ne: "cancelled" }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked"
            });
        }

        let fee = 0;
        let paymentStatus = "free";

        if (sessionType === "offline") {
            fee = therapistData.pricePerSession;
            paymentStatus = "pending";
        }

        const booking = await Booking.create({
            user,
            therapist,
            sessionType,
            sessionDate,
            sessionTime,
            fee,
            paymentStatus
        });

        res.status(201).json({
            success: true,
            message: "Session booked successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// GET BOOKINGS BY USER
router.get("/user/:userId", async (req, res) => {
    try {

        const bookings = await Booking.find({ user: req.params.userId })
        .populate("therapist");

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// GET BOOKINGS BY THERAPIST
router.get("/therapist/:therapistId", async (req, res) => {
    try {

        const bookings = await Booking.find({ therapist: req.params.therapistId })
        .populate("user", "name email avatar");

        res.status(200).json({
            success: true,
            bookings
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// GET SINGLE BOOKING
router.get("/:id", async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id)
        .populate("user", "name email")
        .populate("therapist");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// UPDATE BOOKING STATUS
router.patch("/:id/status", async (req, res) => {
    try {

        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// CANCEL BOOKING
router.delete("/:id", async (req, res) => {
    try {

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: "cancelled" },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Booking cancelled",
            booking
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

module.exports = router;
