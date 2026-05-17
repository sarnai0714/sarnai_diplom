"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  Info,
  ArrowRight,
  Loader2,
  Calendar,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestAlert({ isOpen, onClose }: RequestModalProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Өгөгдөл татах функц
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        "http://127.0.0.1:8000/api/startup-requests/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (response.status === 401) throw new Error("Хандах эрхгүй байна.");
      if (!response.ok) throw new Error("Өгөгдөл татахад алдаа гарлаа.");

      const data = await response.json();
      setRequests(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchRequests();
  }, [isOpen]);

  // Устгах функц
  const handleDelete = async (id: number) => {
    if (!confirm("Та энэ хүсэлтийг устгахдаа итгэлтэй байна уу?")) return;

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `http://127.0.0.1:8000/api/startup-requests/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (response.ok) {
        // State-ээс хасах (UI дээр шууд алга болно)
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        alert("Устгахад алдаа гарлаа.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", { month: "short", day: "numeric" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
            style={{ left: "50%", top: "50%", translateY: "-50%" }}
            className="fixed w-[92%] max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden border border-white dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-7 pb-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                  <Bell size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">
                    Мэдэгдэл
                  </h2>
                  <p className="text-xs text-slate-500">
                    Нийт {requests.length} хүсэлт
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Content Section */}
            <div className="px-4 pb-6 max-h-[450px] overflow-y-auto space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <AlertCircle className="mx-auto text-red-500 mb-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : requests.length > 0 ? (
                requests.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-5 rounded-[1.8rem] border dark:border-slate-800 bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase">
                          {item.status}
                        </span>
                        {item.meeting_requested && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <Calendar size={10} /> УУЛЗАЛТ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <h4 className="font-bold dark:text-white mb-1">
                      {item.startup_detail?.startup_name}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/startup/${item.startup_detail.id}`)
                        }
                        className="flex-[3] py-2.5 bg-blue-600 text-white text-xs rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        Дэлгэрэнгүй <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center active:scale-95 transition-all hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400 font-medium">
                  Хүсэлт байхгүй байна.
                </div>
              )}
            </div>

            <div className="p-5 border-t dark:border-slate-800">
              <button
                onClick={onClose}
                className="w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl"
              >
                Хаах
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
