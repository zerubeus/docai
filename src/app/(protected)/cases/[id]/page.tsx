"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Send,
  User,
  Activity,
  ClipboardList,
  FlaskConical,
  Pill,
} from "lucide-react";

// Mock patient data
const patient = {
  age: 45,
  sex: "M",
  region: "Tunis",
  motif: "Douleur thoracique recurrente",
  symptoms: [
    { name: "Douleur thoracique", severity: 4, duration: "3 semaines" },
    { name: "Dyspnee d'effort", severity: 3, duration: "2 semaines" },
    { name: "Fatigue", severity: 2, duration: "1 mois" },
  ],
  antecedents: [
    { condition: "Hypertension arterielle", year: "2019", notes: "Sous traitement" },
    { condition: "Diabete type 2", year: "2021", notes: "HbA1c 7.2%" },
  ],
  examens: [
    { testName: "Troponine I", result: "0.04", unit: "ng/mL", referenceRange: "<0.04", date: "2026-04-12" },
    { testName: "BNP", result: "320", unit: "pg/mL", referenceRange: "<100", date: "2026-04-12" },
    { testName: "Glycemie a jeun", result: "1.42", unit: "g/L", referenceRange: "0.7-1.1", date: "2026-04-12" },
    { testName: "Cholesterol total", result: "2.65", unit: "g/L", referenceRange: "<2.0", date: "2026-04-12" },
  ],
  treatments: [
    { name: "Amlodipine", dosage: "5mg/jour", duration: "6 mois", outcome: "Ameliore" },
    { name: "Metformine", dosage: "500mg x2/jour", duration: "1 an", outcome: "Stable" },
  ],
};

// Mock AI analysis data
const analysis = {
  diagnostics: [
    {
      name: "Syndrome coronarien chronique",
      confidence: 82,
      source: "ESC Guidelines 2024 — Chronic Coronary Syndromes",
    },
    {
      name: "Insuffisance cardiaque a fraction d'ejection preservee",
      confidence: 68,
      source: "AHA/ACC Heart Failure Guidelines 2023",
    },
    {
      name: "Cardiomyopathie diabetique",
      confidence: 45,
      source: "Diabetes Care 2024 — Cardiovascular Complications",
    },
    {
      name: "Angine microvasculaire",
      confidence: 30,
      source: "JACC Cardiovascular Imaging 2023",
    },
  ],
  pointsExplorer: [
    "Le BNP eleve (320 pg/mL) associe a la dyspnee d'effort suggere une dysfonction diastolique a evaluer par echocardiographie.",
    "La troponine a la limite superieure de la normale necessite un dosage serie pour exclure une necrose myocardique en cours.",
    "L'association HTA + diabete + dyslipidemia represente un risque cardiovasculaire eleve selon le score SCORE2-Diabetes.",
  ],
  examensRecommandes: [
    { name: "Echocardiographie transthoracique", rationale: "Evaluation de la fonction systolique et diastolique, estimation des pressions de remplissage" },
    { name: "Epreuve d'effort ou scintigraphie myocardique", rationale: "Recherche d'ischemie myocardique inductible" },
    { name: "Holter ECG 24h", rationale: "Detection de troubles du rythme associes" },
    { name: "HbA1c + bilan lipidique complet", rationale: "Reevaluation du controle metabolique" },
    { name: "Coronarographie", rationale: "A envisager si tests non invasifs positifs pour ischemie" },
  ],
};

