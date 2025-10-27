"use client";

import React, { useState } from "react";
import LoginForm from "../Auth/LoginForm";
import SignupForm from "../Auth/SignupForm";

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

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          {isLogin ? "Welcome Back 👋" : "Create an Account"}
        </h2>

        {/* Switch Between Forms */}
        {isLogin ? <LoginForm /> : <SignupForm />}

        {/* Toggle Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
