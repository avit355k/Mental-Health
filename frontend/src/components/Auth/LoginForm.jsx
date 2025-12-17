import React, { useState } from "react";
import axios from "axios";
import { API } from "../../api/api";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/user/login`,
        formData
      );

      // Optional: save token
      localStorage.setItem("token", res.data.token);

      // Navigate to home page
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
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
          placeholder="••••••••"
          required
          className="mt-1 w-full px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-4 py-2 rounded-lg bg-emerald-600
                   text-white font-medium hover:bg-emerald-700 transition cursor-pointer"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
