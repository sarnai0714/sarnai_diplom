"use client";

import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  // PASSWORD STATE
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });

  const [openModal, setOpenModal] = useState(false);

  // =====================
  // GET PROFILE
  // =====================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access");

        const res = await fetch("http://127.0.0.1:8000/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  // INPUT CHANGE (PROFILE)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // PASSWORD CHANGE INPUT
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // SAVE PROFILE
  // =====================
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Амжилттай хадгаллаа");
    } catch (error) {
      console.log(error);
    }
  };

  // =====================
  // CHANGE PASSWORD API
  // =====================
  const changePassword = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch("http://127.0.0.1:8000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Амжилттай солигдлоо");
        setOpenModal(false);
        setPasswordData({ old_password: "", new_password: "" });
      } else {
        alert(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#020617] transition-colors duration-300 p-10">
      <div className="max-w-7xl mx-auto flex gap-10">
        <div className="flex-1">
          <h1 className="text-5xl font-black italic text-[#1d2240] dark:text-white mb-10">
            Хувийн мэдээлэл
          </h1>

          {/* FORM */}
          <div className="grid grid-cols-2 gap-8">
            {/* last name */}
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">
                Овог
              </label>

              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full h-14 rounded-full border px-6 dark:bg-slate-900 dark:text-white"
                placeholder="Овог"
              />
            </div>

            {/* role */}
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">
                Role
              </label>

              <input
                value={formData.role}
                disabled
                className="w-full h-14 rounded-full border px-6 bg-gray-100 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* first name */}
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">
                Нэр
              </label>

              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full h-14 rounded-full border px-6 dark:bg-slate-900 dark:text-white"
                placeholder="Нэр"
              />
            </div>
            {/* username */}
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">
                Хэрэглэгчийн нэр
              </label>

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-14 rounded-full border px-6 dark:bg-slate-900 dark:text-white"
                placeholder="Username"
              />
            </div>

            {/* email */}
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium dark:text-white">
                Email
              </label>

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-14 rounded-full border px-6 dark:bg-slate-900 dark:text-white"
                placeholder="Email"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <button
              onClick={handleSave}
              className="h-14 rounded-full bg-orange-500 text-white font-semibold"
            >
              Хадгалах
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="h-14 rounded-full bg-white dark:bg-slate-900 border dark:text-white"
            >
              Нууц үг солих
            </button>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* PASSWORD MODAL */}
      {/* ===================== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[420px] rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl p-6 animate-fadeIn">
            {/* HEADER */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-[#1d2240] dark:text-white">
                🔐 Нууц үг солих
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Шинэ нууц үгээ оруулна уу
              </p>
            </div>

            {/* INPUTS */}
            <div className="space-y-4">
              <input
                type="password"
                name="old_password"
                placeholder="Хуучин нууц үг"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400 transition"
              />

              <input
                type="password"
                name="new_password"
                placeholder="Шинэ нууц үг"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={changePassword}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition"
              >
                Солих
              </button>

              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                Болих
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
