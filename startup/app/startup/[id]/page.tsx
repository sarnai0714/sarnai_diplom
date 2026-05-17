"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Download,
  Mail,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import SaveButton from "@/component/SaveButton";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  role_display: string;
  image: string;
  linkedin_url: string;
}

interface Startup {
  id: number;
  startup_name: string;
  industry: string;
  stage: string;
  pitch_deck_link: string;
  description: string;
  equity_offered: string;
  fund_purpose: string;
  fund_amount: number;
  raised_amount: number;
  image_url: string;
  email: string; // нэмнэ
  team_members: TeamMember[];
}

export default function StartupDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [startup, setStartup] = useState<Startup | null>(null);

  const formatMoney = (amount: number | string) => {
    const num = Number(amount || 0);
    return new Intl.NumberFormat("en-US").format(num) + " ₮";
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setStartup(data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="animate-pulse font-bold text-blue-600">
          Уншиж байна...
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <p className="text-2xl font-bold text-slate-400 mb-6">
          Стартап олдсонгүй
        </p>
        <Link
          href="/invest"
          className="px-8 py-3 bg-blue-600 text-white rounded-full"
        >
          Жагсаалт руу буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-white">
      {/* NAVIGATION */}
      <nav className="fixed top-25 inset-x-0 z-50 max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800">
          <Link
            href="/startup"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex gap-4">
            <SaveButton startupId={startup.id} />
            <Link
              href={`/invest/${startup.id}/checkout`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-bold transition-all active:scale-95"
            >
              Хөрөнгө оруулах
            </Link>
          </div>
        </div>
      </nav>

      <header className="pt-32 pb-12 max-w-6xl mx-auto px-6">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold border border-blue-500/20">
            {startup.industry}
          </span>
          <span className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-xs font-bold border border-slate-500/20">
            {startup.stage} Stage
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          {startup.startup_name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
          {startup.fund_purpose}
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 pb-24">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-12">
          {startup.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <img
                src={startup.image_url}
                className="w-full h-[450px] object-cover"
                alt="Startup"
              />
            </motion.div>
          )}

          <section>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full" /> Төслийн
              тухай
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line">
              {startup.description}
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6">Багийн гишүүд</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {startup.team_members?.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                  <img
                    src={m.image || "/api/placeholder/100/100"}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    alt={m.name}
                  />
                  <div>
                    <h4 className="font-bold text-lg">{m.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">
                      {m.role_display}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
              {/* FUND AMOUNT */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-2">
                  Хүсэж буй хөрөнгийн хэмжээ
                </p>
                <p className="text-3xl font-black">
                  {formatMoney(startup.fund_amount)}
                </p>
              </div>

              {/* DIVIDER */}
              <div className="border-t border-slate-200 dark:border-slate-800 my-6" />

              {/* EQUITY */}
              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Санал болгож буй хувь
                </p>

                <p className="text-3xl font-black text-blue-600">
                  {startup.equity_offered}%
                </p>
              </div>

              {/* PITCH DECK */}
              {startup.pitch_deck_link && (
                <div className="mb-4">
                  <a
                    href={startup.pitch_deck_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-bold flex items-center justify-between px-6 transition-all border border-transparent hover:border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-blue-600" />
                      <span>Pitch Deck.PDF</span>
                    </div>
                    <Download
                      size={18}
                      className="group-hover:translate-y-0.5 transition-transform"
                    />
                  </a>
                </div>
              )}

              {/* BUTTON */}
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${startup.email}&su=${encodeURIComponent(
                  `${startup.startup_name} төсөлтэй холбоотой`,
                )}&body=${encodeURIComponent(
                  "Сайн байна уу,\n\nХөрөнгө оруулалтын талаар холбогдож байна.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
              >
                <Mail size={20} />
                Холбоо барих
              </a>

              {/* VERIFIED */}
              <div className="mt-6 flex justify-center items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Баталгаажсан төсөл
              </div>
            </div>

            {/* INFO CARD */}
            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <p className="text-sm font-medium opacity-90">
                Хөрөнгө оруулалт хийхээс өмнө бүх эрсдэл болон нөхцөлтэй
                танилцана уу.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
