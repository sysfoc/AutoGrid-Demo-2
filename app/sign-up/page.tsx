"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignUp = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(user).every((field) => field.trim());
    setButtonDisabled(!allFieldsFilled);
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-10 py-10 text-5xl">
        {loading ? "Creating account..." : "Account Signup"}
      </h1>

      {error && (
        <div className="mb-4 w-[350px] rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <input
        className="mb-4 w-[350px] rounded-lg border border-gray-300 p-2 text-slate-800 focus:border-gray-600 focus:outline-none"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => {
          setUser({ ...user, username: e.target.value });
          setError("");
        }}
        placeholder="Your Username..."
      />

      <input
        className="mb-4 w-[350px] rounded-lg border border-gray-300 p-2 text-slate-800 focus:border-gray-600 focus:outline-none"
        id="email"
        type="email"
        value={user.email}
        onChange={(e) => {
          setUser({ ...user, email: e.target.value });
          setError("");
        }}
        placeholder="Your Email..."
      />

      <input
        className="mb-4 w-[350px] rounded-lg border border-gray-300 p-2 text-slate-800 focus:border-gray-600 focus:outline-none"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
          setError("");
        }}
        placeholder="Your Password..."
      />

      <button
        onClick={onSignUp}
        disabled={buttonDisabled || loading}
        className="mt-10 rounded-lg border border-gray-300 p-2 px-40 py-3 font-bold uppercase focus:border-gray-600 focus:outline-none disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Register Now"}
      </button>
    </div>
  );
}
