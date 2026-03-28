"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const nextPath = "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.message || "Failed to send OTP.");
        return;
      }

      setOtpSent(true);
      setDebugOtp(data?.debugOtp || "");
      setMessage(data?.message || "OTP sent.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.message || "Failed to verify OTP.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center py-6">
      <div className="admin-panel mx-auto w-full max-w-lg rounded-[1.75rem] p-6 md:p-8">
        <div className="admin-kicker mb-4">Staff Portal</div>
        <h1 className="text-3xl font-black uppercase text-white">Staff Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Only <strong>@mechanicsetu.tech</strong> emails are allowed.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
          <label className="block text-sm font-semibold uppercase text-slate-200">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@mechanicsetu.tech"
            className="premium-input"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="premium-btn-primary w-full px-4 py-2.5 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {otpSent ? (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <label className="block text-sm font-semibold uppercase text-slate-200">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))
              }
              placeholder="6 digit code"
              className="premium-input"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="premium-btn-secondary w-full px-4 py-2.5 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        ) : null}

        {message ? <p className="mt-4 text-sm font-semibold text-slate-100">{message}</p> : null}
        {debugOtp ? (
          <p className="glass-input mt-3 rounded-xl p-3 text-xs text-slate-200">
            Dev OTP (remove in prod): <strong>{debugOtp}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}
