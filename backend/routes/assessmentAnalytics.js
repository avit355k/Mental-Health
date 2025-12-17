const express = require("express");
const router = express.Router();
const AssessmentResult = require("../model/AssessmentResult");
const { authenticateToken } = require("./userAuth");

// Daily Scores for Graph
router.get("/daily", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assessmentId, days = 7 } = req.query;

    if (!assessmentId) {
      return res.status(400).json({ message: "assessmentId required" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    startDate.setHours(0, 0, 0, 0);

    const results = await AssessmentResult.find({
      userId,
      assessmentId,
      assessmentDate: { $gte: startDate },
    })
      .sort({ assessmentDate: 1 })
      .select("assessmentDate score maxScore severity");

    const formatted = results.map(r => ({
      date: r.assessmentDate.toISOString().split("T")[0],
      score: r.score,
      maxScore: r.maxScore,
      severity: r.severity.level,
    }));

    res.json({ success: true, data: formatted });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Latest result per assessment
router.get("/latest", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const latest = await AssessmentResult.aggregate([
      { $match: { userId } },
      { $sort: { assessmentDate: -1 } },
      {
        $group: {
          _id: "$assessmentId",
          assessmentName: { $first: "$assessmentName" },
          score: { $first: "$score" },
          maxScore: { $first: "$maxScore" },
          severity: { $first: "$severity" },
          date: { $first: "$assessmentDate" },
        },
      },
      { $sort: { assessmentName: 1 } },
    ]);

    res.json({ success: true, data: latest });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//  Overall Mental Health Summary
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await AssessmentResult.find({ userId });

    if (!results.length) {
      return res.json({
        success: true,
        summary: {
          averageScore: 0,
          highestSeverity: "None",
          needsAttention: false,
        },
      });
    }

    const avg =
      results.reduce((sum, r) => sum + r.score, 0) / results.length;

    const severityRank = {
      minimal: 1,
      mild: 2,
      moderate: 3,
      severe: 4,
    };

    let highest = results.reduce((max, r) => {
      return severityRank[r.severity.key] >
        severityRank[max.severity.key]
        ? r
        : max;
    });

    res.json({
      success: true,
      summary: {
        averageScore: avg.toFixed(1),
        highestSeverity: highest.severity.level,
        needsAttention:
          highest.severity.key === "severe" ||
          highest.severity.key === "moderate",
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;