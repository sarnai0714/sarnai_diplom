"use client";

import { motion } from "framer-motion";
import {
  Target,
  BarChart3,
  ChevronRight,
  Zap,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  // Startup route хамгаалалт
  const handleApplyRoute = () => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "startup") {
      alert("Төсөл бүртгүүлэх эрх зөвхөн Startup хэрэглэгчдэд нээлттэй.");
      return;
    }

    router.push("/apply");
  };

  // Investor route хамгаалалт
  const handleInvestorRoute = () => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== "investor") {
      alert("Энэ хэсэг зөвхөн Investor хэрэглэгчдэд зориулагдсан.");
      return;
    }

    router.push("/hh");
  };

  const handleRoute = (targetRole: string, path: string) => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role !== targetRole) {
      alert(`Энэ хэсэг зөвхөн ${targetRole} хэрэглэгчдэд зориулагдсан.`);
      return;
    }

    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[140px]" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" />

        <div
          className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px] animate-bounce"
          style={{ animationDuration: "10s" }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 flex flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-400/5 backdrop-blur-md border border-blue-500/20 dark:border-blue-400/10 mb-8 group">
            <Zap
              size={14}
              className="text-blue-600 dark:text-blue-400 fill-blue-600/20 group-hover:scale-110 transition-transform"
            />

            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              V1.0 Шинээр гарлаа
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-8xl font-[950] mb-8 tracking-tighter leading-[1.05] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-500">
            Ирээдүйн Юникорныг <br /> Өнөөдөр Дэмжье
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-12 leading-relaxed font-medium">
            Бид гарааны бизнес эрхлэгчдийг хөрөнгө оруулагчидтай холбож,
            <br className="hidden md:block" />
            инновацилаг санааг бодит ажил хэрэг болгоход тусална.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleApplyRoute}
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              Төсөл бүртгүүлэх
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleInvestorRoute}
              className="w-full sm:w-auto bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition shadow-sm"
            >
              Хөрөнгө оруулах
            </button>

            {/* Optional Admin Button */}
            {/* 
            <button
              onClick={handleAdminRoute}
              className="w-full sm:w-auto bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Admin
            </button>
            */}
          </div>
        </motion.div>

        {/* Floating Badges */}
        <div className="hidden lg:block">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-1/4 left-10 p-4 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-white/5 rotate-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <Zap size={16} />
              </div>

              <span className="text-sm font-bold">Fast Funding</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute bottom-1/4 right-10 p-4 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-white/5 -rotate-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                <Target size={16} />
              </div>

              <span className="text-sm font-bold">Smart Match</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 relative overflow-hidden p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-900 text-white"
          >
            <div className="relative z-10">
              <Globe className="w-12 h-12 mb-6 opacity-80" />

              <h3 className="text-4xl font-bold mb-4 tracking-tight">
                Дэлхийн зах зээлд <br /> хамтдаа гаръя
              </h3>

              <p className="text-blue-100 max-w-md text-lg leading-relaxed">
                Бид зөвхөн Монгол биш, олон улсын венчур капиталуудтай хамтарч
                ажилладаг. Таны төсөл дэлхийд гарах гарц эндээс эхэлнэ.
              </p>
            </div>

            <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-8">
              <ShieldCheck size={28} />
            </div>

            <h3 className="text-2xl font-bold mb-4">Найдвартай</h3>

            <p className="text-slate-500 dark:text-slate-400">
              Бүх гэрээ хэлцэл хууль ёсны дагуу, нууцлалын өндөр зэрэгт
              явагдана.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm"
          >
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8">
              <BarChart3 size={28} />
            </div>

            <h3 className="text-2xl font-bold mb-4">Дата-д суурилсан</h3>

            <p className="text-slate-500 dark:text-slate-400">
              Төслийн өсөлтийг бодит дата, KPI үзүүлэлтээр хянах боломж.
            </p>
          </motion.div>

          {/* Wide Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 group p-10 rounded-[3rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-colors flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div>
              <h3 className="text-3xl font-black mb-4">Менторшип хөтөлбөр</h3>

              <p className="text-slate-400 dark:text-slate-500 max-w-sm">
                Силикон хөндийн туршлагатай монгол инженерүүдээс зөвлөгөө авах
                боломжтой.
              </p>
            </div>

            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-full border-4 border-slate-900 dark:border-white bg-slate-800 dark:bg-slate-200"
                />
              ))}

              <div className="w-14 h-14 rounded-full border-4 border-slate-900 dark:border-white bg-blue-600 flex items-center justify-center font-bold text-white">
                +20
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="relative p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-[4rem]">
          <div className="bg-white dark:bg-slate-950 rounded-[3.9rem] px-8 py-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              Өнөөдөр эхлэхэд бэлэн үү?
            </h2>

            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform">
              Одоо нэгдэх
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
