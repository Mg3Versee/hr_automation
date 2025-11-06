/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAPI, sendOTPAPI, verifyOTPAPI } from "@/services/redux/thunk/authThunk";
import Input from "../input/Input";
import Button from "../button/Button";

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
    <div className="flex items-center justify-center mt-40">
      <div className="w-96 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 text-center">Forgot Password</h1>

        {step === 1 && (
          <>
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              className="w-full p-2 mb-3 rounded"
              name="email"
            />
            <Button onClick={handleSendOTP} className="w-full bg-blue-600 py-2 rounded" label="Send OTP" />
           
          </>
        )}

        {step === 2 && (
          <>
            <Input
              type="text"
              label="Otp"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 bg-gray-700 rounded"
              name="otp"
            />
            <Button onClick={handleVerifyOTP} className="w-full bg-green-600 py-2 rounded" label="Verify OTP" />

          </>
        )}

        {step === 3 && (
          <>
            <Input
              type="password"
              label="password"
              name="password"
              placeholder="New Password"
  
            />
            <Button onClick={handleResetPassword} className="w-full bg-yellow-600 py-2 rounded" label="Reset Password" />
              
          </>
        )}
      </div>
    </div>
  );
}
