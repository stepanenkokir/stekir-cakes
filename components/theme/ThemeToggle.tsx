"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  toggleLabel?: string;
  lightLabel?: string;
  darkLabel?: string;
};

export function ThemeToggle({
  className = "",
  toggleLabel = "Toggle color theme",
  lightLabel = "Switch to light theme",
  darkLabel = "Switch to dark theme",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-full p-2 text-text transition-colors hover:bg-surface hover:text-primary-dark ${className}`}
      aria-label={toggleLabel}
      title={theme === "dark" ? lightLabel : darkLabel}
    >
      <Sun className="hidden h-5 w-5 dark:block" aria-hidden />
      <Moon className="h-5 w-5 dark:hidden" aria-hidden />
    </button>
  );
}
