"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Zap,
  CreditCard,
  Target,
  Lock,
  Sun,
  Moon,
} from "lucide-react";

export default function InvestmentCheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [amount, setAmount] = useState<number>(5000);
  const [step, setStep] = useState(1);
  const startupName = "UrgaaTech";
  const valuation = 5000000;
  const equity = ((amount / valuation) * 100).toFixed(3);

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] text-slate-900 dark:text-white font-sans selection:bg-blue-600 transition-colors duration-500">
      {/* Background Glow - Зөвхөн Dark үед илүү тод харагдана */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <nav className="fixed top-25 inset-x-0 z-50 max-w-5xl mx-auto px-4">
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-[2rem] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
              className="group flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all"
            >
              <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                <ArrowLeft size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">
                Back
              </span>
            </button>
          </div>

          <div className="flex gap-2.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-10 sm:w-14 rounded-full transition-all duration-700 ${
                  s <= step
                    ? "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                    : "bg-slate-200 dark:bg-white/5"
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-24 items-start"
            >
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest">
                  <Target size={12} /> Investment Round
                </div>
                <h1 className="text-7xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
                  Ирээдүйдээ <br /> хөрөнгө оруул.
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                  {startupName} төсөлд хөрөнгө оруулснаар та дараагийн том
                  технологийн нэг хэсэг болно.
                </p>
                <div className="flex gap-10 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Min. Invest
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      $500
                    </p>
                  </div>
                  <div className="w-px h-12 bg-slate-200 dark:bg-white/10" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                      Stage
                    </p>
                    <p className="text-2xl font-black text-blue-600 font-mono italic">
                      Seed
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] blur opacity-15 group-hover:opacity-30 transition duration-1000" />
                <div className="relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 p-12 rounded-[40px] shadow-2xl">
                  <div className="space-y-12">
                    <div className="text-center">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] block mb-8">
                        Enter Amount (USD)
                      </label>
                      <div className="flex items-center justify-center">
                        <span className="text-5xl font-light text-slate-300 dark:text-slate-700 mr-2">
                          $
                        </span>
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="w-full bg-transparent border-none text-center text-8xl font-black focus:ring-0 outline-none p-0 tracking-tighter text-slate-900 dark:text-white"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10">
                      <div className="bg-slate-50 dark:bg-[#111] p-6 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Equity Share
                        </p>
                        <p className="text-3xl font-black text-blue-600">
                          {equity}%
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#111] p-6 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Market Cap
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                          $5.0M
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-6 rounded-2xl font-black text-xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      Continue{" "}
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
                  Legal Agreement
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-sm tracking-widest uppercase">
                  Step 02 — Digital Signature
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none text-slate-900 dark:text-white">
                  <Lock size={120} />
                </div>
                <div className="relative z-10 h-72 overflow-y-auto pr-6 space-y-6 text-slate-600 dark:text-slate-400 font-medium scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 leading-loose text-lg">
                  <p className="text-slate-900 dark:text-white font-bold">
                    1. Эрсдэлийн мэдэгдэл
                  </p>
                  <p>
                    Стартап хөрөнгө оруулалт нь маш өндөр эрсдэлтэй. Та өөрийн
                    оруулсан хөрөнгийг 100% алдах боломжтойг хүлээн зөвшөөрч
                    байна...
                  </p>
                  <p className="text-slate-900 dark:text-white font-bold">
                    2. SAFE Гэрээ
                  </p>
                  <p>
                    Энэхүү хөрөнгө оруулалт нь Simple Agreement for Future
                    Equity нөхцөлөөр явагдаж байгаа бөгөөд дараагийн хөрөнгө
                    оруулалтын шатанд хувьцаа болон хөрвөнө.
                  </p>
                </div>
                <div className="mt-10 pt-10 border-t border-slate-200 dark:border-white/5">
                  <label className="flex items-center gap-5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer hidden"
                        id="agree"
                      />
                      <div className="w-8 h-8 border-2 border-slate-300 dark:border-white/10 rounded-xl peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                        <ShieldCheck
                          className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                          size={20}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400 dark:opacity-40 group-hover:opacity-100 transition-opacity">
                      I agree to the terms & conditions
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-7 rounded-[30px] font-black text-2xl uppercase tracking-tighter hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
              >
                Sign & Proceed
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex p-6 bg-blue-600/10 rounded-full text-blue-600 mb-6 border border-blue-600/20">
                  <Zap size={50} fill="currentColor" />
                </div>
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                  PAYMENT
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest text-xs">
                  Finalizing Investment:{" "}
                  <span className="text-blue-600 dark:text-white underline">
                    ${amount.toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full p-8 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[30px] flex items-center justify-between group hover:border-blue-600 transition-all shadow-lg dark:shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <CreditCard size={32} />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        QPay Terminal
                      </p>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Instant Activation
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400 dark:text-slate-700 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                </button>

                <button className="w-full p-8 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-[30px] flex items-center justify-between group hover:border-blue-600 transition-all shadow-lg dark:shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <ShieldCheck size={32} />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Wire Transfer
                      </p>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Manual Processing
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400 dark:text-slate-700 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                </button>
              </div>

              <p className="text-[10px] text-center font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] pt-10">
                Encrypted & Secured by Urgaa Vault
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
