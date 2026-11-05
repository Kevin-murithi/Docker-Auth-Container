"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 shadow-lg shadow-slate-950/40 hover:bg-slate-800/90 focus:outline-none focus:ring-2 focus:ring-slate-500/70"
    >
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          isDark ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-900"
        }`}
      >
        {isDark ? "◎" : "◯"}
      </span>
      <span>{isDark ? "Dark" : "Light"} mode</span>
    </button>
  );
};

export default ThemeToggle;
