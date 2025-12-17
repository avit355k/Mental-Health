const mongoose = require("mongoose");

const assessmentResultSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= ASSESSMENT META ================= */
    assessmentId: {
      type: String,
      required: true,
      enum: ["phq9", "gad7", "mdq", "audit", "pss"],
      index: true,
    },

    assessmentName: {
      type: String,
      required: true,
      // "PHQ-9", "GAD-7", "MDQ", etc.
    },

    /* ================= SCORE ================= */
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    maxScore: {
      type: Number,
      required: true,
    },

    /* ================= SEVERITY SNAPSHOT ================= */
    severity: {
      level: {
        type: String,
        required: true,
        // Example: "Minimal", "Moderate", "Severe", "Positive"
      },
      description: {
        type: String,
        required: true,
        // Example: "Moderate anxiety"
      },
      color: {
        type: String,
        // Matches frontend Tailwind color classes
        // Example: "text-orange-600"
      },
    },

    /* ================= ANSWERS (OPTIONAL BUT USEFUL) ================= */
    answers: [
      {
        questionId: {
          type: Number,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],

    /* ================= DATE (FOR GRAPHS) ================= */
    assessmentDate: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0); // normalize day
        return d;
      },
      index: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* Prevent duplicate submission same day (optional but recommended) */
assessmentResultSchema.index(
  { userId: 1, assessmentId: 1, assessmentDate: 1 },
);

module.exports = mongoose.model("AssessmentResult", assessmentResultSchema);
