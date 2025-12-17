import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { assessmentConfigs } from "../../data/assessmentConfigs";
import { FaCheckCircle } from "react-icons/fa";

const AssessmentResult = () => {
  const { id } = useParams();
  const { state } = useLocation();

  const config = assessmentConfigs[id];
  const score = state?.score ?? 0;
  const severity = config.getSeverity(score);

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white rounded-xl shadow p-8 text-center">

      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <FaCheckCircle className="text-emerald-600 text-6xl" />
      </div>

      <h2 className="text-xl font-semibold">{config.name} Results</h2>
      <p className="text-sm text-gray-500 mb-6">{config.fullName}</p>

      {/* Score Card */}
      <div className="bg-gray-100 rounded-lg py-6 mb-6">
        <p className="text-gray-500">Your Score</p>
        <p className="text-4xl font-bold">
          {score}
          <span className="text-lg text-gray-400">
            {" "} / {config.maxScore}
          </span>
        </p>
      </div>

      {/* Severity Card */}
      <div className="border rounded-lg py-4 mb-6">
        <p className="text-gray-500 mb-1">Severity Level</p>
        <p className={`text-lg font-semibold ${severity.color}`}>
          {severity.level}
        </p>
        <p className="text-sm text-gray-600">{severity.description}</p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-emerald-600 mb-8">
        Note: This assessment is for screening purposes only and does not
        constitute a medical diagnosis. Please consult a mental health
        professional for proper evaluation.
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Link
          to="/assessments"
          className="border px-6 py-2 rounded-lg hover:bg-gray-50"
        >
          Take Another Assessment
        </Link>

        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">
          Find a Therapist
        </button>
      </div>
    </div>
  );
};

export default AssessmentResult;
