"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FilePlus,
  Settings,
  LogOut,
  Brain,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/useTranslation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const navItems = [
    { href: "/assistant", label: t("nav.assistant"), icon: Brain },
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/cases", label: t("nav.myCases"), icon: FolderOpen },
    { href: "/cases/new", label: t("nav.newCase"), icon: FilePlus },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-border rtl:border-r-0 rtl:border-l">
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          DocAI
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-surface hover:text-text-dark"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-dark transition-colors duration-150 w-full"
        >
          <LogOut size={18} strokeWidth={1.5} />
          {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