export default function AnalysisPage() {
  const [feedback, setFeedback] = useState<Record<number, "utile" | "non_pertinent">>({});
  const [comment, setComment] = useState("");

  function toggleFeedback(index: number, value: "utile" | "non_pertinent") {
    setFeedback((prev) => {
      if (prev[index] === value) {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      }
      return { ...prev, [index]: value };
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT PANEL — Patient summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Patient info */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">Patient</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-text-muted text-xs">Age</p>
                <p className="font-medium text-text-dark">{patient.age} ans</p>
              </div>
              <div>
                <p className="text-text-muted text-xs">Sexe</p>
                <p className="font-medium text-text-dark">{patient.sex}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs">Region</p>
                <p className="font-medium text-text-dark">{patient.region}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-text-muted text-xs">Motif principal</p>
              <p className="text-sm font-medium text-text-dark mt-0.5">
                {patient.motif}
              </p>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">Symptomes</h2>
            </div>
            <div className="space-y-2">
              {patient.symptoms.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-dark">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <div
                            key={v}
                            className={`w-1.5 h-4 rounded-sm ${
                              v <= s.severity ? "bg-accent" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted w-20 text-right">
                      {s.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Antecedents */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">
                Antecedents
              </h2>
            </div>
            <div className="space-y-3">
              {patient.antecedents.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      {a.condition}
                      <span className="ml-2 text-xs text-text-muted font-normal">
                        ({a.year})
                      </span>
                    </p>
                    {a.notes && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {a.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examens */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FlaskConical size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">Examens</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 text-xs font-medium text-text-muted">
                    Examen
                  </th>
                  <th className="text-right py-1.5 text-xs font-medium text-text-muted">
                    Resultat
                  </th>
                  <th className="text-right py-1.5 text-xs font-medium text-text-muted">
                    Ref.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patient.examens.map((e, i) => (
                  <tr key={i}>
                    <td className="py-1.5 text-text-dark">{e.testName}</td>
                    <td className="py-1.5 text-right font-medium text-text-dark">
                      {e.result}{" "}
                      <span className="text-text-muted font-normal">
                        {e.unit}
                      </span>
                    </td>
                    <td className="py-1.5 text-right text-text-muted text-xs">
                      {e.referenceRange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Treatments */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Pill size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">
                Traitements
              </h2>
            </div>
            <div className="space-y-2">
              {patient.treatments.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium text-text-dark">{t.name}</span>
                    <span className="text-text-muted ml-2">{t.dosage}</span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      t.outcome === "Ameliore"
                        ? "text-success"
                        : t.outcome === "Aggrave"
                          ? "text-error"
                          : "text-text-secondary"
                    }`}
                  >
                    {t.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — AI Analysis */}
        <div className="lg:col-span-3 space-y-4">
          {/* Diagnostics differentiels */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <h2 className="text-sm font-semibold text-text-dark mb-4">
              Diagnostics differentiels
            </h2>
            <div className="space-y-4">
              {analysis.diagnostics.map((d, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-text-dark">
                      {i + 1}. {d.name}
                    </p>
                    <span className="text-xs font-medium text-text-secondary shrink-0">
                      {d.confidence}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-300"
                      style={{ width: `${d.confidence}%` }}
                    />
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                    <ExternalLink size={10} strokeWidth={1.5} />
                    {d.source}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Points a explorer */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <h2 className="text-sm font-semibold text-text-dark mb-4">
              Points a explorer
            </h2>
            <div className="space-y-3">
              {analysis.pointsExplorer.map((point, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border border-l-4 border-l-warning bg-warning/5 p-3"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={14}
                      strokeWidth={1.5}
                      className="text-warning shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-text-dark">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examens recommandes */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <h2 className="text-sm font-semibold text-text-dark mb-4">
              Examens recommandes
            </h2>
            <div className="space-y-2">
              {analysis.examensRecommandes.map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 py-2 border-b border-border last:border-0"
                >
                  <ChevronRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      {e.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {e.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <h2 className="text-sm font-semibold text-text-dark mb-4">
              Votre avis
            </h2>
            <div className="space-y-3">
              {analysis.diagnostics.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <p className="text-sm text-text-dark">{d.name}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeedback(i, "utile")}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors duration-150 ${
                        feedback[i] === "utile"
                          ? "bg-success/10 border-success/30 text-success"
                          : "border-border text-text-secondary hover:bg-surface"
                      }`}
                    >
                      <ThumbsUp size={12} strokeWidth={1.5} />
                      Utile
                    </button>
                    <button
                      onClick={() => toggleFeedback(i, "non_pertinent")}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors duration-150 ${
                        feedback[i] === "non_pertinent"
                          ? "bg-error/10 border-error/30 text-error"
                          : "border-border text-text-secondary hover:bg-surface"
                      }`}
                    >
                      <ThumbsDown size={12} strokeWidth={1.5} />
                      Non pertinent
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-3">
                <label
                  htmlFor="comment"
                  className="block text-xs font-medium text-text-secondary mb-1.5"
                >
                  Commentaire
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 resize-none"
                  placeholder="Ajoutez un commentaire..."
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors duration-150">
                <Send size={14} strokeWidth={1.5} />
                Envoyer le feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
