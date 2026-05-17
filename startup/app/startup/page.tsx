"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Хуудас шилжүүлэхэд хэрэгтэй
import { motion } from "framer-motion";
import {
  TrendingUp,
  ArrowUpRight,
  Heart,
  Loader2,
  MessageCircle,
} from "lucide-react";

// Интерфэйсүүд
interface Startup {
  id: number;
  startup_name: string;
  industry: string;
  stage: string;
  pitch_deck_link: string;
  description: string;
  equity_offered: string;
  fund_amount: number;
  raised_amount: number;
  image_url: string;
}

interface PageContent {
  id: number;
  page_name: string;
  content_key: string;
  text_content: string;
}

export default function InvestPage() {
  const router = useRouter();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [minFund, setMinFund] = useState("");
  const [maxFund, setMaxFund] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api";

  // --- 1. Дата татах ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (selectedIndustry) {
          params.append("industry", selectedIndustry);
        }

        if (minFund) {
          params.append("min_fund", minFund);
        }

        if (maxFund) {
          params.append("max_fund", maxFund);
        }
        const [projRes, contRes] = await Promise.all([
          fetch(`${API_BASE}/projects/`),
          fetch(`${API_BASE}/contents/`),
        ]);

        const projData = await projRes.json();
        const contData = await contRes.json();

        setStartups(
          Array.isArray(projData) ? projData : projData.results || [],
        );
        setContents(
          Array.isArray(contData) ? contData : contData.results || [],
        );
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. Салбаруудыг шүүж авах ---
  const industries = useMemo(() => {
    return Array.from(new Set(startups.map((s) => s.industry)));
  }, [startups]);

  const filteredStartups = useMemo(() => {
    return startups.filter((s) => {
      const matchIndustry = selectedIndustry
        ? s.industry === selectedIndustry
        : true;

      const matchMin = minFund ? s.fund_amount >= Number(minFund) : true;
      const matchMax = maxFund ? s.fund_amount <= Number(maxFund) : true;

      return matchIndustry && matchMin && matchMax;
    });
  }, [startups, selectedIndustry, minFund, maxFund]);

  // --- 3. Чат үүсгэх функц ---
  const handleStartChat = async (startupId: number) => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("Та нэвтрэх шаардлагатай.");
        return;
      }

      const response = await fetch(`${API_BASE}/rooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startup: startupId }), // Энд "startup" гэдэг түлхүүр үг Backend Serializer-тэй ижил байх ёстой
      });

      const data = await response.json(); // Эхлээд JSON-оо уншина

      if (response.ok) {
        // Амжилттай болсон бол чат руу шилжинэ
        router.push("/chat");
      } else {
        // 400 алдаа гарвал энд яг ямар талбар алдаатай байгааг харуулна
        console.error("Серверээс ирсэн алдаа:", data);

        // Жишээ нь: { "startup": ["This field is required."] } гэж ирвэл
        const errorMsg = JSON.stringify(data);
        alert(`Алдаа (${response.status}): ${errorMsg}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  // --- 4. Wishlist функц ---
  const toggleWishlist = async (startupId: number) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE}/wishlist/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startup: startupId }),
      });

      if (response.ok) {
        setWishlist((prev) =>
          prev.includes(startupId)
            ? prev.filter((id) => id !== startupId)
            : [...prev, startupId],
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContent = (key: string, defaultValue: string) => {
    const item = contents.find((c) => c.content_key === key);
    return item ? item.text_content : defaultValue;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-sans">
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-500/20">
              <TrendingUp size={14} />
              <span>Хөрөнгө оруулалт</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-black tracking-tight dark:text-white"
              dangerouslySetInnerHTML={{
                __html: getContent("startup_title", "Ирээдүйг эндээс ол."),
              }}
            />
          </motion.div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Бүх салбар</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minFund}
                onChange={(e) => setMinFund(e.target.value)}
                className="px-4 py-3 rounded-xl border dark:bg-slate-900 w-28"
              />

              <input
                type="number"
                placeholder="Max"
                value={maxFund}
                onChange={(e) => setMaxFund(e.target.value)}
                className="px-4 py-3 rounded-xl border dark:bg-slate-900 w-28"
              />
            </div>
          </div>
        </div>

        {/* Startup Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-slate-500 font-bold">
              Төслүүдийг ачаалж байна...
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredStartups.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-xl hover:border-blue-500/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      s.image_url ||
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                    }
                    alt={s.startup_name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase">
                    {s.industry}
                  </div>

                  <button
                    onClick={() => toggleWishlist(s.id)}
                    className={`absolute top-6 right-6 p-3 rounded-2xl backdrop-blur-md transition-all ${
                      wishlist.includes(s.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={wishlist.includes(s.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-3xl font-black dark:text-white mb-1">
                        {s.startup_name}
                      </h3>
                      <p className="text-blue-600 font-bold text-xs uppercase tracking-tighter">
                        {s.stage} Round
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:rotate-45">
                      <ArrowUpRight size={22} />
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 line-clamp-2">
                    {s.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/startup/${s.id}`}
                      className="group/btn relative flex-[4] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[1.5rem] font-black text-sm overflow-hidden transition-all active:scale-95"
                    >
                      <span className="relative z-10">ТӨСӨЛТЭЙ ТАНИЛЦАХ</span>
                      <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </Link>

                    <button
                      onClick={() => handleStartChat(s.id)}
                      className="group/btn relative flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white py-5 rounded-[1.5rem] transition-all hover:text-white active:scale-95 border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <MessageCircle size={22} className="relative z-10" />
                      <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredStartups.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-bold">
            Ийм төсөл олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
}
