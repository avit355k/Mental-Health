import React from "react";
import { FaStar, FaCalendarAlt, FaVideo, FaPhoneAlt } from "react-icons/fa";

const consultants = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Clinical Psychology",
    description:
      "Specializing in anxiety, depression, and stress management with over 15 years of experience.",
    experience: "15 years exp.",
    price: "$120/session",
    rating: 4.9,
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Cognitive Behavioral Therapy",
    description:
      "Expert in CBT techniques for treating anxiety disorders, OCD, and phobias.",
    experience: "12 years exp.",
    price: "$100/session",
    rating: 4.8,
  },
  {
    name: "Dr. Emily Rodriguez",
    specialization: "Trauma & PTSD",
    description:
      "Compassionate therapist specializing in trauma recovery and EMDR therapy.",
    experience: "10 years exp.",
    price: "$110/session",
    rating: 4.7,
  },
  {
    name: "Dr. James Williams",
    specialization: "Addiction Counseling",
    description:
      "Dedicated to helping individuals overcome substance dependency and addiction.",
    experience: "14 years exp.",
    price: "$105/session",
    rating: 4.9,
  },
  {
    name: "Dr. Priya Patel",
    specialization: "Child & Adolescent Psychology",
    description:
      "Warm and caring approach to helping young minds grow emotionally strong.",
    experience: "9 years exp.",
    price: "$95/session",
    rating: 4.8,
  },
];

const Consultant = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Connect with Licensed Mental Health Professionals
        </h1>
        <p className="text-gray-500">
          Book sessions with experienced and trusted consultants
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
          >
            {/* Top */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{doc.name}</h2>

                {/* Rating */}
                <span className="flex items-center gap-1 bg-gray-800 text-white text-sm px-2 py-1 rounded-full">
                  <FaStar className="text-yellow-400 text-xs" />
                  {doc.rating}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-600 mb-3">
                {doc.specialization}
              </p>

              <p className="text-sm text-gray-500 mb-5">
                {doc.description}
              </p>
            </div>

            {/* Info */}
            <div className="flex justify-between items-center text-sm mb-5">
              <span className="text-gray-600">{doc.experience}</span>
              <span className="font-semibold">{doc.price}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                <FaCalendarAlt />
                Book
              </button>

              <button className="border rounded-lg p-2 hover:bg-gray-100">
                <FaVideo />
              </button>

              <button className="border rounded-lg p-2 hover:bg-gray-100">
                <FaPhoneAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Consultant;
