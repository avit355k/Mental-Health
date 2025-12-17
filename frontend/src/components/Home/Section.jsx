import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { IoSparklesOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Section = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="relative overflow-hidden rounded-2xl bg-emerald-600 text-white px-8 py-16 text-center">

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10"></div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6">
          <IoSparklesOutline />
          Start Your Journey Today
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
          Take the First Step Towards Better <br className="hidden md:block" />
          Mental Health
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-white/90 mb-10">
          Join thousands who have found peace and clarity through CalmBridge.
          Your mental wellness journey begins with a single step.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-900 transition font-medium"
          >
            Create Free Account
            <FaArrowRight />
          </Link>

          <Link
            to="/chat-support"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 hover:bg-white/10 transition font-medium"
          >
            Try Chat Support
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Section;
