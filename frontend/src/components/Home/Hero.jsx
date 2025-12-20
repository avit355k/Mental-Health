import React from "react";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
          <FaShieldAlt className="text-emerald-600" />
          Safe, Confidential & Professional
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Bridge to{" "}
          <span className="text-emerald-600">Mental</span>
          <br />
          <span className="text-emerald-600">Wellness</span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed">
          Take control of your mental health journey. Assess your well-being,
          connect with professional therapists, and discover tools for lasting
          peace.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/assessments")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition cursor-pointer"
          >
            Take Assessment
            <FaArrowRight />
          </button>

          <button
            onClick={() => navigate("/consultants")}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Find a Therapist
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
