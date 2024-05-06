"use client"
import DashNav from "@/components/dashNav/dashNav";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    const role = Cookies.get("role");
    if (role != "superAdmin") {
      router.push("/")
    }
  });

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl border p-2 rounded">Dashboard</h1>
      <DashNav />
      <div>
        {children}
      </div>
    </div>
  );
}
