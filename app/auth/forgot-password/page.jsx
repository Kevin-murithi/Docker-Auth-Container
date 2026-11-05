"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const formRef = useRef(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    const form = formRef.current;
    const email = form.email.value;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send reset code");
      } else {
        setMessage("If that email exists, a reset code has been sent.");
        // Redirect to reset-password page so the user can enter the code
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error("Forgot password error", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#021b2b] via-[#053a4d] to-[#020814] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left visual panel */}
          <div className="relative hidden lg:flex flex-col justify-center px-10 py-12 bg-gradient-to-br from-[#020817] via-[#031625] to-[#041e32] text-white">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)]" />
            <div className="relative z-10 max-w-sm">
              <h1 className="text-3xl font-semibold tracking-tight">Forgot your password?</h1>
              <p className="mt-4 text-sm text-slate-100/80 leading-relaxed">
                Enter the email associated with your account and we&apos;ll send you a one-time
                code to reset your password.
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white px-6 py-10 sm:px-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Reset password</h2>
            <p className="mt-2 text-sm text-slate-500">We&apos;ll send you a code if we find an account with that email.</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-slate-900">
            {error && <div className="alert-danger text-sm">{error}</div>}
            {message && <div className="alert-success text-sm">{message}</div>}

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isLoading}
                className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-medium rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
              >
                {isLoading ? "Sending code..." : "Send reset code"}
              </button>
            </div>

            <div className="text-center text-sm text-slate-600 mt-2">
              <p>
                Remembered your password?{" "}
                <a
                  href="/auth/login"
                  className="font-medium text-slate-900 hover:text-slate-700 transition-colors"
                >
                  Back to login
                </a>
              </p>
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
