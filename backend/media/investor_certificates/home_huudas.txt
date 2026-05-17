"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Target, BarChart3, ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [chartData, setChartData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/startup-growth/");

        const data = await res.json();

        const formatted = (Array.isArray(data) ? data : [data]).map((item) => ({
          month: item.label,
          growth: item.percentage,
        }));

        setChartData(formatted);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);


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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const chartConfig = {
    growth: {
      label: "Өсөлт",
      color: "blue",
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[140px]" />
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        <motion.div {...fadeIn}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <Zap size={14} className="fill-current" />
            <span>V1.0 Шинээр гарлаа</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 leading-[1.1]">
            Ирээдүйн Юникорныг <br /> Өнөөдөр Дэмжье
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Бид гарааны бизнес эрхлэгчдийг хөрөнгө оруулагчидтай холбож,
            инновацилаг санааг бодит ажил хэрэг болгоход тусална.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleApplyRoute}
              className="w-full sm:w-auto bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              Төсөл бүртгүүлэх <ChevronRight size={18} />
            </button>

            <button
              onClick={handleInvestorRoute}
              className="w-full sm:w-auto bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition shadow-sm"
            >
              Хөрөнгө оруулах
            </button>
          </div>
        </motion.div>
      </section>

      {/* CHART */}
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

          <div className="h-[320px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Bar
                    dataKey="growth"
                    radius={[12, 12, 0, 0]}
                    fill="var(--color-growth)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative py-32 bg-slate-50/50 dark:bg-[#060b18] transition-colors overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Системийн <span className="text-blue-600">давуу талууд</span>
            </h2>

            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Зөвхөн хөрөнгө оруулалт биш, тогтвортой өсөлтийг бий болгох дэд
              бүтэц.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Хөрөнгө оруулалт",
                desc: "Шилдэг төслүүдийг нэг дороос харж, эрсдэл багатайгаар хөрөнгө оруулах боломж.",
                icon: <Target className="w-7 h-7" />,
              },
              {
                title: "Менторшип",
                desc: "Туршлагатай бизнес эрхлэгчдээс зөвлөгөө авах.",
                icon: <Rocket className="w-7 h-7" />,
              },
              {
                title: "Дата шинжилгээ",
                desc: "Өсөлтийг хянах ухаалаг систем.",
                icon: <BarChart3 className="w-7 h-7" />,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8 flex items-center justify-center text-blue-600">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>

                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
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

export default HomePage;
