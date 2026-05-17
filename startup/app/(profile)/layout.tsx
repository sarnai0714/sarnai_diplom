"use client";

import {
  User,
  Heart,
  Wallet,
  CircleHelp,
  Gift,
  MapPin,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState} from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileLayout({
  
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const menu = [
    {
      label: "Хувийн мэдээлэл",
      href: "/profile",
      icon: <User size={18} />,
    },
    {
      label: "Хадгалсан төсөл",
      href: "/wishlist",
      icon: <Heart size={18} />,
    },
    {
      label: "Хөрөнгө оруулалт",
      href: "/fund",
      icon: <Wallet size={18} />,
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="flex w-full max-w-[1450px] p-4 gap-6">
        {/* Sidebar */}
        <div className="w-[260px]">
          <div className="border-t pt-6 space-y-2">
            {menu.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition
                    ${
                      isActive
                        ? "bg-[#eceaf7] text-[#1d2240] font-medium"
                        : "hover:bg-white text-gray-700"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

            {/* Logout */}
            <button
            onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-white transition text-red-500 mt-4">
              <LogOut size={18} />
              Гарах
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
