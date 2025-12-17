const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { authenticateToken } = require("./userAuth");
require('dotenv').config();

//sign-up
router.post("/register", async (req, res) => {
    try {
        const { name, email, phoneNo, password, dob, gender } = req.body;

        if (!name || !email || !phoneNo || !password || !dob || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNo }]
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const user = await User.create({
            name,
            email,
            phoneNo,
            password: hashedPassword,
            dob,
            gender
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Sign-in attempt for user: ${email}`);

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password required" });
        }

        //  Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        //  Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Stored Hashed Password:", user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            console.log("Invalid password");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //  JWT payload
        const authClaims = {
            id: user._id,
            role: user.role
        };

        // Generate token
        const token = jwt.sign(
            authClaims,
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        console.log("Token generated");

        //Response
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Sign-in error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get User Information
router.get("/user-info", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add profile avatar
//update user details(name, phoneNo, dob, gender,avatar)
router.put("/update-profile", authenticateToken, async (req, res) => {
    try {
        const { name, phoneNo, dob, gender } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phoneNo, dob, gender },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;