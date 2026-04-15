"use client";

import { useState, useEffect } from "react";
import { User, Lock, CreditCard, Bell, Loader2, Check, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

interface DoctorProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialty: string;
  license_number: string | null;
  subscription_status: "free" | "active" | "cancelled";
  cases_this_month: number;
}

type MessageState = { type: "success" | "error"; text: string } | null;

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150";

const inputDisabledClass =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted cursor-not-allowed";

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Icon size={16} strokeWidth={1.5} className="text-text-secondary" />
        <h2 className="text-sm font-semibold text-text-dark">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StatusMessage({ message }: { message: MessageState }) {
  if (!message) return null;
  const isSuccess = message.type === "success";
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isSuccess ? "text-success" : "text-error"
      }`}
    >
      {isSuccess ? (
        <Check size={14} strokeWidth={2} />
      ) : (
        <AlertCircle size={14} strokeWidth={2} />
      )}
      {message.text}
    </div>
  );
}

function SaveButton({
  loading,
  label = "Enregistrer",
}: {
  loading: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 size={14} strokeWidth={2} className="animate-spin" />
      ) : (
        <Check size={14} strokeWidth={2} />
      )}
      {label}
    </button>
  );
}

const planLabels: Record<string, string> = {
  free: "Gratuit",
  active: "Premium",
  cancelled: "Annule",
};

const planColors: Record<string, string> = {
  free: "bg-surface text-text-secondary border border-border",
  active: "bg-accent/10 text-accent border border-accent/20",
  cancelled: "bg-error/10 text-error border border-error/20",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Informations personnelles
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<MessageState>(null);

  // Securite
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<MessageState>(null);

  // Notifications
  const [emailCases, setEmailCases] = useState(true);
  const [emailSuggestions, setEmailSuggestions] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProfile(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setSpecialty(data.specialty || "");
          setLicenseNumber(data.license_number || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          specialty,
          license_number: licenseNumber,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfileMessage({ type: "success", text: "Profil mis a jour." });
      } else {
        setProfileMessage({ type: "error", text: "Erreur lors de la sauvegarde." });
      }
    } catch {
      setProfileMessage({ type: "error", text: "Erreur reseau." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Veuillez saisir votre mot de passe actuel." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Le nouveau mot de passe doit comporter au moins 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMessage({ type: "error", text: error.message });
      } else {
        setPasswordMessage({ type: "success", text: "Mot de passe modifie avec succes." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMessage({ type: "error", text: "Erreur reseau." });
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} strokeWidth={1.5} className="animate-spin text-text-muted" />
      </div>
    );
  }

  const plan = profile?.subscription_status || "free";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">Parametres</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gerez votre compte et vos preferences.
        </p>
      </div>

      {/* Informations personnelles */}
      <SectionCard title="Informations personnelles" icon={User}>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Prenom
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prenom"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Nom
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className={inputDisabledClass}
            />
            <p className="mt-1 text-xs text-text-muted">
              L&apos;adresse email ne peut pas etre modifiee ici.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Specialite
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Ex: Medecine generale"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Numero de licence
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Ex: TN-12345"
              className={inputClass}
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <StatusMessage message={profileMessage} />
            <SaveButton loading={savingProfile} />
          </div>
        </form>
      </SectionCard>

      {/* Securite */}
      <SectionCard title="Securite" icon={Lock}>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <StatusMessage message={passwordMessage} />
            <SaveButton loading={savingPassword} label="Modifier le mot de passe" />
          </div>
        </form>
      </SectionCard>

      {/* Abonnement */}
      <SectionCard title="Abonnement" icon={CreditCard}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-dark">Plan actuel</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Votre abonnement en cours.
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${planColors[plan]}`}
            >
              {planLabels[plan] || plan}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-dark">Cas ce mois-ci</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Nombre de cas crees ce mois.
              </p>
            </div>
            <span className="text-sm font-semibold text-text-dark">
              {profile?.cases_this_month ?? 0}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" icon={Bell}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-dark">
                Notifications par email — nouveaux cas
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Recevoir un email lors de la creation d&apos;un nouveau cas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailCases(!emailCases)}
              aria-checked={emailCases}
              role="switch"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                emailCases ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-150 ${
                  emailCases ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-dark">
                Notifications par email — suggestions IA
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Recevoir un email lorsque l&apos;IA genere de nouvelles suggestions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailSuggestions(!emailSuggestions)}
              aria-checked={emailSuggestions}
              role="switch"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
                emailSuggestions ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-150 ${
                  emailSuggestions ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
