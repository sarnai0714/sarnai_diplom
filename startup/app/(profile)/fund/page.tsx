"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FundedStartups = () => {
  const [fundedStartups, setFundedStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          console.error("Token олдсонгүй");
          setLoading(false);
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/investments/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Нэвтрэх эрхгүй байна");
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setFundedStartups(data);
        } else if (Array.isArray(data.results)) {
          setFundedStartups(data.results);
        } else {
          setFundedStartups([]);
        }
      } catch (error) {
        console.error("API Error:", error);
        setFundedStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  return (
    /* Background: Light үед цагаан, Dark үед хар */
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white p-8 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Толгой */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent inline-block">
            Амжилттай хөрөнгө оруулалт авсан стартапууд
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mt-2">
            Манай платформоор дамжуулан өсөлтөө хурдасгаж буй төслүүд.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 dark:text-gray-400">
            Уншиж байна...
          </div>
        ) : fundedStartups.length === 0 ? (
          <div className="text-center py-20 text-slate-400 dark:text-gray-500">
            Хөрөнгө оруулалт олдсонгүй.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundedStartups.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                /* Card: Light үед цагаан + сүүдэр, Dark үед шилэн эффект */
                className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300"
              >
                {/* Glow: Dark mode дээр илүү тод харагдана */}
                <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/10 dark:from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  {/* Logo + Stage */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 overflow-hidden bg-slate-100 dark:bg-white/10 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/10">
                      {item.startup_details?.image_url ? (
                        <img
                          src={item.startup_details.image_url}
                          alt={item.startup_details.startup_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-slate-700 dark:text-white">
                          {item.startup_details?.startup_name?.[0] || "S"}
                        </span>
                      )}
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {item.startup_details?.stage}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.startup_details?.startup_name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.startup_details?.description}
                  </p>

                  {/* Amount */}
                  <div className="mb-4">
                    <span className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                      Босгосон дүн
                    </span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {Number(item.amount).toLocaleString()}
                    </p>
                  </div>

                  {/* Investor */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs text-slate-500 dark:text-gray-500 block mb-2 font-medium">
                      Хөрөнгө оруулагч:
                    </span>
                    <div className="flex flex-wrap gap-3">
                      <span className="text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-md text-slate-700 dark:text-gray-300 font-medium">
                        {item.investor_name}
                      </span>
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-500">
                      Industry
                    </span>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      {item.startup_details?.industry}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundedStartups;
