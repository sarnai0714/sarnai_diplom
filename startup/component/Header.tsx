"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import RequestAlert from "./Request";
import {
  ChevronDown,
  LogOut,
  Sun,
  Moon,
  Rocket,
  User,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();

  // Хөрөнгө оруулагч мөн эсэхийг шалгах хувьсагч
  const isInvestor = user?.role === "investor";

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token || !isInvestor) return; // Зөвхөн хөрөнгө оруулагч бол дата татна

      const response = await fetch(
        "http://127.0.0.1:8000/api/startup-requests/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setNotificationCount(data.length);
      }
    } catch (error) {
      console.error("Count fetch error:", error);
    }
  };

  useEffect(() => {
    // Зөвхөн хэрэглэгч нэвтэрсэн БӨГӨӨД хөрөнгө оруулагч бол ажиллана
    if (user && isInvestor) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    } else {
      setNotificationCount(0); // Role өөрчлөгдөх эсвэл гарах үед тоог 0 болгоно
    }
  }, [user, isInvestor]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNotificationClick = () => {
    setIsRequestOpen(true);
  };

  return (
    <>
      <header className="flex justify-between items-center px-8 py-5 bg-white dark:bg-slate-950 border-b dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 tracking-tight"
          >
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Rocket size={18} className="text-white" />
              </div>
              <span className="dark:text-white uppercase">
                Unicorn<span className="text-blue-600">.</span>
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-8 font-semibold text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 transition">
            Нүүр
          </Link>
          <Link href="/startup" className="hover:text-blue-600 transition">
            Төслүүд
          </Link>
          <Link href="/invest" className="hover:text-blue-600 transition">
            Хөрөнгө оруулагч
          </Link>
          <Link href="/report" className="hover:text-blue-600 transition">
            Үзүүлэлт
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Зөвхөн хөрөнгө оруулагчид харагдах мэдэгдлийн хэсэг */}
          {user && isInvestor && (
            <button
              onClick={handleNotificationClick}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-blue-400 transition relative"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black border-2 border-white dark:border-slate-950">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-blue-400 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition dark:text-white"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  <User size={20} />
                </div>
                <span className="hidden sm:inline text-sm font-bold">
                  {user.email.split("@")[0]}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b dark:border-slate-800 mb-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {isInvestor ? "Хөрөнгө оруулагч" : "Хэрэглэгч"}
                      </p>
                      <p className="text-xs font-medium dark:text-slate-200 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-slate-200"
                    >
                      Миний мэдээлэл
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-slate-200"
                    >
                      Хадгалсан төсөл
                    </Link>
                    <Link
                      href="/chat"
                      className="block px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition dark:text-slate-200"
                    >
                      Зурвас
                    </Link>
                    <hr className="my-1 border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 font-bold transition flex items-center gap-2"
                    >
                      <LogOut size={16} /> Гарах
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 dark:text-white rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition hidden sm:block"
              >
                Бүртгүүлэх
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Modal зөвхөн хөрөнгө оруулагч нээх боломжтой */}
      {isInvestor && (
        <RequestAlert
          isOpen={isRequestOpen}
          onClose={() => {
            setIsRequestOpen(false);
            fetchNotificationCount();
          }}
        />
      )}
    </>
  );
}
