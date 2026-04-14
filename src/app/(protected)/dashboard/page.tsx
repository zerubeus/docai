"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Clock, CheckCircle, ChevronRight, Loader2 } from "lucide-react";

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

const statusConfig: Record<
  string,
  {
    label: string;
    borderColor: string;
    textColor: string;
    icon: typeof Clock;
  }
> = {
  en_cours: {
    label: "En cours",
    borderColor: "border-l-warning",
    textColor: "text-warning",
    icon: Clock,
  },
  resolu: {
    label: "Resolu",
    borderColor: "border-l-success",
    textColor: "text-success",
    icon: CheckCircle,
  },
  archive: {
    label: "Archive",
    borderColor: "border-l-text-muted",
    textColor: "text-text-muted",
    icon: CheckCircle,
  },
};

export default function DashboardPage() {
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
        <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {totalCases} cas total &bull; {enCours} en cours
        </p>
      </div>

      <Link
        href="/cases/new"
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90 transition-colors duration-150"
      >
        <Plus size={18} strokeWidth={1.5} />
        Nouveau Cas
      </Link>

      <div>
        <h2 className="text-lg font-semibold text-text-dark mb-4">
          Cas recents
        </h2>
        {cases.length === 0 ? (
          <p className="text-sm text-text-secondary py-8 text-center">
            Aucun cas pour le moment.
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
                        Patient: {c.patients?.age} ans, {c.patients?.sex}{" "}
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
                          {c.suggestions?.length || 0} suggestions
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
