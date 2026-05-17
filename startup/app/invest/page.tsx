"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Briefcase,
  TrendingUp,
  X,
  Send,
  Calendar,
  Info,
  Link,
  Lock,
  ChevronDown,
  Rocket,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Интерфейс ---
interface Investor {
  id: number;
  company_name: string;
  registration_number: string;
  website: string;
  focus_industry: string;
  representative_name: string;
  contact_email: string;
  investment_range: string;

  latitude?: number;
  longitude?: number;

  invested_count?: number;
}

interface MyStartup {
  id: number;
  startup_name: string;
  description: string;
}

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-purple-500 to-pink-500",
  "from-fuchsia-500 to-rose-500",
  "from-emerald-400 to-green-600",
  "from-lime-400 to-emerald-600",
];

const getColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name?.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

// --- Холбоо барих Модал Компонент ---
const ContactModal = ({
  isOpen,
  onClose,
  investor,
  startups,
}: {
  isOpen: boolean;
  onClose: () => void;
  investor: any;
  startups: MyStartup[];
}) => {
  const [selectedStartupId, setSelectedStartupId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!selectedStartupId) {
      alert("Та хүсэлт илгээх төслөө сонгоно уу.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("access");

      if (!token) {
        alert("Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
        return;
      }

      // Backend-рүү илгээх хүсэлт
      const response = await fetch(
        "http://127.0.0.1:8000/api/startup-requests/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startup: parseInt(selectedStartupId), // ID-г тоо болгож илгээх
            investor: investor.id,
            description: message,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert(`${investor.company_name} руу хүсэлт амжилттай илгээгдлээ!`);
        setSelectedStartupId("");
        setMessage("");
        onClose();
      } else {
        // Backend-ээс ирсэн алдааны мессежийг харуулах
        console.error("Server Error:", data);
        alert(
          `Алдаа гарлаа: ${data.detail || JSON.stringify(data) || "Хүсэлт илгээж чадсангүй."}`,
        );
      }
    } catch (error) {
      console.error("Post Error:", error);
      alert("Сервертэй холбогдоход алдаа гарлаа. Сүлжээгээ шалгана уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="relative p-8 pb-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getColor(
                  investor.company_name || "IN",
                )} rounded-2xl flex items-center justify-center text-white font-black text-2xl`}
              >
                {investor.company_name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {investor.company_name}
                </h3>
                <p className="text-sm text-slate-500">
                  Хөрөнгө оруулалтын хүсэлт
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Таны стартап төсөл
              </label>
              <div className="relative group">
                <select
                  disabled={isSubmitting}
                  value={selectedStartupId}
                  onChange={(e) => setSelectedStartupId(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white appearance-none cursor-pointer pr-12"
                >
                  <option value="" className="dark:bg-slate-900">
                    Төслөө сонгоно уу...
                  </option>
                  {startups.map((startup) => (
                    <option
                      key={startup.id}
                      value={startup.id}
                      className="dark:bg-slate-900"
                    >
                      {startup.startup_name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                  <ChevronDown size={18} />
                </div>
              </div>
              {startups.length === 0 && (
                <p className="text-[10px] text-rose-500 ml-1 italic font-medium">
                  Танд бүртгэлтэй төсөл байхгүй байна.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Танилцуулга зурвас
              </label>
              <textarea
                rows={4}
                disabled={isSubmitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Төслийнхөө товч утга, зорилгыг энд бичнэ үү..."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white resize-none"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex gap-3">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                Таны хүсэлтийг хүлээн авсны дараа {investor.company_name} багийн
                зүгээс хариу өгөх болно.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSend}
                disabled={!selectedStartupId || isSubmitting}
                className={`flex-[4] py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl 
                  ${
                    selectedStartupId && !isSubmitting
                      ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:opacity-90 active:scale-95 shadow-slate-200 dark:shadow-none"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {isSubmitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
              </button>
              <button className="flex-1 flex items-center justify-center w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-90">
                <Calendar
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Үндсэн Хэсэг ---
export default function InvestorsSection() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [myStartups, setMyStartups] = useState<MyStartup[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const formatMoney = (amount: number | string) => {
    const num = Number(amount || 0);
    return new Intl.NumberFormat("en-US").format(num) + " ₮";
  };

  const isStartup = user?.role === "startup";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // 1. Хөрөнгө оруулагчдын жагсаалт авах
        const invRes = await fetch("http://127.0.0.1:8000/api/investors/", {
          method: "GET",
          headers,
        });
        const invData = await invRes.json();
        if (Array.isArray(invData)) setInvestors(invData);
        else if (invData.results) setInvestors(invData.results);

        // 2. Хэрэв стартап бол өөрийн төслүүдийг авах
        if (isStartup && token) {
          const startupRes = await fetch(
            "http://127.0.0.1:8000/api/my-projects/",
            {
              method: "GET",
              headers,
            },
          );
          const startupData = await startupRes.json();
          if (Array.isArray(startupData)) setMyStartups(startupData);
          else if (startupData.results) setMyStartups(startupData.results);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isStartup]);

  const handleOpenMap = (investor: Investor) => {
    if (investor.latitude && investor.longitude) {
      const url = `https://www.google.com/maps?q=${investor.latitude},${investor.longitude}`;
      window.open(url, "_blank");
    } else {
      // fallback → нэрээр хайна
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(investor.company_name)}`;
      window.open(url, "_blank");
    }
  };

  const handleContactClick = (investor: Investor) => {
    if (!user) {
      alert("Та эхлээд нэвтрэх шаардлагатай.");
      return;
    }
    if (!isStartup) {
      alert("Зөвхөн Стартап эрхтэй хэрэглэгч хүсэлт илгээх боломжтой.");
      return;
    }
    setSelectedInvestor(investor);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative bg-slate-50 dark:bg-[#020617] py-24 px-6 overflow-hidden min-h-screen">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <TrendingUp size={14} /> Хөрөнгө оруулагч
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Итгэмжлэгдсэн{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                хөрөнгө оруулагчид
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Монголын стартап экосистемийг дэмжигч шилдэг венчур капитал болон
              анжел хөрөнгө оруулагчидтай шууд холбогд.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {investors.map((investor, index) => (
            <motion.div
              key={investor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              <div className="flex items-center justify-between mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${getColor(
                    investor.company_name,
                  )} rounded-2xl flex items-center justify-center text-white font-black text-2xl`}
                >
                  {investor.company_name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    Үйл ажиллагааны чиглэл
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold">
                    {investor.focus_industry}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {investor.company_name}
                </h3>
                <div className="inline-flex items-center mb-3 gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-semibold truncate w-full">
                  <Mail size={14} className="text-blue-500 shrink-0" />
                  {investor.contact_email}
                </div>
                <div className="flex">
                  <a
                    href={
                      investor.website.startsWith("http")
                        ? investor.website
                        : `https://${investor.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                  >
                    <Link size={14} className="text-blue-500" />
                    {investor.website}
                  </a>
                </div>

                <div className="mb-8 mt-8 flex items-stretch gap-3">
                  <div className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
                      <Rocket size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black">
                        Гарааны бизнес
                      </p>
                      <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                        {investor.invested_count || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-3.5 rounded-2xl bg-slate-900 dark:bg-blue-600 flex flex-col justify-center">
                    <p className="text-[9px] text-slate-400 dark:text-blue-100 uppercase font-black mb-1">
                      Хөрөнгө оруулалт
                    </p>
                    <p className="text-sm font-black text-white tabular-nums truncate">
                      {formatMoney(investor.investment_range)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleContactClick(investor)}
                  className={`flex-[3] py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 
                    ${
                      isStartup
                        ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  {isStartup ? <Mail size={18} /> : <Lock size={18} />}
                  Холбоо барих
                </button>
                <button
                  onClick={() => handleOpenMap(investor)}
                  className="flex-1 h-14 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02]"
                >
                  <MapPin
                    size={20}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </button>
              </div>

              <div
                className={`absolute top-0 left-12 right-12 h-1 bg-gradient-to-r ${getColor(
                  investor.company_name,
                )} opacity-0 group-hover:opacity-100 transition-opacity`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-20 p-10 rounded-[3rem] bg-slate-900 dark:bg-white dark:text-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="text-center md:text-left relative z-10">
            <h3 className="text-3xl font-black mb-2 tracking-tight">
              Та хөрөнгө оруулагч уу?
            </h3>
            <p className="text-slate-400 dark:text-slate-600 text-lg">
              Шилдэг стартапуудтай танилцахын тулд манай сүлжээнд нэгдээрэй.
            </p>
          </div>
          <button className="px-10 py-5 bg-blue-600 text-white dark:bg-slate-900 dark:text-white rounded-2xl font-black hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/25 whitespace-nowrap relative z-10 scale-110 md:scale-100">
            Хамтрагч болох
          </button>
        </motion.div>
      </div>

      <ContactModal
        isOpen={!!selectedInvestor}
        onClose={() => setSelectedInvestor(null)}
        investor={selectedInvestor || {}}
        startups={myStartups}
      />
    </section>
  );
}
