"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

const DashboardIndexPage = () => {
  const { user, isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user?.role === "Admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/client");
    }
  }, [user, isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to your dashboard...</p>
    </div>
  );
};

export default DashboardIndexPage;
