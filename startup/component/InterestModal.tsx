"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function InterestModal({ open, onClose, startupName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Fake API
    await new Promise((res) => setTimeout(res, 800));

    setLoading(false);
    onClose();
    alert("Сонирхол амжилттай илгээгдлээ 🚀");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                📩 {startupName} — Сонирхол илгээх
              </h3>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Таны нэр"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                name="email"
                type="email"
                placeholder="И-мэйл"
                required
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                name="amount"
                placeholder="Сонирхож буй хөрөнгө (₮ / $)"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                name="message"
                rows={3}
                placeholder="Нэмэлт тайлбар (заавал биш)"
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                {loading ? "Илгээж байна..." : "Илгээх"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
