"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Hash, Stethoscope, Brain, BookOpen, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import { useTranslation } from "@/lib/useTranslation";

const specialties = [
  "Medecine generale",
  "Medecine interne",
  "Cardiologie",
  "Pediatrie",
  "Neurologie",
  "Gastro-enterologie",
  "Dermatologie",
  "Autre",
];

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const features = [
    {
      icon: Brain,
      title: t("register.feature1Title"),
      description: t("register.feature1Desc"),
    },
    {
      icon: BookOpen,
      title: t("register.feature2Title"),
      description: t("register.feature2Desc"),
    },
    {
      icon: Shield,
      title: t("register.feature3Title"),
      description: t("register.feature3Desc"),
    },
  ];

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          specialty: form.specialty,
          license_number: form.licenseNumber,
        },
      },
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
            {t("register.tagline")}
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

        {/* Bottom link */}
        <div className="relative z-10">
          <p className="text-sm text-white/60">
            {t("register.alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-white/90 hover:text-white transition-colors duration-150 underline underline-offset-2"
            >
              {t("register.login")}
            </Link>
          </p>
        </div>

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
            <h1 className="text-2xl font-bold text-text-dark">{t("register.title")}</h1>
            <p className="mt-1 text-sm text-text-secondary">{t("register.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-error/5 border border-error/20 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-text-dark mb-1.5"
                >
                  {t("register.firstName")}
                </label>
                <div className="relative">
                  <User
                    size={16}
                    strokeWidth={1.5}
                    className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-white ps-9 pe-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                    placeholder={t("register.firstNamePlaceholder")}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-text-dark mb-1.5"
                >
                  {t("register.lastName")}
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("register.lastNamePlaceholder")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("register.email")}
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
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  dir="ltr"
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("register.emailPlaceholder")}
                />
              </div>
            </div>

            {/* Specialty */}
            <div>
              <label
                htmlFor="specialty"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("register.specialty")}
              </label>
              <div className="relative">
                <Stethoscope
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <select
                  id="specialty"
                  value={form.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 appearance-none"
                >
                  <option value="" disabled>
                    {t("register.specialtyPlaceholder")}
                  </option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* License number */}
            <div>
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("register.licenseNumber")}
              </label>
              <div className="relative">
                <Hash
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="licenseNumber"
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  required
                  dir="ltr"
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("register.licenseNumberPlaceholder")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("register.password")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("register.passwordPlaceholder")}
                />
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text-dark mb-1.5"
              >
                {t("register.confirmPassword")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-border bg-white ps-10 pe-4 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150"
                  placeholder={t("register.confirmPasswordPlaceholder")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 transition-colors duration-150"
            >
              {loading ? t("register.submitting") : t("register.submit")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {t("register.alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-accent hover:text-accent/80 transition-colors duration-150"
            >
              {t("register.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
