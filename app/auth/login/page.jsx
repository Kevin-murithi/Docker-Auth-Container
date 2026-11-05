"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

const LoginPage = () => {
  const { login, user, isAuthenticated, loading } = useUser();
  const router = useRouter();
  const formRef = useRef(null);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    setIsLoading(true);

    const form = formRef.current;
    const email = form.email.value;
    const password = form.password.value;

    const result = await login(email, password);

    if (result.success) {
      const role = result.role || user?.role;
      if (role === "Admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/client");
      }
    } else if (result.errors) {
      setErrors({
        email: result.errors.email || "",
        password: result.errors.password || "",
        general: result.errors.general || "",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#021b2b] via-[#053a4d] to-[#020814] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left visual panel */}
          <div className="relative hidden lg:flex flex-col justify-center px-10 py-12 bg-gradient-to-br from-[#020817] via-[#031625] to-[#041e32] text-white">
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)]" />
            <div className="relative z-10 max-w-sm">
              <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-4 text-sm text-slate-100/80 leading-relaxed">
                Sign in to access your dashboard.
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white px-6 py-10 sm:px-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Sign In</h2>
            <p className="mt-2 text-sm text-slate-500">Use your email and password to access your account.</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-slate-900">
            {errors.general && (
              <div className="alert-danger text-sm">{errors.general}</div>
            )}

            <div className="space-y-4">
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
                {errors.email && <div className="form-error text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  disabled={isLoading}
                  className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <div className="form-error text-xs mt-1">{errors.password}</div>
                )}
                <div className="flex justify-end mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <a
                    href="/auth/forgot-password"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-medium rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2 h-4 w-4" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <div className="text-center text-sm text-slate-600 mt-2">
              <p>
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="font-medium text-slate-900 hover:text-slate-700 transition-colors"
                >
                  Create one here
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

export default LoginPage;
