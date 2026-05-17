"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Rocket,
  Target,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode тохиргоо
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* 1. Navigation */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="text-2xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
          <Rocket className="w-8 h-8" />
          <span>
            Startup<span className="text-slate-800 dark:text-white">Hub</span>
          </span>
        </div>

        <div className="hidden md:flex space-x-8 font-medium text-slate-600 dark:text-slate-400">
          {["Нүүр", "Төслүүд", "Хөрөнгө оруулагч", "Бидний тухай"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {item}
              </a>
            ),
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-blue-400 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none">
            Эхлэх
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        <motion.div {...fadeIn}>
          <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 inline-block">
            V1.0 ШИНЭЭР ГАРЛАА
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 leading-[1.1]">
            Ирээдүйн Юникорныг <br /> Өнөөдөр Дэмжье
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Бид гарааны бизнес эрхлэгчдийг хөрөнгө оруулагчидтай холбож,
            инновацилаг санааг бодит ажил хэрэг болгоход тусална.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* 1. Төсөл бүртгүүлэх товч */}
            <button className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg">
              Төсөл бүртгүүлэх <ChevronRight size={18} />
            </button>

            {/* 2. Хөрөнгө оруулах товч */}
            <button className="w-full sm:w-auto bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition shadow-sm">
              Хөрөнгө оруулах
            </button>
          </div>
        </motion.div>
      </section>

      {/* 3. Dashboard Preview (Chart.js орлох хэсэг) */}
      <section className="max-w-5xl mx-auto px-8 mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-xl font-bold mb-1">Төслийн өсөлт</h3>
              <p className="text-sm text-slate-500">Сүүлийн 6 сарын байдлаар</p>
            </div>
            <BarChart3 className="text-blue-600" />
          </div>

          {/* Энгийн CSS Chart Mockup */}
          <div className="flex items-end justify-between h-48 gap-2">
            {[40, 70, 45, 90, 65, 80].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {height}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-16 underline decoration-blue-500 underline-offset-8">
            Системийн давуу талууд
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Хөрөнгө оруулалт",
                desc: "Шилдэг төслүүдийг нэг дороос харж, хөрөнгө оруулах боломж.",
                icon: <Target className="w-6 h-6" />,
              },
              {
                title: "Менторшип",
                desc: "Туршлагатай бизнес эрхлэгчдээс зааварчилгаа авах экосистем.",
                icon: <Rocket className="w-6 h-6" />,
              },
              {
                title: "Дата шинжилгээ",
                desc: "Төслийн явц болон зах зээлийн өсөлтийг хянах хянах самбар.",
                icon: <BarChart3 className="w-6 h-6" />,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-xl mb-6 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
