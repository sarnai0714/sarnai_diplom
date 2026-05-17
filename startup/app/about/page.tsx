"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Users,
  Globe,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Бүртгэлтэй стартап", value: 128, icon: <Rocket size={22} /> },
    { label: "Хөрөнгө оруулагчид", value: 76, icon: <Users size={22} /> },
    { label: "Амжилттай санхүүжилт", value: 54, icon: <Globe size={22} /> },
    { label: "Арга хэмжээ", value: 32, icon: <BookOpen size={22} /> },
  ];

  const coreSection = {
    title: "Бид юунд итгэдэг вэ?",
    description:
      "Технологи бол асуудлыг шийдэх хамгийн хүчтэй зэвсэг. Бидний зорилго бол энэхүү зэвсгийг бүтээж буй залууст санхүүгийн болон стратегийн дэмжлэг үзүүлэх явдал юм.",
    items: [
      { title: "Ил тод байдал", icon: "ShieldCheck" },
      { title: "Хурдтай өсөлт", icon: "ShieldCheck" },
      { title: "Харилцан итгэлцэл", icon: "ShieldCheck" },
    ],
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80",
    ],
  };

  const iconMap = {
    ShieldCheck,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[140px]" />
      {/* 1. HERO */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[11px] font-black uppercase tracking-widest">
              Бидний тухай
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]">
              Бид ирээдүйг <br />
              <span className="text-blue-600">санхүүжүүлнэ.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Монголын стартап экосистемийг дэлхийн түвшинд гаргах, инновацилаг
              залуусыг хөрөнгө оруулагчидтай холбох хамгийн том платформ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="px-6 py-20 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div variants={item} key={idx} className="space-y-3">
                <div className="text-blue-600">{stat.icon}</div>
                <h4 className="text-3xl md:text-5xl font-black tracking-tighter">
                  {stat.value}+
                </h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-20">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {coreSection.title}
            </h2>

            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              {coreSection.description}
            </p>

            <ul className="space-y-4 font-bold text-sm">
              {coreSection.items.map((item) => (
                <li key={item.title} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  {item.title}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {coreSection.images.map((img, idx) => (
              <div
                key={img}
                className={`
            bg-slate-100 dark:bg-slate-800 rounded-2xl h-64 overflow-hidden shadow-2xl
            ${idx === 1 ? "mt-8" : ""}
          `}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="core visual"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Мэргэжлийн баг хамт олон.
            </h2>
            <p className="max-w-xs text-slate-500 dark:text-slate-400 font-medium">
              Манай багт хөрөнгө оруулалтын банкирууд болон туршлагатай
              инженерүүд багтдаг.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-6 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img
                    src={`https://i.pravatar.cc/400?u=team${i}`}
                    alt="member"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                </div>
                <h4 className="text-xl font-black">Нэр Овог</h4>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">
                  Founder & CEO
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA - Зайг нэмж зассан хэсэг */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-16">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-8">
            Бидэнтэй нэгдэхэд <br /> бэлэн үү?
          </h2>
          <div className="flex justify-center pt-2">
            <Link
              href="/invest"
              className="w-full max-w-md py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl"
            >
              Хөрөнгө оруулах <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
