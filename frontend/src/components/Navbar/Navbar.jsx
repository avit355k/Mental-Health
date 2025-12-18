import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { Menu, Close } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

import logo from "../../assets/logo/logo.png";
import avatarImg from "../../assets/avatar.png";

const Navlinks = [
  { name: "Assessments", path: "/assessments" },
  { name: "Chat Support", path: "/chat-support" },
  {
    name: "Relaxation",
    path: "/relaxation",
    sublinks: [
      { name: "Meditation", path: "/relaxation/meditation" },
      { name: "Breathing Exercises", path: "/relaxation/breathing-exercises" },
      { name: "Sleep Stories", path: "/relaxation/sleep-stories" },
    ],
  },
  {
    name: "Resources",
    path: "/resources",
    sublinks: [
      { name: "Articles", path: "/resources/articles" },
      { name: "Videos", path: "/resources/videos" },
      { name: "Guided Sessions", path: "/resources/guided-sessions" },
    ],
  },
  { name: "Consultants", path: "/consultants" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* Detect login state */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  /* Scroll shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setOpenProfileDropdown(false);
    navigate("/auth");
  };

  return (
    <nav
      className={`w-full sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 transition-shadow ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="CalmBridge Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 relative">
          {Navlinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-emerald-600"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                {link.name}
              </Link>

              {/* Dropdown */}
              {link.sublinks && (
                <div className="absolute left-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {link.sublinks.map((sublink) => (
                    <Link
                      key={sublink.name}
                      to={sublink.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Profile Avatar */}
          {isLoggedIn ? (
            <div className="relative hidden md:block">
              <button
                className="flex items-center gap-2 rounded-full focus:outline-none cursor-pointer"
                onClick={() =>
                  setOpenProfileDropdown(!openProfileDropdown)
                }
              >
                <img
                  src={avatarImg}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </button>

              {openProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Get Started
            </Link>
          )}

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <Close /> : <Menu />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          {Navlinks.map((link, index) => (
            <div key={link.name}>
              <div
                className="flex justify-between items-center font-medium text-gray-700 hover:text-emerald-600 cursor-pointer"
                onClick={() =>
                  setOpenMobileDropdown(
                    openMobileDropdown === index ? null : index
                  )
                }
              >
                <Link to={link.path}>{link.name}</Link>
                {link.sublinks && (
                  <span>
                    {openMobileDropdown === index ? (
                      <FaAngleUp />
                    ) : (
                      <FaAngleDown />
                    )}
                  </span>
                )}
              </div>

              {link.sublinks && openMobileDropdown === index && (
                <div className="pl-4 mt-2 space-y-2">
                  {link.sublinks.map((sublink) => (
                    <Link
                      key={sublink.name}
                      to={sublink.path}
                      className="block text-sm text-gray-600 hover:text-emerald-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Mobile Profile Section */}
          {isLoggedIn ? (
            <div className="mt-4 space-y-2">
              <Link
                to="/profile"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>

              <Link
                to="/dashboard"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="block mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-center hover:bg-emerald-700 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
