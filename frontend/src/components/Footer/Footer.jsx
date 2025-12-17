import React from "react";
import { FaPhoneAlt, FaEnvelope, FaHeart } from "react-icons/fa";
import logo from "../../assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="CalmBridge Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your bridge to mental wellness. Professional support, right when
              you need it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-emerald-600 cursor-pointer">
                Assessments
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Chat Support
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Relaxation
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Find a Therapist
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-emerald-600 cursor-pointer">
                Articles
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Videos
              </li>
              <li className="hover:text-emerald-600 cursor-pointer">
                Audio Library
              </li>
            </ul>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Crisis Support</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you're in crisis, please reach out:
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-emerald-600 font-medium">
                <FaPhoneAlt />
                988 (Suicide & Crisis Lifeline)
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <FaEnvelope />
                support@calmbridge.com
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-600">
          Made with{" "}
          <FaHeart className="inline text-red-500 mx-1" /> for your mental
          wellness
        </div>
      </div>
    </footer>
  );
};

export default Footer;
