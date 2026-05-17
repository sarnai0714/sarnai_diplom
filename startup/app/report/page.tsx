"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  TrendingUp,
  Star,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Download,
  Loader2,
} from "lucide-react";

/* ---------------- TOOLTIP ---------------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-2xl shadow-xl">
        <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 font-medium">
          {label}
        </p>
        <p className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {payload[0].name === "user_count" ? "Хэрэглэгч:" : "Тоо:"}
          <span className="text-blue-500 ml-1">
            {payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/* ---------------- MAIN DASHBOARD ---------------- */
const ReportDashboard = () => {
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");

        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };

        const [statsRes, growthRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/projects/stats/", { headers }),
          fetch("http://127.0.0.1:8000/projects/user-growth/", { headers }),
        ]);

        if (!statsRes.ok || !growthRes.ok) throw new Error("API error");

        const statsData = await statsRes.json();
        const growthData = await growthRes.json();

        setStats(statsData);
        setUserGrowth(growthData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const formatCurrency = (num) =>
    new Intl.NumberFormat("mn-MN", {
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div className="relative bg-slate-50 dark:bg-[#020617] py-16 px-4 md:px-8 min-h-screen text-slate-900 dark:text-slate-200 transition-colors duration-300">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 text-sm font-medium mb-2 uppercase tracking-wider">
            <Calendar size={16} /> 2026 оны тайлан
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Стартап{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">
              Өсөлтийн Дашборд
            </span>
          </h1>
        </div>

        {/* <button className="flex items-center gap-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 px-5 py-3 rounded-2xl transition-all active:scale-95 font-medium text-slate-900 dark:text-white">
          <Download size={18} /> Тайлан татах (PDF)
        </button> */}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        <StatCard
          title="Нийт Санхүүжилт"
          value={formatCurrency(stats?.total_funding || 0)}
          icon={<DollarSign />}
          trend="+12.5%"
          color="blue"
        />
        <StatCard
          title="Нийт Хэрэглэгчид"
          value={stats?.user_count?.toLocaleString() || "0"}
          icon={<Users />}
          trend="+18.2%"
          color="emerald"
        />
        <StatCard
          title="Хөрөнгө Оруулагчид"
          value={stats?.investor_count?.toLocaleString() || "0"}
          icon={<Star />}
          trend="+4.1%"
          color="amber"
        />
        <StatCard
          title="Нийт Стартап"
          value={stats?.startup_count?.toLocaleString() || "0"}
          icon={<TrendingUp />}
          trend="+2.4%"
          color="indigo"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AREA CHART */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
            Үйл ажиллагааны чиглэл
          </h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.categories || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.2)"
                />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fill="rgba(59,130,246,0.2)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
            Хэрэглэгчийн өсөлт
          </h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.2)"
                />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="user_count"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 ml-10">
            Одоогоор бүртгэлтэй {stats?.user_count?.toLocaleString()} хэрэглэгч
            байна.
          </p>
        </div>
      </div>

      {/* STYLE */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.02); /* original vibe */
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .dark .glass-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .glass-card:hover {
          transform: translateY(-6px);
        }
      `}</style>
    </div>
  );
};

/* ---------------- STATS CARD ---------------- */
const StatCard = ({ title, value, icon, trend, color }) => {
  const colorMap = {
    blue: "text-blue-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    indigo: "text-indigo-500",
  };

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between mb-6">
        <div className={colorMap[color]}>{icon}</div>
        <span className="text-emerald-500 text-sm font-bold">{trend}</span>
      </div>

      <p className="text-slate-600 dark:text-slate-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>
    </div>
  );
};

export default ReportDashboard;
