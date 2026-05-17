"use client";

import { useState } from "react";

export function DarkToggle() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-6 right-6 border px-4 py-2 rounded-xl text-sm"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
