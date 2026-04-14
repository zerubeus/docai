"use client";

import Link from "next/link";
import { Plus, Clock, CheckCircle, ChevronRight } from "lucide-react";

type CaseStatus = "en_cours" | "resolu";

interface MockCase {
  id: string;
  patientAge: number;
  patientSex: string;
  patientRegion: string;
  chiefComplaint: string;
  suggestionsCount: number;
  status: CaseStatus;
  date: string;
}

const mockCases: MockCase[] = [
  {
    id: "1",
    patientAge: 45,
    patientSex: "M",
    patientRegion: "Tunis",
    chiefComplaint: "Douleur thoracique recurrente",
    suggestionsCount: 4,
    status: "en_cours",
    date: "2026-04-12",
  },
  {
    id: "2",
    patientAge: 32,
    patientSex: "F",
    patientRegion: "Sousse",
    chiefComplaint: "Cephalees chroniques avec aura",
    suggestionsCount: 3,
    status: "resolu",
    date: "2026-04-10",
  },
  {
    id: "3",
    patientAge: 58,
    patientSex: "M",
    patientRegion: "Sfax",
    chiefComplaint: "Fatigue persistante et perte de poids",
    suggestionsCount: 5,
    status: "en_cours",
    date: "2026-04-11",
  },
  {
    id: "4",
    patientAge: 27,
    patientSex: "F",
    patientRegion: "Ariana",
    chiefComplaint: "Eruption cutanee prurigineuse",
    suggestionsCount: 2,
    status: "resolu",
    date: "2026-04-09",
  },
  {
    id: "5",
    patientAge: 63,
    patientSex: "M",
    patientRegion: "Monastir",
    chiefComplaint: "Dyspnee d'effort progressive",
    suggestionsCount: 4,
    status: "en_cours",
    date: "2026-04-13",
  },
];

const statusConfig: Record<CaseStatus, { label: string; borderColor: string; textColor: string; icon: typeof Clock }> = {
  en_cours: { label: "En cours", borderColor: "border-l-warning", textColor: "text-warning", icon: Clock },
  resolu: { label: "Resolu", borderColor: "border-l-success", textColor: "text-success", icon: CheckCircle },
};

export default function DashboardPage() {
  const totalCases = mockCases.length;
  const enCours = mockCases.filter((c) => c.status === "en_cours").length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {totalCases} cas total &bull; {enCours} en cours &bull; 89% suggestions utiles
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
        <h2 className="text-lg font-semibold text-text-dark mb-4">Cas recents</h2>
        <div className="space-y-3">
          {mockCases.map((c) => {
            const status = statusConfig[c.status];
            const StatusIcon = status.icon;
            return (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className={`block bg-white rounded-lg border border-border border-l-4 ${status.borderColor} shadow-sm hover:shadow-md transition-shadow duration-150 p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium text-text-dark truncate">
                      {c.chiefComplaint}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Patient: {c.patientAge} ans, {c.patientSex} &bull; {c.patientRegion}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.textColor}`}>
                        <StatusIcon size={12} strokeWidth={1.5} />
                        {status.label}
                      </span>
                      <span className="text-xs text-text-muted">
                        {c.suggestionsCount} suggestions
                      </span>
                      <span className="text-xs text-text-muted">{c.date}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.5} className="text-text-muted shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
