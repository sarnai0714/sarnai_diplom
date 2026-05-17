"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, ExternalLink, Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";

interface WishlistItem {
  id: number;
  startup: number;
  added_at: string;
  startup_details: {
    id: number;
    startup_name: string;
    industry: string;
    image_url: string;
    description: string;
  };
}

const SavedProjectsPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dark, setDark] = useState(false);

  const fetchSavedProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");

      const response = await fetch("http://127.0.0.1:8000/api/wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      const items: WishlistItem[] = Array.isArray(data)
        ? data
        : data.results || [];

      setWishlistItems(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProjects();
  }, []);

  // ⭐ DARK MODE FIX HERE
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const removeProject = async (wishlistId: number) => {
    const token = localStorage.getItem("access");

    await fetch(`http://127.0.0.1:8000/api/wishlist/${wishlistId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlistItems((prev) => prev.filter((x) => x.id !== wishlistId));
  };

  const filteredItems = wishlistItems.filter((item) =>
    item.startup_details.startup_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#020617] transition-colors duration-300 p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header (UNCHANGED) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black italic text-[#1d2240] dark:text-white flex items-center gap-2">
              <Bookmark className="text-blue-600" /> Миний хадгалсан төслүүд
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Нийт {filteredItems.length} төсөл харагдаж байна
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="text"
              placeholder="Төслийн нэрээр хайх..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl outline-none bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content (UNCHANGED structure, only dark colors added) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 size-10" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Төслүүдийг ачаалж байна...
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.startup_details.image_url}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    alt={item.startup_details.startup_name}
                  />

                  <button
                    onClick={() => removeProject(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800 rounded-full text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {item.startup_details.industry}
                  </span>

                  <h3 className="text-lg font-bold mt-2 line-clamp-1">
                    {item.startup_details.startup_name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between border-t dark:border-slate-700 pt-4">
                    <Link
                      href={`/startup/${item.startup_details.id}`}
                      className="flex items-center gap-1 text-sm font-semibold hover:text-blue-600 transition"
                    >
                      <ExternalLink size={16} /> Үзэх
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
            <Bookmark className="mx-auto text-gray-300 mb-4" size={48} />
            <h2 className="text-xl font-bold">Төсөл хадгалаагүй байна</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProjectsPage;
