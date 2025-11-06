/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signupAPI } from "@/services/redux/thunk/authThunk";
import Input from "../input/Input";
import Button from "../button/Button";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupAPI(form.first_name, form.last_name, form.email, form.password);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-40">
      <form onSubmit={handleSignup} className="w-96  p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-semibold text-center">Create Account</h1>

        <Input
          type="text"
          label="First Name"
          placeholder="First Name"
          className="w-full p-2 mb-3 rounded  text-black"
          name="first_name"
        />

        <Input
          type="text"
          label="Last Name"
          placeholder="Last Name"
          className="w-full p-2 mb-3 rounded  text-black"
          name="last_name"
        />

        <Input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded  text-black"
          name="email"
        />

        <Input
          type="password"
          label="Password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded  text-black"
          name="password"
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
          label="Sign Up"
        />
         
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login"  className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
