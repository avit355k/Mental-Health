const express = require('express');
const router = express.Router();
const Therapist = require("../model/therapist");
const User = require("../model/user");

// Create Therapist Profile
router.post("/create", async (req, res) => {
    try {

        const { user } = req.body;

        // check user exists
        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // prevent duplicate therapist profile
        const alreadyTherapist = await Therapist.findOne({ user });

        if (alreadyTherapist) {
            return res.status(400).json({
                success: false,
                message: "Therapist profile already exists"
            });
        }

        const therapist = await Therapist.create(req.body);

        res.status(201).json({
            success: true,
            message: "Therapist profile created successfully",
            therapist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// Get All Therapists
router.get("/all", async (req, res) => {
    try {

        const therapists = await Therapist.find()
        .populate("user", "name email avatar");

        res.status(200).json({
            success: true,
            count: therapists.length,
            therapists
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// Get Therapist by ID
router.get("/:id", async (req, res) => {
    try {

        const therapist = await Therapist.findById(req.params.id)
        .populate("user", "name email avatar");

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        res.status(200).json({
            success: true,
            therapist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

//update therapist profile
router.put("/:id", async (req, res) => {
    try {

        const therapist = await Therapist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        res.status(200).json({
            success: true,
            therapist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// Delete Therapist
router.delete("/:id", async (req, res) => {
    try {

        const therapist = await Therapist.findByIdAndDelete(req.params.id);

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Therapist deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

//add available slots for therapist
router.post("/:id/add-slot", async (req, res) => {

    try {

        const { date, times } = req.body;

        const therapist = await Therapist.findById(req.params.id);

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        const slot = {
            date,
            times: times.map(t => ({ time: t }))
        };

        therapist.availableSlots.push(slot);

        await therapist.save();

        res.status(200).json({
            success: true,
            message: "Slot added successfully",
            availableSlots: therapist.availableSlots
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// Get Therapist Available Slots
router.get("/:id/slots", async (req, res) => {

    try {

        const therapist = await Therapist.findById(req.params.id);

        if (!therapist) {
            return res.status(404).json({
                success: false,
                message: "Therapist not found"
            });
        }

        res.status(200).json({
            success: true,
            availableSlots: therapist.availableSlots
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// Remove AVAILABLE SLOTS
router.delete("/:id/slot/:slotId", async (req, res) => {

    try {

        const therapist = await Therapist.findById(req.params.id);

        therapist.availableSlots = therapist.availableSlots.filter(
            slot => slot._id.toString() !== req.params.slotId
        );

        await therapist.save();

        res.status(200).json({
            success: true,
            message: "Slot removed"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;