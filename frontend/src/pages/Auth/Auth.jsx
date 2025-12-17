import React, { useState } from "react";
import logo from "../../assets/logo/logo.png";
import SignUpForm from "../../components/Auth/SignUpForm";
import LoginForm from "../../components/Auth/LoginForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="CalmBridge Logo" className="h-12 w-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Welcome to CalmBridge
        </h2>
        <p className="text-center text-sm text-gray-600 mt-1">
          Your journey to mental wellness starts here
        </p>

        {/* Toggle */}
        <div className="flex mt-6 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition cursor-pointer
              ${!isSignUp ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition cursor-pointer
              ${isSignUp ? "bg-white shadow text-gray-900" : "text-gray-600"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        {isSignUp ? <SignUpForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default Auth;
