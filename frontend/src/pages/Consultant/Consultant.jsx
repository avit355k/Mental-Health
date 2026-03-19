import React from "react";
import { useEffect, useState } from "react";
import { FaStar, FaCalendarAlt, FaVideo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { API } from "../../api/api";
import axios from 'axios';

const Consultant = () => {
  const [consultants, setConsultants] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  /* Detect login state */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchConsultants = async () => {
    try {
      const res = await axios.get(`${API}/api/therapist/all`);
      setConsultants(res.data.therapists);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  /* Handle booking */
  const handleBooking = (consultantId) => {
    if (!isLoggedIn) {
      alert("Please login to continue booking.");
      return;
    }

    navigate(`/booking/${consultantId}`);
  };

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
        {consultants.map((doc) => (
          <div
            key={doc._id}
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
                {doc.bio}
              </p>
            </div>

            {/* Info */}
            <div className="flex justify-between items-center text-sm mb-5">
              <span className="text-gray-600">{doc.experience} years exp.</span>
              <span className="font-semibold">₹{doc.pricePerSession}/session</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBooking(doc._id)}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-white cursor-pointer
                ${isLoggedIn
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                <FaCalendarAlt />
                Book
              </button>

              <button className="border rounded-lg p-2 hover:bg-gray-100">
                <FaVideo />
              </button>


            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Consultant;
