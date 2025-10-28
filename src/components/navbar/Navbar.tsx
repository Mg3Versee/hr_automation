"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import AuthModal from "../modal/AuthModal";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/candidates", label: "Candidates" },
    { path: "/scheduler", label: "Scheduling" },
    { path: "/assessments", label: "Assessments" },
    { path: "/interview-results", label: "Interview Results" },
  ];

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TalentFlow AI
            </Link>

            {/* Navigation */}
            <nav className="ml-10 hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Login/Signup Button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <User size={18} />
            Login / Signup
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
