"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle, Filter } from "lucide-react";

type CaseStatus = "en_cours" | "resolu";

interface CaseItem {
  id: string;
  patientAge: number;
  patientSex: string;
  motif: string;
  status: CaseStatus;
  date: string;
}

const mockCases: CaseItem[] = [
  { id: "1", patientAge: 45, patientSex: "M", motif: "Douleur thoracique recurrente", status: "en_cours", date: "2026-04-12" },
  { id: "2", patientAge: 32, patientSex: "F", motif: "Cephalees chroniques avec aura", status: "resolu", date: "2026-04-10" },
  { id: "3", patientAge: 58, patientSex: "M", motif: "Fatigue persistante et perte de poids", status: "en_cours", date: "2026-04-11" },
  { id: "4", patientAge: 27, patientSex: "F", motif: "Eruption cutanee prurigineuse", status: "resolu", date: "2026-04-09" },
  { id: "5", patientAge: 63, patientSex: "M", motif: "Dyspnee d'effort progressive", status: "en_cours", date: "2026-04-13" },
  { id: "6", patientAge: 41, patientSex: "F", motif: "Douleurs articulaires migrantes", status: "resolu", date: "2026-04-08" },
  { id: "7", patientAge: 55, patientSex: "M", motif: "Hematurie macroscopique", status: "en_cours", date: "2026-04-14" },
];

const statusConfig: Record<CaseStatus, { label: string; color: string; icon: typeof Clock }> = {
  en_cours: { label: "En cours", color: "text-warning", icon: Clock },
  resolu: { label: "Resolu", color: "text-success", icon: CheckCircle },
};

export default function CasesPage() {
  const [filter, setFilter] = useState<"all" | CaseStatus>("all");

  const filtered =
    filter === "all" ? mockCases : mockCases.filter((c) => c.status === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">Mes Cas</h1>
        <div className="flex items-center gap-2">
          <Filter size={16} strokeWidth={1.5} className="text-text-muted" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | CaseStatus)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 appearance-none"
          >
            <option value="all">Tous</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Resolu</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Patient
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                Motif
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                Statut
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => {
              const status = statusConfig[c.status];
              const StatusIcon = status.icon;
              return (
                <tr key={c.id} className="hover:bg-surface transition-colors duration-150">
                  <td className="px-4 py-3">
                    <Link
                      href={`/cases/${c.id}`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      #{c.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-dark">
                    {c.patientAge} ans, {c.patientSex}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell max-w-xs truncate">
                    {c.motif}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}>
                      <StatusIcon size={12} strokeWidth={1.5} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted hidden sm:table-cell">
                    {c.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
