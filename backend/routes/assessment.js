const express = require('express');
const router = express.Router();
const AssessmentResult = require("../model/AssessmentResult");
const { authenticateToken } = require("./userAuth");

// Submit or Replace Assessment (same day)
router.post("/submit", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      assessmentId,
      assessmentName,
      score,
      maxScore,
      severity,
      answers = [],
    } = req.body;

    // Basic validation
    if (
      !assessmentId ||
      !assessmentName ||
      score === undefined ||
      !maxScore ||
      !severity?.level
    ) {
      return res.status(400).json({ message: "Invalid assessment data" });
    }

    // Normalize today's date (00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert (replace if same day, create if new)
    const result = await AssessmentResult.findOneAndUpdate(
      {
        userId,
        assessmentId,
        assessmentDate: today,
      },
      {
        userId,
        assessmentId,
        assessmentName,
        score,
        maxScore,
        severity,
        answers,
        assessmentDate: today,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Assessment result saved successfully",
      result,
    });

  } catch (error) {
    console.error("Assessment submit error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
