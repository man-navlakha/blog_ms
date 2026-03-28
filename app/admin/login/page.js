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
    <div className="theme-shell px-6 py-10">
      <div className="glass-card mx-auto w-full max-w-lg p-6 md:p-7">
        <div className="clay-pill mb-4 inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">Staff Portal</div>
        <h1 className="text-3xl font-black uppercase">Staff Admin Login</h1>
        <p className="mt-2 text-sm muted-text">
          Only <strong>@mechanicsetu.tech</strong> emails are allowed.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
          <label className="block text-sm font-semibold uppercase">Email</label>
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
            <label className="block text-sm font-semibold uppercase">OTP</label>
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

        {message ? <p className="mt-4 text-sm font-semibold">{message}</p> : null}
        {debugOtp ? (
          <p className="glass-input mt-3 rounded-xl p-3 text-xs">
            Dev OTP (remove in prod): <strong>{debugOtp}</strong>
          </p>
        ) : null}
      </div>
    </div>
  );
}
