"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import type { Lang } from "@/lib/i18n";

const LANGUAGES: { code: Lang; label: string; nativeLabel: string }[] = [
  { code: "fr", label: "Français", nativeLabel: "FR" },
  { code: "en", label: "English", nativeLabel: "EN" },
  { code: "ar", label: "العربية", nativeLabel: "AR" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-dark transition-colors duration-150"
        aria-label="Change language"
      >
        <Globe size={16} strokeWidth={1.5} />
        <span>{current.nativeLabel}</span>
      </button>

      {open && (
        <div className="absolute end-0 mt-1 w-36 bg-white border border-border rounded-lg shadow-md py-1 z-50">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLang(language.code);
                setOpen(false);
              }}
              className={`w-full text-start px-3 py-2 text-sm transition-colors duration-150 ${
                lang === language.code
                  ? "text-accent font-medium bg-accent/5"
                  : "text-text-dark hover:bg-surface"
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
