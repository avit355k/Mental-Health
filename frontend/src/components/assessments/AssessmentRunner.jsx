import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assessmentConfigs } from "../../data/assessmentConfigs";
import { API } from "../../api/api";

const AssessmentRunner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const config = assessmentConfigs[id];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  if (!config) {
    return <div className="text-center mt-10">Assessment not found</div>;
  }

  const question = config.questions[current];
  const total = config.questions.length;
  const progress = ((current + 1) / total) * 100;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const score = Object.values(answers).reduce((a, b) => a + b, 0);
      const severity = config.getSeverity(score);

      // Convert answers object → array
      const formattedAnswers = Object.entries(answers).map(
        ([index, value]) => ({
          questionId: config.questions[index].id,
          value,
        })
      );

      const token = localStorage.getItem("token");

      await fetch(`${API}/api/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessmentId: config.id,
          assessmentName: config.name,
          score,
          maxScore: config.maxScore,
          severity: {
            level: severity.level,
            key: severity.level.toLowerCase().replace(" ", "_"),
            description: severity.description,
          },
          answers: formattedAnswers,
        }),
      });

      // Navigate to result page
      navigate(`/assessments/${id}/result`, {
        state: { score },
      });

    } catch (err) {
      console.error("Assessment submit failed", err);
      alert("Failed to submit assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      {/* Header */}
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">{config.name}</h2>
          <p className="text-sm text-gray-500">{config.fullName}</p>
        </div>
        <span className="text-sm text-gray-500">
          {current + 1} of {total}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-emerald-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-4">{config.description}</p>

      {/* Question */}
      <div className="border rounded-lg p-5">
        <h3 className="font-medium mb-4">{question.text}</h3>

        <div className="space-y-3">
          {question.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex gap-3 p-3 border rounded-lg cursor-pointer transition
              ${answers[current] === opt.value
                  ? "border-emerald-600 bg-emerald-50"
                  : "hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                checked={answers[current] === opt.value}
                onChange={() =>
                  setAnswers({ ...answers, [current]: opt.value })
                }
                className="accent-emerald-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
          className="border px-4 py-2 rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>

        {current === total - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={answers[current] === undefined || loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit ✔"}
          </button>
        ) : (
          <button
            disabled={answers[current] === undefined}
            onClick={() => setCurrent((c) => c + 1)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentRunner;
