"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { loginAPI } from "@/services/redux/thunk/authThunk";
import { useAuth } from "@/services/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAPI(email, password);
      login(data.token, data.user);
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="w-96 bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-semibold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <button onClick={() => router.push("/signup")} className="text-blue-400 underline">
            Sign Up
          </button>
        </p>

        <p className="text-sm text-center mt-2">
          <button onClick={() => router.push("/forgot-password")} className="text-gray-400 underline">
            Forgot Password?
          </button>
        </p>
      </form>
    </div>
  );
}
