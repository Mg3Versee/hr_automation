"use client";

import React, { useState } from "react";
import Login from "../loginForm/Login";
import SignUp from "../loginForm/SignUp";
import Button from "../button/Button";


interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {isLogin ? <Login /> : <SignUp />}

      </div>
    </div>
  );
};

export default AuthModal;
