"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { loginAPI } from "@/services/redux/thunk/authThunk";
import { useAuth } from "@/services/context/AuthContext";
import Input from "../input/Input";
import Button from "../button/Button";
import Link from "next/link";

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
    <div className="flex items-center justify-center mt-40 ">
      <form onSubmit={handleLogin} className="w-96 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl mb-4 font-semibold text-center">Login</h1>
        <Input
          type="email"
          label="Email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded  text-black"
          name="email"
        />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded  text-black" name="password"  />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
          label ="Login"
          isLoading={loading}
          />

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-400 underline" >
            Sign Up
          </Link>
        </p>

        <p className="text-sm text-center mt-2">
          <Link href="/forget-password" className="text-gray-400 underline">
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}
