"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  startupId: number;
}

export default function SaveButton({ startupId }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistId, setWishlistId] = useState<number | null>(null);

  const API = "http://127.0.0.1:8000/api";

  // 🔍 check existing wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const res = await fetch(`${API}/wishlist/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        const found = data.find(
          (w: any) => w.startup === startupId
        );

        if (found) {
          setSaved(true);
          setWishlistId(found.id);
        } else {
          setSaved(false);
          setWishlistId(null);
        }
      } catch (err) {
        console.error("wishlist fetch error:", err);
      }
    };

    fetchWishlist();
  }, [startupId]);

  // ❤️ toggle save/unsave
  const toggleSave = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Та эхлээд нэвтэрнэ үү.");
      return;
    }

    setLoading(true);

    try {
      // ❌ REMOVE
      if (saved && wishlistId) {
        const res = await fetch(
          `${API}/wishlist/${wishlistId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Delete failed");

        setSaved(false);
        setWishlistId(null);
      }

      // ➕ ADD
      else {
        const res = await fetch(`${API}/wishlist/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startup: startupId,
          }),
        });

        if (!res.ok) throw new Error("Create failed");

        const data = await res.json();

        setSaved(true);
        setWishlistId(data.id);
      }
    } catch (err) {
      console.error("wishlist toggle error:", err);
      alert("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2 rounded-xl border font-semibold transition ${
        saved
          ? "bg-red-50 border-red-400 text-red-600"
          : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <Heart
        size={18}
        className={saved ? "fill-red-500 text-red-500" : ""}
      />
      {saved ? "Saved" : "Save"}
    </button>
  );
}