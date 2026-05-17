"use client";

import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Users, DollarSign } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    name: "GreenEnergy AI",
    industry: "CleanTech",
    stage: "Series A",
    raised: "₮450M",
    goal: "₮1.2B",
    progress: 38,
    desc: "AI-д суурилсан эрчим хүчний хэмнэлтийн систем.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80"
  },
  // Бусад төслүүд...
];

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      {/* Header & Search */}
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-6">Идэвхтэй төслүүд</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Төсөл хайх..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm font-semibold hover:bg-slate-100 transition-colors">
            <Filter className="w-5 h-5" /> Шүүлтүүр
          </button>
        </div>
      </header>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group"
  >
    {/* Project Image */}
    <div className="h-48 overflow-hidden relative">
      <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600">
        {project.industry}
      </div>
    </div>

    {/* Content */}
    <div className="p-8">
      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.name}</h3>
      <p className="text-slate-500 text-sm mb-6 line-clamp-2">{project.desc}</p>
      
      {/* Funding Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-400">Цугларсан: <span className="text-slate-900 dark:text-white">{project.raised}</span></span>
          <span className="text-blue-600">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <TrendingUp className="w-4 h-4" /> {project.stage}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <DollarSign className="w-4 h-4" /> {project.goal}
        </div>
      </div>
    </div>
  </motion.div>
);