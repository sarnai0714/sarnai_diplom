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
  Loader2, // Уншиж байх үед харуулах icon
} from "lucide-react";

const ReportDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Өөрийн API URL-аар солино уу
        const response = await fetch(
          "http://127.0.0.1:8000/api/projects/",
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Дата татахад алдаа гарлаа:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 font-sans">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Стартап Өсөлтийн Тайлан
        </h1>
        <p className="text-slate-400">Динамик өгөгдлийн дашборд (Real-time)</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Нийт Орлого"
          value={`$${data?.total_revenue.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Бүртгэлтэй Стартап"
          value={data?.startup_count}
          icon={<Star size={20} />}
          trend="+5"
          color="emerald"
        />
        <StatCard
          title="Идэвхтэй Хэрэглэгчид"
          value={data?.chart_data[
            data.chart_data.length - 1
          ].user_count.toLocaleString()}
          icon={<Users size={20} />}
          trend="+18%"
          color="amber"
        />
        <StatCard
          title="Өсөлт"
          value={data?.growth_rate}
          icon={<TrendingUp size={20} />}
          trend="+2.4%"
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Growth Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Орлогын өсөлт</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chart_data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6">Хэрэглэгчийн бааз</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.chart_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="step"
                  dataKey="user_count"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }) => {
  // Tailwind dynamic class issue-г шийдэх (colors)
  const bgColors = {
    blue: "bg-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
    indigo: "bg-indigo-500/20 text-indigo-400",
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bgColors[color]}`}>{icon}</div>
        <span className="flex items-center text-emerald-400 text-sm font-medium">
          {trend} <ArrowUpRight size={14} className="ml-1" />
        </span>
      </div>
      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
};

export default ReportDashboard;
