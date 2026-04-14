"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  User,
  Activity,
  ClipboardList,
  FlaskConical,
  Pill,
} from "lucide-react";

const STEPS = [
  { label: "Patient", icon: User },
  { label: "Symptomes", icon: Activity },
  { label: "Antecedents", icon: ClipboardList },
  { label: "Examens", icon: FlaskConical },
  { label: "Traitements", icon: Pill },
];

const REGIONS = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Sousse",
  "Sfax",
  "Monastir",
  "Autre",
];

const SYMPTOM_SUGGESTIONS = [
  "Douleur",
  "Fievre",
  "Fatigue",
  "Nausees",
  "Cephalees",
  "Toux",
  "Dyspnee",
  "Vertiges",
];

const OUTCOME_OPTIONS = ["Ameliore", "Stable", "Aggrave", "Sans effet"];

interface Symptom {
  name: string;
  severity: string;
  duration: string;
}

interface Antecedent {
  condition: string;
  year: string;
  notes: string;
}

interface Examen {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  date: string;
}

interface Treatment {
  name: string;
  dosage: string;
  duration: string;
  outcome: string;
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150";

const selectClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 appearance-none";

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1 - Patient
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [region, setRegion] = useState("");
  const [motif, setMotif] = useState("");

  // Step 2 - Symptomes
  const [symptoms, setSymptoms] = useState<Symptom[]>([
    { name: "", severity: "1", duration: "" },
  ]);

  // Step 3 - Antecedents
  const [antecedents, setAntecedents] = useState<Antecedent[]>([
    { condition: "", year: "", notes: "" },
  ]);

  // Step 4 - Examens
  const [examens, setExamens] = useState<Examen[]>([
    { testName: "", result: "", unit: "", referenceRange: "", date: "" },
  ]);

