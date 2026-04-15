"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Stethoscope, Brain, BookOpen, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useTranslation } from "@/lib/useTranslation";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: Brain,
      title: t("login.feature1Title"),
      description: t("login.feature1Desc"),
    },
    {
      icon: BookOpen,
      title: t("login.feature2Title"),
      description: t("login.feature2Desc"),
    },
    {
      icon: Shield,
      title: t("login.feature3Title"),
      description: t("login.feature3Desc"),
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — hidden on mobile */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1E3A5F 0%, #0F2744 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Stethoscope size={26} strokeWidth={1.5} className="text-white" />
          <span className="text-xl font-bold text-white tracking-tight">DocAI</span>
        </div>

        {/* Tagline + features */}
        <div className="flex flex-col gap-10">
          <p className="text-2xl font-semibold text-white/90 leading-snug">
            {t("login.tagline")}
          </p>

          <div className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon size={17} strokeWidth={1.5} style={{ color: "#0D9488" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-white/55 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacer */}
        <div />

        {/* Decorative dot grid */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-56"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 md:w-1/2 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 md:hidden">
            <Stethoscope size={22} strokeWidth={1.5} className="text-primary" />
            <span className="text-lg font-bold text-primary">DocAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-dark">{t("login.title")}</h1>
            <p className="mt-1 text-sm text-text-secondary">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-error/5 border border-error/20 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("login.emailPlaceholder")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-dark"
                >
                  {t("login.password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent hover:text-accent/80 transition-colors duration-150"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("login.passwordPlaceholder")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 transition-colors duration-150"
            >
              {loading ? t("login.submitting") : t("login.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {t("login.noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-accent hover:text-accent/80 transition-colors duration-150"
            >
              {t("login.createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
