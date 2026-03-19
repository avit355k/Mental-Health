const express = require('express');
const router = express.Router();

const Booking = require("../model/bookings");
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

        // Find Slot
        const slotDate = therapistData.availableSlots.find(
            slot => slot.date.toISOString().split("T")[0] === sessionDate
        );

        if (!slotDate) {
            return res.status(400).json({
                success: false,
                message: "Selected date is not available"
            });
        }

        const timeSlot = slotDate.times.find(
            t => t.time === sessionTime
        );

        if (!timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Selected time not available"
            });
        }

        if (timeSlot.isBooked) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked"
            });
        }

        // prevent double booking (extra protection)
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
        let roomId = null;

        if (sessionType === "offline") {
            fee = therapistData.pricePerSession;
            paymentStatus = "pending";
        }
         // generate WebRTC room only for online sessions
        if (sessionType === "online") {
            roomId = `room_${Date.now()}_${user}`;
        }

        const booking = await Booking.create({
            user,
            therapist,
            sessionType,
            sessionDate,
            sessionTime,
            fee,
            paymentStatus,
            roomId
        });

        // MARK SLOT BOOKED
        timeSlot.isBooked = true;

        await therapistData.save();

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
            .populate("therapist")
            .populate("user", "name email");

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
router.get("/therapist/:userId", async (req, res) => {
  try {

    // find therapist profile using user id
    const therapist = await Therapist.findOne({ user: req.params.userId });

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist profile not found"
      });
    }

    const bookings = await Booking.find({ therapist: therapist._id })
      .populate("user", "name email avatar")
      .populate({
        path: "therapist",
        populate: {
          path: "user",
          select: "name email avatar"
        }
      });

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

// start video call (only for online sessions)
router.get("/:id/start-call", async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "therapist",
        populate: {
          path: "user",
          select: "name email"
        }
      });

    if (!booking) {
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    if (booking.sessionType !== "online") {
      return res.status(400).json({
        success:false,
        message:"Video call only for online sessions"
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success:false,
        message:"Session cancelled"
      });
    }

    // build session start time
    const sessionStart = new Date(
      `${booking.sessionDate.toISOString().split("T")[0]} ${booking.sessionTime}`
    );

    const sessionEnd = new Date(
      sessionStart.getTime() + booking.duration * 60 * 1000
    );

    const now = new Date();

    const joinEarly = new Date(sessionStart.getTime() - 10 * 60 * 1000);

    if (now < joinEarly) {
      return res.status(400).json({
        success:false,
        status:"waiting",
        message:"Session not started yet",
        joinTime: joinEarly
      });
    }

    if (now > sessionEnd) {
      return res.status(400).json({
        success:false,
        status:"expired",
        message:"Session has ended"
      });
    }

    res.status(200).json({
      success:true,
      status:"live",
      message:"Join session",
      roomId: booking.roomId,
      sessionEnd
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
});

// UPDATE BOOKING STATUS
router.patch("/:id/status", async (req, res) => {
  try {

    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
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

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        const therapist = await Therapist.findById(booking.therapist);

        const slotDate = therapist.availableSlots.find(
            slot => slot.date.toISOString().split("T")[0] === booking.sessionDate.toISOString().split("T")[0]
        );

        if(slotDate){
            const timeSlot = slotDate.times.find(
                t => t.time === booking.sessionTime
            );

            if(timeSlot){
                timeSlot.isBooked = false;
            }
        }

        await therapist.save();

        booking.status = "cancelled";
        await booking.save();

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
module.exports = router;
