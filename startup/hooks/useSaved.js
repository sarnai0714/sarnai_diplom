"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSavedStartup({ startupId, initialSaved = false }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSave = async () => {
    setLoading(true);

    // 👉 FAKE auth check (дараа real auth болно)
    const isLoggedIn = true;
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      // 🔁 Fake API (дараа real болгоно)
      await new Promise((res) => setTimeout(res, 500));

      setSaved(!saved);
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setLoading(false);
    }
  };

  return { saved, toggleSave, loading };
}
