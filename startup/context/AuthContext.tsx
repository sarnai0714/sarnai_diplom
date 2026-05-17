"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; username: string; email: string; role: string };

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 🔐 Нэвтрэх функц - username ашиглана
  const login = async (username: string, password: string) => {
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const userRes = await fetch("http://127.0.0.1:8000/auth/users/me/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      }); 

      if (userRes.ok) {
        const userData = await userRes.json();

        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ THIS IS THE FIX
        localStorage.setItem("role", userData.role);
        return userData;
      }
    } else {
      throw new Error("Хэрэглэгчийн нэр эсвэл нууц үг буруу байна.");
    }
  };

  // 📝 Бүртгүүлэх функц
  const register = async (userData: any) => {
    const res = await fetch("http://127.0.0.1:8000/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = Object.values(errorData).flat().join(" ");
      throw new Error(errorMessage || "Бүртгүүлэхэд алдаа гарлаа.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
