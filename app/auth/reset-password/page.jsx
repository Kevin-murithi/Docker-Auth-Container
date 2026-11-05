// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const ResetPasswordPage = () => {
//   const formRef = useRef(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [email, setEmail] = useState("");
//   const [resetCode, setResetCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const [step, setStep] = useState("verify"); // "verify" | "reset"
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const emailFromQuery = searchParams.get("email");
//     if (emailFromQuery) {
//       setEmail(emailFromQuery);
//     }
//   }, [searchParams]);

//   const handleVerifyCode = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/auth/verify-reset-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, resetCode }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setError(data.message || "Invalid or expired code");
//       } else {
//         setMessage("Code verified. You can now set a new password.");
//         setStep("reset");
//       }
//     } catch (err) {
//       console.error("Verify reset code error", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, resetCode, newPassword }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setError(data.message || "Failed to reset password");
//       } else {
//         setMessage("Password updated successfully. Redirecting to login...");
//         setTimeout(() => {
//           router.push("/auth/login");
//         }, 2000);
//       }
//     } catch (err) {
//       console.error("Reset password error", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#021b2b] via-[#053a4d] to-[#020814] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//       <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white/5 border border-white/10 backdrop-blur">
//         <div className="grid grid-cols-1 lg:grid-cols-2">
//           {/* Left visual panel */}
//           <div className="relative hidden lg:flex flex-col justify-center px-10 py-12 bg-gradient-to-br from-[#020817] via-[#031625] to-[#041e32] text-white">
//             <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_#0ea5e9_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)]" />
//             <div className="relative z-10 max-w-sm">
//               <h1 className="text-3xl font-semibold tracking-tight">
//                 {step === "verify" ? "Enter your reset code" : "Set a new password"}
//               </h1>
//               <p className="mt-4 text-sm text-slate-100/80 leading-relaxed">
//                 {step === "verify"
//                   ? "Check your email for the one-time code and enter it here to verify your identity."
//                   : "Choose a strong new password to secure your account."}
//               </p>
//             </div>
//           </div>

//           {/* Right form panel */}
//           <div className="bg-white px-6 py-10 sm:px-10 flex items-center">
//             <div className="w-full max-w-md mx-auto">
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Reset password</h2>
//             <p className="mt-2 text-sm text-slate-500">
//               {step === "verify"
//                 ? "Use the code we sent to your email to verify your identity."
//                 : "Your code is verified. Enter a new password to finish resetting your account."}
//             </p>
//           </div>

//           <form
//             ref={formRef}
//             onSubmit={step === "verify" ? handleVerifyCode : handleResetPassword}
//             className="space-y-6 text-slate-900"
//           >
//             {error && <div className="alert-danger text-sm">{error}</div>}
//             {message && <div className="alert-success text-sm">{message}</div>}

//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="form-label">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={isLoading || step === "reset"}
//                   className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
//                   placeholder="you@example.com"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="resetCode" className="form-label">
//                   Reset Code
//                 </label>
//                 <input
//                   type="text"
//                   name="resetCode"
//                   value={resetCode}
//                   onChange={(e) => setResetCode(e.target.value)}
//                   required
//                   disabled={isLoading || step === "reset"}
//                   className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
//                   placeholder="6-digit code"
//                 />
//               </div>

//               {step === "reset" && (
//                 <div>
//                   <label htmlFor="newPassword" className="form-label">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                     disabled={isLoading}
//                     className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
//                     placeholder="Enter a new password"
//                   />
//                 </div>
//               )}
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-3 text-sm font-medium rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
//               >
//                 {isLoading
//                   ? step === "verify"
//                     ? "Verifying..."
//                     : "Updating password..."
//                   : step === "verify"
//                     ? "Verify code"
//                     : "Update password"}
//               </button>
//             </div>

//             <div className="text-center text-sm text-slate-600 mt-2">
//               <p>
//                 Remembered your password?{" "}
//                 <a
//                   href="/auth/login"
//                   className="font-medium text-slate-900 hover:text-slate-700 transition-colors"
//                 >
//                   Back to login
//                 </a>
//               </p>
//             </div>
//           </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordPage;
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --------------------------------------------------------------
// 1. Child component: uses useSearchParams() -> must be in Suspense
// --------------------------------------------------------------
function ResetPasswordForm() {
  const formRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState("verify"); // "verify" | "reset"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid or expired code");
      } else {
        setMessage("Code verified. You can now set a new password.");
        setStep("reset");
      }
    } catch (err) {
      console.error("Verify reset code error", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to reset password");
      } else {
        setMessage("Password updated successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Reset password error", err);
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
              <h1 className="text-3xl font-semibold tracking-tight">
                {step === "verify" ? "Enter your reset code" : "Set a new password"}
              </h1>
              <p className="mt-4 text-sm text-slate-100/80 leading-relaxed">
                {step === "verify"
                  ? "Check your email for the one-time code and enter it here to verify your identity."
                  : "Choose a strong new password to secure your account."}
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white px-6 py-10 sm:px-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Reset password</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {step === "verify"
                    ? "Use the code we sent to your email to verify your identity."
                    : "Your code is verified. Enter a new password to finish resetting your account."}
                </p>
              </div>

              <form
                ref={formRef}
                onSubmit={step === "verify" ? handleVerifyCode : handleResetPassword}
                className="space-y-6 text-slate-900"
              >
                {error && <div className="alert-danger text-sm">{error}</div>}
                {message && <div className="alert-success text-sm">{message}</div>}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading || step === "reset"}
                      className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="resetCode" className="form-label">
                      Reset Code
                    </label>
                    <input
                      type="text"
                      name="resetCode"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      required
                      disabled={isLoading || step === "reset"}
                      className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="6-digit code"
                    />
                  </div>

                  {step === "reset" && (
                    <div>
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="form-input mt-1 h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                        placeholder="Enter a new password"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-sm font-medium rounded-full bg-black text-white hover:bg-neutral-900 transition-colors"
                  >
                    {isLoading
                      ? step === "verify"
                        ? "Verifying..."
                        : "Updating password..."
                      : step === "verify"
                        ? "Verify code"
                        : "Update password"}
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
}

// --------------------------------------------------------------
// 2. Page component: wraps the child in Suspense
// --------------------------------------------------------------
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}