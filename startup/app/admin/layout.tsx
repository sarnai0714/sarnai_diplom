"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    // token check
    if (!token || token === "undefined" || token === "null") {
      router.push("/login");
      return;
    }

    // role check
    if (role?.toLowerCase().trim() !== "admin") {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, []);

  // loading state
  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
