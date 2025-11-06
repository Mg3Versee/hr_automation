/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAPI, sendOTPAPI, verifyOTPAPI } from "@/services/redux/thunk/authThunk";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState(""); 
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    try {
      const data = await sendOTPAPI(email);
      setMessage(data.message);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const data = await verifyOTPAPI(email, otp);
      setResetToken(data.reset_token);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPasswordAPI(email, password, resetToken);
      alert("Password reset successful!");
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-96 bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 text-center">Forgot Password</h1>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-3 bg-gray-700 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOTP} className="w-full bg-blue-600 py-2 rounded">
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 bg-gray-700 rounded"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
            <button onClick={handleVerifyOTP} className="w-full bg-green-600 py-2 rounded">
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-3 bg-gray-700 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleResetPassword} className="w-full bg-yellow-600 py-2 rounded">
              Reset Password
            </button>
          </>
        )}

        {message && <p className="text-green-400 mt-2">{message}</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}
