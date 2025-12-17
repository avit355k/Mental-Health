import React from "react";
import { FaClock, FaClipboardList, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({
  id,
  tag,
  title,
  subtitle,
  description,
  questions,
  duration,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
      
      <span className="inline-block mb-3 px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
        {tag}
      </span>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

      <p className="text-sm text-gray-600 mb-5">{description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-1">
          <FaClipboardList />
          {questions} questions
        </div>
        <div className="flex items-center gap-1">
          <FaClock />
          {duration}
        </div>
      </div>

      <button
        onClick={() => navigate(`/assessments/${id}`)}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition"
      >
        Start Assessment
        <FaArrowRight />
      </button>
    </div>
  );
};

export default AssessmentCard;
