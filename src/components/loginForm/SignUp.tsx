"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signupAPI } from "@/services/redux/thunk/authThunk";

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
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleSignup} className="w-96 bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-semibold text-center">Create Account</h1>

        <input
          type="text"
          placeholder="First Name"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-blue-400 underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
