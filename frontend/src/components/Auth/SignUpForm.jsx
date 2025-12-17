import React, { useState } from "react";
import axios from "axios";
import { API } from "../../api/api";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    dob: "",
    gender: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API}/api/user/register`,
        formData
      );

      alert("Registration successful! Please login.");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg bg-white
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 py-2 rounded-lg bg-emerald-600 cursor-pointer
                   text-white font-medium hover:bg-emerald-700 transition"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
