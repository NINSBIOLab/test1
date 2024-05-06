'use client'
import Sidebar from "@/components/sidebar/Sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const role = Cookies.get("role");
    if (!(role === "superAdmin" || role === "billOfficer")) {
      router.push('/login');
    }
  });

  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
