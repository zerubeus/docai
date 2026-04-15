"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Clock, CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

type CaseStatus = "en_cours" | "resolu" | "archive";

interface CaseData {
  id: string;
  chief_complaint: string;
  status: CaseStatus;
  created_at: string;
  patients: {
    age: number;
    sex: string;
    region: string;
  };
  suggestions: { id: string }[];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusConfig: Record<
    string,
    { label: string; borderColor: string; textColor: string; icon: typeof Clock }
  > = {
    en_cours: {
      label: t("cases.statusOngoing"),
      borderColor: "border-l-warning",
      textColor: "text-warning",
      icon: Clock,
    },
    resolu: {
      label: t("cases.statusResolved"),
      borderColor: "border-l-success",
      textColor: "text-success",
      icon: CheckCircle,
    },
    archive: {
      label: t("cases.statusArchived"),
      borderColor: "border-l-text-muted",
      textColor: "text-text-muted",
      icon: CheckCircle,
    },
  };

  const totalCases = cases.length;
  const enCours = cases.filter((c) => c.status === "en_cours").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {totalCases} {t("dashboard.casesTotal")} &bull; {enCours} {t("dashboard.ongoing")}
        </p>
      </div>

      <Link
        href="/cases/new"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90 transition-colors duration-150"
      >
        <Plus size={18} strokeWidth={1.5} />
        {t("dashboard.newCase")}
      </Link>

      <div>
        <h2 className="text-lg font-semibold text-text-dark mb-4">
          {t("dashboard.recentCases")}
        </h2>
        {cases.length === 0 ? (
          <p className="text-sm text-text-secondary py-8 text-center">
            {t("dashboard.noCases")}
          </p>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => {
              const status = statusConfig[c.status] || statusConfig.en_cours;
              const StatusIcon = status.icon;
              const date = new Date(c.created_at).toISOString().split("T")[0];
              return (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className={`block bg-white rounded-lg border border-border border-l-4 ${status.borderColor} shadow-sm hover:shadow-md transition-shadow duration-150 p-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium text-text-dark truncate">
                        {c.chief_complaint}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {t("dashboard.patient")}: {c.patients?.age} {t("common.yearsOld")}, {c.patients?.sex}{" "}
                        &bull; {c.patients?.region}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${status.textColor}`}
                        >
                          <StatusIcon size={12} strokeWidth={1.5} />
                          {status.label}
                        </span>
                        <span className="text-xs text-text-muted">
                          {c.suggestions?.length || 0} {t("dashboard.suggestions")}
                        </span>
                        <span className="text-xs text-text-muted">{date}</span>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-text-muted shrink-0"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
