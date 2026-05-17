"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "", // 'name' байсныг 'username' болгов
    email: "",
    password: "",
    confirmPassword: "",
    role: "investor", // Анхдагч утга
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Нууц үг таарахгүй байна");
      return;
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      router.push("/login"); // Амжилттай болвол нүүр хуудас руу
    } catch (err: any) {
      alert("Алдаа: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border dark:border-slate-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          Бүртгүүлэх
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Хэрэглэгчийн нэр"
            required
            className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Имэйл хаяг"
            required
            className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select
            className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="investor">Хөрөнгө оруулагч</option>
            <option value="startup">Стартап</option>
          </select>
          <input
            type="password"
            placeholder="Нууц үг"
            required
            className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Нууц үг давтах"
            required
            className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Бүртгэл үүсгэх
          </button>
        </form>
      </div>
    </div>
  );
}