  // Step 5 - Traitements
  const [treatments, setTreatments] = useState<Treatment[]>([
    { name: "", dosage: "", duration: "", outcome: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addSymptom() {
    setSymptoms([...symptoms, { name: "", severity: "1", duration: "" }]);
  }

  function removeSymptom(index: number) {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  }

  function updateSymptom(index: number, field: keyof Symptom, value: string) {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], [field]: value };
    setSymptoms(updated);
  }

  function addAntecedent() {
    setAntecedents([...antecedents, { condition: "", year: "", notes: "" }]);
  }

  function removeAntecedent(index: number) {
    setAntecedents(antecedents.filter((_, i) => i !== index));
  }

  function updateAntecedent(index: number, field: keyof Antecedent, value: string) {
    const updated = [...antecedents];
    updated[index] = { ...updated[index], [field]: value };
    setAntecedents(updated);
  }

  function addExamen() {
    setExamens([
      ...examens,
      { testName: "", result: "", unit: "", referenceRange: "", date: "" },
    ]);
  }

  function removeExamen(index: number) {
    setExamens(examens.filter((_, i) => i !== index));
  }

  function updateExamen(index: number, field: keyof Examen, value: string) {
    const updated = [...examens];
    updated[index] = { ...updated[index], [field]: value };
    setExamens(updated);
  }

  function addTreatment() {
    setTreatments([
      ...treatments,
      { name: "", dosage: "", duration: "", outcome: "" },
    ]);
  }

  function removeTreatment(index: number) {
    setTreatments(treatments.filter((_, i) => i !== index));
  }

  function updateTreatment(index: number, field: keyof Treatment, value: string) {
    const updated = [...treatments];
    updated[index] = { ...updated[index], [field]: value };
    setTreatments(updated);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    const payload = {
      age,
      sex,
      region,
      chief_complaint: motif,
      symptoms: symptoms.filter((s) => s.name.trim()),
      history: antecedents.filter((a) => a.condition.trim()),
      tests: examens.filter((e) => e.testName.trim()),
      treatments: treatments.filter((t) => t.name.trim()),
    };

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de la creation du cas");
        setSubmitting(false);
        return;
      }

      const { id } = await res.json();
      router.push(`/cases/${id}`);
    } catch {
      setError("Erreur de connexion");
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-dark">Nouveau Cas</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Renseignez les informations du patient
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-150 ${
                  i === step
                    ? "text-accent"
                    : i < step
                      ? "text-success"
                      : "text-text-muted"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-error/5 border border-error/20 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-lg border border-border shadow-sm p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-dark">
              Informations patient
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-text-dark mb-1.5">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min={0}
                  max={150}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: 45"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-text-dark mb-1.5">
                  Sexe
                </label>
                <select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled>
                    Choisir
                  </option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-text-dark mb-1.5">
                Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Choisir une region
                </option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-text-dark mb-1.5">
                Motif principal
              </label>
              <input
                id="motif"
                type="text"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className={inputClass}
                placeholder="Ex: Douleur thoracique recurrente"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-dark">Symptomes</h2>
              <button
                onClick={addSymptom}
                className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors duration-150"
              >
                <Plus size={14} strokeWidth={1.5} />
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {SYMPTOM_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const emptyIdx = symptoms.findIndex((sym) => !sym.name);
                    if (emptyIdx >= 0) {
                      updateSymptom(emptyIdx, "name", s);
                    } else {
                      setSymptoms([
                        ...symptoms,
                        { name: s, severity: "1", duration: "" },
                      ]);
                    }
                  }}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-text-secondary hover:bg-surface hover:text-text-dark transition-colors duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {symptoms.map((sym, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Symptome
                      </label>
                      <input
                        type="text"
                        value={sym.name}
                        onChange={(e) => updateSymptom(i, "name", e.target.value)}
                        className={inputClass}
                        placeholder="Nom"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Severite (1-5)
                      </label>
                      <select
                        value={sym.severity}
                        onChange={(e) =>
                          updateSymptom(i, "severity", e.target.value)
                        }
                        className={selectClass}
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Duree
                      </label>
                      <input
                        type="text"
                        value={sym.duration}
                        onChange={(e) =>
                          updateSymptom(i, "duration", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: 2 semaines"
                      />
                    </div>
                  </div>
                  {symptoms.length > 1 && (
                    <button
                      onClick={() => removeSymptom(i)}
                      className="mt-5 p-1 rounded text-text-muted hover:text-error transition-colors duration-150"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-dark">
                Antecedents medicaux
              </h2>
              <button
                onClick={addAntecedent}
                className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors duration-150"
              >
                <Plus size={14} strokeWidth={1.5} />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {antecedents.map((ant, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Condition
                      </label>
                      <input
                        type="text"
                        value={ant.condition}
                        onChange={(e) =>
                          updateAntecedent(i, "condition", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: Diabete type 2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Annee
                      </label>
                      <input
                        type="text"
                        value={ant.year}
                        onChange={(e) =>
                          updateAntecedent(i, "year", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: 2018"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={ant.notes}
                        onChange={(e) =>
                          updateAntecedent(i, "notes", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Notes"
                      />
                    </div>
                  </div>
                  {antecedents.length > 1 && (
                    <button
                      onClick={() => removeAntecedent(i)}
                      className="mt-5 p-1 rounded text-text-muted hover:text-error transition-colors duration-150"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-dark">
                Examens complementaires
              </h2>
              <button
                onClick={addExamen}
                className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors duration-150"
              >
                <Plus size={14} strokeWidth={1.5} />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {examens.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Examen
                        </label>
                        <input
                          type="text"
                          value={ex.testName}
                          onChange={(e) =>
                            updateExamen(i, "testName", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Ex: Glycemie a jeun"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Resultat
                        </label>
                        <input
                          type="text"
                          value={ex.result}
                          onChange={(e) =>
                            updateExamen(i, "result", e.target.value)
                          }
                          className={inputClass}
                          placeholder="Ex: 1.26"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Unite
                        </label>
                        <input
                          type="text"
                          value={ex.unit}
                          onChange={(e) =>
                            updateExamen(i, "unit", e.target.value)
                          }
                          className={inputClass}
                          placeholder="g/L"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Ref.
                        </label>
                        <input
                          type="text"
                          value={ex.referenceRange}
                          onChange={(e) =>
                            updateExamen(i, "referenceRange", e.target.value)
                          }
                          className={inputClass}
                          placeholder="0.7-1.1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={ex.date}
                          onChange={(e) =>
                            updateExamen(i, "date", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                  {examens.length > 1 && (
                    <button
                      onClick={() => removeExamen(i)}
                      className="mt-5 p-1 rounded text-text-muted hover:text-error transition-colors duration-150"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-dark">
                Traitements essayes
              </h2>
              <button
                onClick={addTreatment}
                className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors duration-150"
              >
                <Plus size={14} strokeWidth={1.5} />
                Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {treatments.map((tr, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Traitement
                      </label>
                      <input
                        type="text"
                        value={tr.name}
                        onChange={(e) =>
                          updateTreatment(i, "name", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: Paracetamol"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Posologie
                      </label>
                      <input
                        type="text"
                        value={tr.dosage}
                        onChange={(e) =>
                          updateTreatment(i, "dosage", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: 1g x3/jour"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Duree
                      </label>
                      <input
                        type="text"
                        value={tr.duration}
                        onChange={(e) =>
                          updateTreatment(i, "duration", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Ex: 2 semaines"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Resultat
                      </label>
                      <select
                        value={tr.outcome}
                        onChange={(e) =>
                          updateTreatment(i, "outcome", e.target.value)
                        }
                        className={selectClass}
                      >
                        <option value="" disabled>
                          Choisir
                        </option>
                        {OUTCOME_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {treatments.length > 1 && (
                    <button
                      onClick={() => removeTreatment(i)}
                      className="mt-5 p-1 rounded text-text-muted hover:text-error transition-colors duration-150"
                    >
                      <X size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-text-dark hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          Retour
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors duration-150"
          >
            Continuer
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors duration-150"
          >
            {submitting ? "Envoi..." : "Soumettre le cas"}
          </button>
        )}
      </div>
    </div>
  );
}
