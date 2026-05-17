"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Clock,
  Upload,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const steps = ["intro", "basic", "pitch", "fund", "founder", "done"];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    startup_name: "",
    industry: "",
    stage: "",
    description: "",
    pitch_deck_link: null,
    image_url: null,
    demo_link: "",
    fund_amount: "",
    fund_purpose: "",
    equity_offered: "",
    founder_name: "",
    email: "",
    linkedin_url: "",
    phone_number: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("access");
    console.log("TOKEN1:", token);
    if (!token) {
      alert("Та эхлээд нэвтрэх шаардлагатай!");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      const response = await fetch("http://127.0.0.1:8000/api/projects/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setStep(5);
      } else {
        const errorData = await response.json().catch(() => ({
          detail: "Серверээс алдаа ирлээ",
        }));

        // if (response.status === 401) {
        //   alert("Session дууссан. Дахин нэвтэрнэ үү.");
        //   router.push("/login");
        // } else {
        //   alert("Алдаа: " + (errorData.detail || JSON.stringify(errorData)));
        // }
      }
    } catch (err) {
      console.error(err);
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-6 font-sans relative text-slate-900 dark:text-white">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        {/* Буцах товч */}
        <div className="absolute top-6 left-8 z-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Явц харуулах */}
        {step > 0 && step < 5 && (
          <div className="mb-12 mt-4">
            <div className="flex justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Явц</span>
              <span>{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        

        <AnimatePresence mode="wait">
          {step === 0 && <Intro key="intro" onNext={next} />}
          {step === 1 && (
            <BasicInfo
              key="basic"
              data={form}
              onChange={handleChange}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 2 && (
            <Pitch
              key="pitch"
              data={form}
              onChange={handleChange}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <Fundraising
              key="fund"
              data={form}
              onChange={handleChange}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 4 && (
            <Founder
              key="founder"
              data={form}
              loading={loading}
              onChange={handleChange}
              onNext={handleSubmit}
              onBack={back}
            />
          )}
          {step === 5 && <Success key="success" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- КОМПОНЕНТУУД (Өөрчлөгдөхгүй) ---------------- */

const Intro = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center pt-4"
  >
    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl mb-8">
      <Rocket className="w-10 h-10 text-blue-600" />
    </div>
    <h1 className="text-4xl font-bold mb-4 tracking-tight">
      Төслөө бүртгүүлэх
    </h1>
    <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
      Хөрөнгө оруулалт татах аялалаа өнөөдөр эхлүүлээрэй.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
        <Clock className="w-5 h-5 mb-2 mx-auto text-blue-500" />
        <span className="text-sm font-medium">5-10 минут</span>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
        <ShieldCheck className="w-5 h-5 mb-2 mx-auto text-green-500" />
        <span className="text-sm font-medium">100% Нууц</span>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
        <CheckCircle2 className="w-5 h-5 mb-2 mx-auto text-purple-500" />
        <span className="text-sm font-medium">Хурдан хариу</span>
      </div>
    </div>
    <button
      onClick={onNext}
      className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all"
    >
      Эхлэх
    </button>
  </motion.div>
);

const BasicInfo = ({ data, onChange, onNext, onBack }) => (
  <StepWrapper
    title="Үндсэн мэдээлэл"
    subtitle="Таны стартапын талаарх ерөнхий ойлголт"
  >
    <div className="space-y-6">
      <Input
        label="Төслийн нэр"
        name="startup_name"
        placeholder="Жишээ: Meta"
        value={data.startup_name}
        onChange={onChange}
      />
      <Input
        label="Үйл ажиллагааны чиглэл"
        name="industry"
        placeholder="Жишээ: Fintech, AI"
        value={data.industry}
        onChange={onChange}
      />
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          Хөгжүүлэлтийн шат
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Idea", "MVP", "Growth"].map((s) => (
            <label
              key={s}
              className={`cursor-pointer flex items-center justify-center py-3 px-4 rounded-xl border-2 transition-all ${data.stage === s ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "border-slate-100 dark:border-slate-800 text-slate-500"}`}
            >
              <input
                type="radio"
                name="stage"
                value={s}
                onChange={onChange}
                className="hidden"
                checked={data.stage === s}
              />
              <span className="font-bold text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>
      <NavButtons onNext={onNext} onBack={onBack} />
    </div>
  </StepWrapper>
);

const Pitch = ({ data, onChange, onNext, onBack }) => (
  <StepWrapper
    title="Бүтээгдэхүүн"
    subtitle="Таны хийж буй зүйл хэрхэн ажилладаг вэ?"
  >
    <div className="space-y-6">
      <Input
        label="Төслийн танилцуулга"
        name="description"
        placeholder="Дэлгэрэнгүй тайлбар"
        value={data.description}
        onChange={onChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FileUpload
          label="Pitch Deck (PDF)"
          name="pitch_deck_link"
          onChange={onChange}
          file={data.pitch_deck_link}
        />
        <FileUpload
          label="Ковер зураг"
          name="image_url"
          onChange={onChange}
          file={data.image_url}
        />
      </div>
      <Input
        label="Вэбсайт / Демо холбоос"
        name="demo_link"
        placeholder="https://..."
        value={data.demo_link}
        onChange={onChange}
      />
      <NavButtons onNext={onNext} onBack={onBack} />
    </div>
  </StepWrapper>
);

const Fundraising = ({ data, onChange, onNext, onBack }) => (
  <StepWrapper
    title="Хөрөнгө таталт"
    subtitle="Санхүүжилтийн хэмжээ болон зорилго"
  >
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Хүсэж буй хөрөнгө ($)"
          name="fund_amount"
          placeholder="50000"
          type="number"
          value={data.fund_amount}
          onChange={onChange}
        />
        <Input
          label="Санал болгож буй хувь (%)"
          name="equity_offered"
          placeholder="10"
          type="number"
          value={data.equity_offered}
          onChange={onChange}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          Хөрөнгийн ашиглах зорилго
        </label>
        <textarea
          name="fund_purpose"
          placeholder="Зорилго..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] p-4"
          value={data.fund_purpose}
          onChange={onChange}
        />
      </div>
      <NavButtons onNext={onNext} onBack={onBack} />
    </div>
  </StepWrapper>
);

const Founder = ({ data, loading, onChange, onNext, onBack }) => (
  <StepWrapper
    title="Үүсгэн байгуулагч"
    subtitle="Бид тантай эргэн холбогдох болно"
  >
    <div className="space-y-6">
      <Input
        label="Бүтэн нэр"
        name="founder_name"
        placeholder="Нэр"
        value={data.founder_name}
        onChange={onChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Цахим хаяг"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          value={data.email}
          onChange={onChange}
        />
        <Input
          label="LinkedIn холбоос"
          name="linkedin_url"
          placeholder="linkedin.com/in/..."
          value={data.linkedin_url}
          onChange={onChange}
        />
      </div>
      <Input
        label="Утасны дугаар"
        name="phone_number"
        placeholder="99991111"
        value={data.phone_number}
        onChange={onChange}
      />
      <NavButtons onNext={onNext} onBack={onBack} final loading={loading} />
    </div>
  </StepWrapper>
);

const Success = () => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-10"
  >
    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
      <CheckCircle2 className="w-12 h-12 text-green-600" />
    </div>
    <h2 className="text-3xl font-bold mb-4">Амжилттай илгээгдлээ!</h2>
    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-10">
      Таны мэдээллийг хүлээн авлаа. Манай баг удахгүй холбогдох болно.
    </p>
    <Link
      href="/"
      className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all w-full text-center"
    >
      <Home className="w-5 h-5" /> Нүүр хуудас
    </Link>
  </motion.div>
);

const StepWrapper = ({ title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
  >
    <div className="mb-8 pt-4">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-slate-500 text-sm">{subtitle}</p>
    </div>
    {children}
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
    />
  </div>
);

const FileUpload = ({ label, name, onChange, file }) => (
  <div className="relative group">
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
      <Upload
        className={`w-6 h-6 mb-2 ${file ? "text-blue-500" : "text-slate-400"}`}
      />
      <span className="text-[10px] font-bold text-slate-500 px-2 text-center truncate w-full">
        {file ? file.name : label}
      </span>
      <input type="file" name={name} onChange={onChange} className="hidden" />
    </label>
  </div>
);

const NavButtons = ({ onNext, onBack, final, loading }) => (
  <div className="flex justify-between items-center pt-8">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium transition-colors"
    >
      <ChevronLeft className="w-4 h-4" /> Буцах
    </button>
    <button
      onClick={onNext}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 min-w-[140px]"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : final ? (
        "Илгээх"
      ) : (
        "Дараах"
      )}
      {!final && !loading && <ChevronRight className="w-4 h-4" />}
    </button>
  </div>
);
