"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCircle,
  Stethoscope,
  Hash,
  CalendarDays,
  FolderOpen,
  Clock,
  CheckCircle,
  ChevronRight,
  Pencil,
  Loader2,
} from "lucide-react";

interface DoctorProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialty: string;
  license_number: string | null;
  subscription_status: "free" | "active" | "cancelled";
  cases_this_month: number;
  created_at: string;
}

interface CaseData {
  id: string;
  chief_complaint: string;
  status: "en_cours" | "resolu" | "archive";
  created_at: string;
  patients: {
    age: number;
    sex: string;
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

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-4 flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
        <Icon size={18} strokeWidth={1.5} className="text-accent" />
      </div>
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-lg font-semibold text-text-dark">{value}</p>
      </div>
    </div>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/doctor/profile").then((r) => r.json()),
      fetch("/api/cases").then((r) => r.json()),
    ])
      .then(([profileData, casesData]) => {
        if (!profileData.error) setProfile(profileData);
        if (Array.isArray(casesData)) setCases(casesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} strokeWidth={1.5} className="animate-spin text-text-muted" />
      </div>
    );
  }

  const recentCases = cases.slice(0, 5);
  const totalCases = cases.length;
  const memberSince = profile?.created_at ? formatDate(profile.created_at) : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar placeholder */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-border">
              {profile ? (
                <span className="text-xl font-semibold text-primary">
                  {getInitials(profile.first_name, profile.last_name)}
                </span>
              ) : (
                <UserCircle size={32} strokeWidth={1.5} className="text-text-muted" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-text-dark">
                {profile
                  ? `Dr. ${profile.first_name} ${profile.last_name}`
                  : "—"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                {profile?.specialty && (
                  <span className="flex items-center gap-1.5">
                    <Stethoscope size={13} strokeWidth={1.5} />
                    {profile.specialty}
                  </span>
                )}
                {profile?.license_number && (
                  <span className="flex items-center gap-1.5">
                    <Hash size={13} strokeWidth={1.5} />
                    {profile.license_number}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} strokeWidth={1.5} />
                  Membre depuis {memberSince}
                </span>
              </div>
              <p className="text-xs text-text-muted">{profile?.email}</p>
            </div>
          </div>
          <Link
            href="/settings"
            className="inline-flex shrink-0 items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-dark transition-colors duration-150"
          >
            <Pencil size={14} strokeWidth={1.5} />
            Modifier
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total des cas"
          value={totalCases}
          icon={FolderOpen}
        />
        <StatCard
          label="Cas ce mois-ci"
          value={profile?.cases_this_month ?? 0}
          icon={Clock}
        />
        <StatCard
          label="Membre depuis"
          value={profile?.created_at ? new Date(profile.created_at).getFullYear() : "—"}
          icon={CalendarDays}
        />
      </div>

      {/* Recent cases */}
      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-dark">Cas recents</h2>
          <Link
            href="/cases"
            className="text-xs text-accent hover:underline transition-colors duration-150"
          >
            Voir tout
          </Link>
        </div>
        {recentCases.length === 0 ? (
          <p className="px-6 py-8 text-sm text-text-secondary text-center">
            Aucun cas pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recentCases.map((c) => {
              const status = statusConfig[c.status] || statusConfig.en_cours;
              const StatusIcon = status.icon;
              const date = new Date(c.created_at).toISOString().split("T")[0];
              return (
                <li key={c.id}>
                  <Link
                    href={`/cases/${c.id}`}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-surface transition-colors duration-150"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-medium text-text-dark truncate">
                        {c.chief_complaint}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${status.color}`}
                        >
                          <StatusIcon size={11} strokeWidth={1.5} />
                          {status.label}
                        </span>
                        <span className="text-xs text-text-muted">
                          {c.patients?.age} ans, {c.patients?.sex}
                        </span>
                        <span className="text-xs text-text-muted">{date}</span>
                      </div>
                    </div>
                    <ChevronRight
                      size={15}
                      strokeWidth={1.5}
                      className="shrink-0 text-text-muted ml-3"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
