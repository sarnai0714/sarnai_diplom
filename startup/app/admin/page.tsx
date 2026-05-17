"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@tinymce/tinymce-react";
import {
  CheckCircle2,
  XCircle,
  Search,
  Save,
  LayoutDashboard,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// API URLs
const CONTENT_API_URL = "http://127.0.0.1:8000/api/contents/";
const PROJECT_API_URL = "http://127.0.0.1:8000/api/projects/";

export default function AdminDashboard() {
  // --- States ---
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Content API States
  const [contentData, setContentData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [editorContent, setEditorContent] = useState("");

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. Төслүүдийг татах (GET) ---
  const fetchProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(PROJECT_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const actualData = Array.isArray(data) ? data : data.results || [];
      setProjects(actualData);
    } catch (error) {
      console.error("Төслүүдийг татахад алдаа гарлаа:", error);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  // --- 2. Веб текстүүдийг татах (GET) ---
  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(CONTENT_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const actualData = Array.isArray(data) ? data : data.results || [];
      setContentData(actualData);

      if (actualData.length > 0) {
        setSelectedKey(actualData[0].content_key);
        setEditorContent(actualData[0].text_content);
      }
    } catch (error) {
      console.error("Дата татахад алдаа гарлаа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchProjects();
  }, []);

  // --- 3. Төслийн төлөв өөрчлөх (PATCH) ---
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${PROJECT_API_URL}${id}/update_status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      } else {
        const err = await response.json();
        alert(`Алдаа: ${err.error || "Төлөв солиход алдаа гарлаа"}`);
      }
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  // --- 4. Веб текст хадгалах (PATCH) ---
  const handleSaveContent = async () => {
    const activeItem = contentData.find(
      (item) => item.content_key === selectedKey,
    );
    if (!activeItem) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(
        `${CONTENT_API_URL}${activeItem.content_key}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text_content: editorContent }),
        },
      );

      if (response.ok) {
        const updated = await response.json();
        setContentData((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
        alert("Амжилттай хадгалагдлаа!");
      }
    } catch (error) {
      alert("Алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Шүүлтүүр ---
  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = p.startup_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/30" />
          <span className="font-black text-xl tracking-tight dark:text-white uppercase italic">
            Admin
          </span>
        </div>
        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Хянах самбар"
            active
          />
          <NavItem icon={<FileText size={20} />} label="Төслүүд" />
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* 1. Content Editor Section */}
        <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-black flex items-center gap-3 dark:text-white">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              Вебсайтын текст удирдах
            </h2>

            <select
              disabled={isLoading || contentData.length === 0}
              value={selectedKey}
              onChange={(e) => {
                const newKey = e.target.value;
                setSelectedKey(newKey);
                const item = contentData.find((c) => c.content_key === newKey);
                if (item) setEditorContent(item.text_content);
              }}
              className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 dark:text-white px-5 py-3 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold transition-all cursor-pointer"
            >
              {contentData.map((item, index) => (
                <option key={item.id || index} value={item.content_key}>
                  [{item.page_name}] - {item.content_key}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 min-h-[300px] bg-slate-50 dark:bg-slate-950 flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center gap-2 text-slate-500">
                  <Loader2 className="animate-spin" /> Уншиж байна...
                </div>
              ) : (
                <Editor
                  apiKey="4r9p8gumquq3zotnmlmpfvc0qgfok603v3jxp03uq97y1jg8"
                  value={editorContent}
                  onEditorChange={(newVal) => setEditorContent(newVal)}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: ["lists", "link", "image", "table", "code"],
                    toolbar:
                      "undo redo | bold italic underline | bullist numlist|forecolor backcolor | link image | code|blocks|alignleft aligncenter alignright",
                    skin: "oxide-dark",
                    content_css: "dark",
                  }}
                />
              )}
            </div>

            <button
              onClick={handleSaveContent}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? "Хадгалж байна..." : "Өөрчлөлтийг нийтлэх"}
            </button>
          </div>
        </section>

        {/* 2. Header & Search */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Төсөл баталгаажуулалт
            </h1>
            <p className="text-slate-500 text-sm">
              Ирсэн төслүүдийг хянах болон шийдвэрлэх
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Төсөл хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
            />
          </div>
        </header>

        {/* 3. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Нийт хүсэлт" value={projects.length} />
          <StatCard
            label="Хүлээгдэж буй"
            value={projects.filter((p) => p.status === "pending").length}
          />
          <StatCard
            label="Зөвшөөрсөн"
            value={projects.filter((p) => p.status === "accepted").length}
          />
          <StatCard
            label="Татгалзсан"
            value={projects.filter((p) => p.status === "rejected").length}
          />
        </div>

        {/* 4. Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
          {["all", "pending", "reviewed", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                filter === tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-500"
              }`}
            >
              {tab === "all" ? "Бүгд" : tab}
            </button>
          ))}
        </div>

        {/* 5. Projects Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Төслийн нэр
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Үүсгэн байгуулагч
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Салбар
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Төлөв
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isProjectsLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-20 text-slate-400"
                    >
                      Уншиж байна...
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold dark:text-white block">
                            {project.startup_name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                          {project.founder_name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] font-semibold dark:text-slate-400">
                            {project.industry}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {project.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(project.id, "accepted")
                                  }
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg"
                                >
                                  <CheckCircle2 size={20} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(project.id, "rejected")
                                  }
                                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                                >
                                  <XCircle size={20} />
                                </button>
                              </>
                            )}
                            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                              <Eye size={20} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
        {label}
      </p>
      <p className="text-3xl font-black dark:text-white">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: any = {
    pending: {
      label: "Хүлээгдэж буй",
      style:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500",
    },
    reviewed: {
      label: "Хянасан",
      style: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
    },
    accepted: {
      label: "Зөвшөөрсөн",
      style:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500",
    },
    rejected: {
      label: "Татгалзсан",
      style: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-500",
    },
  };
  const current = config[status] || config.pending;
  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${current.style}`}
    >
      {current.label}
    </span>
  );
}
