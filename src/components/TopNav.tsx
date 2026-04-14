"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cases", label: "Mes Cas" },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold text-primary lg:hidden">
            DocAI
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-dark"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface transition-colors duration-150">
            <User size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden border-t border-border px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? "text-accent bg-accent/10" : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/cases/new"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary"
          >
            Nouveau Cas
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary"
          >
            Parametres
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary w-full"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Deconnexion
          </button>
        </div>
      )}
    </header>
  );
}
