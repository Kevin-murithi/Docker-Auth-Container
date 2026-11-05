"use client";

import React from "react";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";

const ClientDashboardPage = () => {
  const { user, logout } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">{user?.role} Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Welcome, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right text-xs text-slate-400">
              <p className="font-medium truncate max-w-[200px]">{user?.email}</p>
              <p className="mt-0.5">Role: {user?.role}</p>
            </div>
            <button
              onClick={async () => {
                await logout();
                router.push("/auth/login");
              }}
              className="btn-primary py-2 px-3 text-xs bg-slate-800 hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
