"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  ShieldCheck,
  Globe,
  Mail,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  UploadCloud,
  Briefcase,
  Loader2,
  CheckCircle2,
  Home,
  AlertCircle,
  Coins,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/component/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full bg-white/5 animate-pulse rounded-xl" />
  ),
});

export default function OrgRegistrationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    company_name: "",
    registration_number: "",
    focus_industry: "", // Үйл ажиллагааны чиглэл
    investment_range: "", // Хөрөнгө оруулалтын хэмжээ
    website: "",
    representative_name: "",
    contact_email: "",
    latitude: 47.9188,
    longitude: 106.9176,
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Файлын хэмжээ 5MB-аас хэтрэхгүй байх ёстой.");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !formData.company_name ||
        !formData.registration_number ||
        !formData.focus_industry ||
        !formData.investment_range
      ) {
        setError(
          "Байгууллагын мэдээлэл болон хөрөнгө оруулалтын мэдээллийг бүрэн оруулна уу.",
        );
        return false;
      }
    } else if (step === 2) {
      if (!formData.representative_name || !formData.contact_email) {
        setError("Холбоо барих мэдээллийг бүрэн оруулна уу.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact_email)) {
        setError("Мэйл хаяг буруу байна.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError("");
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Гэрчилгээний хуулбарыг хавсаргана уу.");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("company_name", formData.company_name);
    data.append("registration_number", formData.registration_number);
    data.append("focus_industry", formData.focus_industry);
    data.append("investment_range", formData.investment_range);
    data.append("website", formData.website);
    data.append("representative_name", formData.representative_name);
    data.append("contact_email", formData.contact_email);
    data.append("certificate_file", file);
    data.append("latitude", String(formData.latitude));
    data.append("longitude", String(formData.longitude));

    try {
      const token = localStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/investors/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const backendError =
          result.detail || result.message || "Бүртгэл хийхэд алдаа гарлаа.";
        setError(backendError);
      }
    } catch (err: any) {
      setError("Сервертэй холбогдоход алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex p-4 bg-blue-600/10 rounded-3xl text-blue-600 mb-6 border border-blue-500/20 shadow-inner"
                >
                  <Building2 size={32} />
                </motion.div>
                <h1 className="text-4xl font-black tracking-tight mb-3 italic uppercase bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                  Байгууллагын Бүртгэл
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Хөрөнгө оруулагч байгууллагын мэдээллээ баталгаажуулна уу.
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-center gap-4 mb-12">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: step === item ? 1.1 : 1,
                        backgroundColor:
                          step >= item ? "#2563eb" : "transparent",
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all border-2 ${
                        step >= item
                          ? "border-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "border-slate-200 dark:border-white/10 text-slate-400"
                      }`}
                    >
                      {item}
                    </motion.div>
                    {item < 3 && (
                      <div
                        className={`w-12 h-1 rounded-full ${step > item ? "bg-blue-600" : "bg-slate-100 dark:bg-white/5"}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm flex items-center gap-3 font-medium"
                  >
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {/* Буцах товч */}
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Байгууллагын нэр *
                          </label>
                          <div className="relative group">
                            <Building2
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                              size={18}
                            />
                            <input
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleInputChange}
                              type="text"
                              placeholder="Менежмент ХХК"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                            Регистрийн дугаар *
                          </label>
                          <div className="relative group">
                            <FileText
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                              size={18}
                            />
                            <input
                              name="registration_number"
                              value={formData.registration_number}
                              onChange={handleInputChange}
                              type="text"
                              placeholder="1234567"
                              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Үйл ажиллагааны чиглэл */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                          Үйл ажиллагааны чиглэл *
                        </label>
                        <div className="relative group">
                          <Layers
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                          />
                          <input
                            name="focus_industry"
                            value={formData.focus_industry}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Жишээ нь: Мэдээллийн технологи, Худалдаа..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all dark:text-white"
                          />
                        </div>
                      </div>
                      {/* Хөрөнгө оруулалтын хэмжээ */}
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                          Хөрөнгө оруулалтын хэмжээ (₮) *
                        </label>
                        <div className="relative group">
                          <Coins
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                          />
                          <input
                            name="investment_range"
                            value={formData.investment_range}
                            onChange={handleInputChange}
                            type="number"
                            placeholder="Хөрөнгө оруулах боломжтой дүн"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                          Вэбсайт (заавал биш)
                        </label>
                        <div className="relative group">
                          <Globe
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                          />
                          <input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            type="url"
                            placeholder="https://company.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm text-gray-400 text-center">
                          Байгууллагын байршлыг газрын зураг дээр сонгоно уу
                        </label>
                        <MapPicker onLocationSelect={handleLocationSelect} />
                        <div className="flex justify-between text-xs text-blue-400 px-2 mt-2 font-mono">
                          <span>LAT: {formData.latitude.toFixed(6)}</span>
                          <span>LNG: {formData.longitude.toFixed(6)}</span>
                        </div>
                      </div>

                      <button
                        onClick={nextStep}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/25 mt-8 flex items-center justify-center gap-2 group"
                      >
                        Үргэлжлүүлэх{" "}
                        <ChevronRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                          Төлөөлөх албан тушаалтан *
                        </label>
                        <div className="relative group">
                          <Briefcase
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                          />
                          <input
                            name="representative_name"
                            value={formData.representative_name}
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Овог Нэр"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                          Холбоо барих мэйл *
                        </label>
                        <div className="relative group">
                          <Mail
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                            size={18}
                          />
                          <input
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                            type="email"
                            placeholder="contact@company.mn"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8">
                        <button
                          onClick={prevStep}
                          className="flex-1 py-5 bg-slate-100 dark:bg-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={18} /> Буцах
                        </button>
                        <button
                          onClick={nextStep}
                          className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group"
                        >
                          Баримт бичиг{" "}
                          <ChevronRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <label className="block cursor-pointer group">
                        <div
                          className={`border-2 border-dashed ${file ? "border-emerald-500 bg-emerald-500/5" : "border-slate-200 dark:border-white/10 hover:border-blue-500/50"} rounded-[2rem] p-12 text-center space-y-4 transition-all duration-300 shadow-inner`}
                        >
                          <div
                            className={`w-20 h-20 ${file ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-blue-600/10 text-blue-600"} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg`}
                          >
                            <UploadCloud size={36} />
                          </div>
                          <div>
                            <p className="text-xl font-bold mb-1">
                              {file ? file.name : "Гэрчилгээний хуулбар"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {file
                                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                : "PDF эсвэл Зураг (Макс 5MB)"}
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </div>
                      </label>

                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4">
                        <ShieldCheck
                          className="text-emerald-500 shrink-0 mt-0.5"
                          size={24}
                        />
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">
                          Таны илгээсэн бичиг баримт зөвхөн хөрөнгө оруулалтын
                          эрх олгох шалгалтад ашиглагдах бөгөөд гуравдагч
                          этгээдэд дамжуулахгүй.
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={prevStep}
                          disabled={loading}
                          className="flex-1 py-5 bg-slate-100 dark:bg-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <ArrowLeft size={18} /> Буцах
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading || !file}
                          className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <>
                              Илгээх <ShieldCheck size={20} />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black mb-4 uppercase italic">
                Хүсэлт хүлээн авлаа
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                Таны мэдээллийг хүлээн авлаа. Манай баг удахгүй холбогдох болно.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-blue-600/20"
              >
                <Home className="w-5 h-5" /> Нүүр хуудас руу
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
