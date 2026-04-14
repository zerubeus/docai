"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle, Filter, Loader2 } from "lucide-react";

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
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  en_cours: { label: "En cours", color: "text-warning", icon: Clock },
  resolu: { label: "Resolu", color: "text-success", icon: CheckCircle },
  archive: { label: "Archive", color: "text-text-muted", icon: CheckCircle },
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | CaseStatus>("all");

  useEffect(() => {
    setLoading(true);
    const url =
      filter === "all" ? "/api/cases" : `/api/cases?status=${filter}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">Mes Cas</h1>
        <div className="flex items-center gap-2">
          <Filter size={16} strokeWidth={1.5} className="text-text-muted" />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | CaseStatus)
            }
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 appearance-none"
          >
            <option value="all">Tous</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Resolu</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-text-muted" />
        </div>
      ) : (
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
              {cases.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-text-secondary"
                  >
                    Aucun cas
                  </td>
                </tr>
              ) : (
                cases.map((c) => {
                  const status =
                    statusConfig[c.status] || statusConfig.en_cours;
                  const StatusIcon = status.icon;
                  const date = new Date(c.created_at)
                    .toISOString()
                    .split("T")[0];
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-surface transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/cases/${c.id}`}
                          className="text-sm font-medium text-accent hover:underline"
                        >
                          #{c.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-dark">
                        {c.patients?.age} ans, {c.patients?.sex}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell max-w-xs truncate">
                        {c.chief_complaint}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon size={12} strokeWidth={1.5} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted hidden sm:table-cell">
                        {date}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
