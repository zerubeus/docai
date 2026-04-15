"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

interface Suggestion {
  id: string;
  type: "diagnosis" | "blind_spot" | "recommended_test";
  content: string;
  confidence: number | null;
  sources: { title?: string }[];
  sort_order: number;
  feedback: { id: string; rating: string }[];
}

interface CaseData {
  id: string;
  chief_complaint: string;
  status: string;
  patients: {
    age: number;
    sex: string;
    region: string;
  };
  case_symptoms: {
    symptom: string;
    severity: number;
    duration: string;
  }[];
  case_history: {
    condition_name: string;
    year_diagnosed: number | null;
    notes: string;
  }[];
  case_tests: {
    test_name: string;
    result_value: string;
    unit: string;
    reference_range: string;
    test_date: string;
  }[];
  case_treatments: {
    treatment_name: string;
    dosage: string;
    duration: string;
    outcome: string;
  }[];
  suggestions: Suggestion[];
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<
    Record<string, "useful" | "not_relevant">
  >({});
  const [comment, setComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const outcomeLabels: Record<string, string> = {
    ameliore: t("caseDetail.outcomeImproved"),
    stable: t("caseDetail.outcomeStable"),
    aggrave: t("caseDetail.outcomeWorse"),
    sans_effet: t("caseDetail.outcomeNoEffect"),
  };

  useEffect(() => {
    fetch(`/api/cases/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) setCaseData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function toggleFeedback(
    suggestionId: string,
    value: "useful" | "not_relevant"
  ) {
    setFeedback((prev) => {
      if (prev[suggestionId] === value) {
        const updated = { ...prev };
        delete updated[suggestionId];
        return updated;
      }
      return { ...prev, [suggestionId]: value };
    });
  }

  async function submitFeedback() {
    const entries = Object.entries(feedback);
    if (entries.length === 0) return;

    setSubmittingFeedback(true);
    await Promise.all(
      entries.map(([suggestion_id, rating]) =>
        fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ suggestion_id, rating, comment }),
        })
      )
    );
    setSubmittingFeedback(false);
    setFeedbackSent(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-text-muted" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-20 text-text-secondary text-sm">
        {t("caseDetail.notFound")}
      </div>
    );
  }

  const diagnoses = (caseData.suggestions || [])
    .filter((s) => s.type === "diagnosis")
    .sort((a, b) => a.sort_order - b.sort_order);
  const blindSpots = (caseData.suggestions || [])
    .filter((s) => s.type === "blind_spot")
    .sort((a, b) => a.sort_order - b.sort_order);
  const recommendedTests = (caseData.suggestions || [])
    .filter((s) => s.type === "recommended_test")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT — Patient summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <User size={16} strokeWidth={1.5} className="text-primary" />
              <h2 className="text-sm font-semibold text-text-dark">{t("caseDetail.patientSection")}</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-text-muted text-xs">{t("caseDetail.age")}</p>
                <p className="font-medium text-text-dark">
                  {caseData.patients?.age} {t("caseDetail.yearsOld")}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs">{t("caseDetail.sex")}</p>
                <p className="font-medium text-text-dark">
                  {caseData.patients?.sex}
                </p>
              </div>
              <div>
                <p className="text-text-muted text-xs">{t("caseDetail.region")}</p>
                <p className="font-medium text-text-dark">
                  {caseData.patients?.region}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-text-muted text-xs">{t("caseDetail.chiefComplaint")}</p>
              <p className="text-sm font-medium text-text-dark mt-0.5">
                {caseData.chief_complaint}
              </p>
            </div>
          </div>

          {caseData.case_symptoms?.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={16} strokeWidth={1.5} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-dark">
                  {t("caseDetail.symptomsSection")}
                </h2>
              </div>
              <div className="space-y-2">
                {caseData.case_symptoms.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-dark">{s.symptom}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <div
                            key={v}
                            className={`w-1.5 h-4 rounded-sm ${
                              v <= (s.severity || 0)
                                ? "bg-accent"
                                : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      {s.duration && (
                        <span className="text-xs text-text-muted w-20 text-end">
                          {s.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {caseData.case_history?.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList size={16} strokeWidth={1.5} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-dark">
                  {t("caseDetail.historySection")}
                </h2>
              </div>
              <div className="space-y-3">
                {caseData.case_history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-dark">
                        {h.condition_name}
                        {h.year_diagnosed && (
                          <span className="ms-2 text-xs text-text-muted font-normal">
                            ({h.year_diagnosed})
                          </span>
                        )}
                      </p>
                      {h.notes && (
                        <p className="text-xs text-text-secondary mt-0.5">
                          {h.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {caseData.case_tests?.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={16} strokeWidth={1.5} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-dark">
                  {t("caseDetail.examsSection")}
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start py-1.5 text-xs font-medium text-text-muted">
                      {t("caseDetail.examCol")}
                    </th>
                    <th className="text-end py-1.5 text-xs font-medium text-text-muted">
                      {t("caseDetail.resultCol")}
                    </th>
                    <th className="text-end py-1.5 text-xs font-medium text-text-muted">
                      {t("caseDetail.refCol")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {caseData.case_tests.map((t_item, i) => (
                    <tr key={i}>
                      <td className="py-1.5 text-text-dark">{t_item.test_name}</td>
                      <td className="py-1.5 text-end font-medium text-text-dark">
                        {t_item.result_value}{" "}
                        <span className="text-text-muted font-normal">
                          {t_item.unit}
                        </span>
                      </td>
                      <td className="py-1.5 text-end text-text-muted text-xs">
                        {t_item.reference_range}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {caseData.case_treatments?.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Pill size={16} strokeWidth={1.5} className="text-primary" />
                <h2 className="text-sm font-semibold text-text-dark">
                  {t("caseDetail.treatmentsSection")}
                </h2>
              </div>
              <div className="space-y-2">
                {caseData.case_treatments.map((tr, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <span className="font-medium text-text-dark">
                        {tr.treatment_name}
                      </span>
                      {tr.dosage && (
                        <span className="text-text-muted ms-2">
                          {tr.dosage}
                        </span>
                      )}
                    </div>
                    {tr.outcome && (
                      <span
                        className={`text-xs font-medium ${
                          tr.outcome === "ameliore"
                            ? "text-success"
                            : tr.outcome === "aggrave"
                              ? "text-error"
                              : "text-text-secondary"
                        }`}
                      >
                        {outcomeLabels[tr.outcome] || tr.outcome}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — AI Analysis */}
        <div className="lg:col-span-3 space-y-4">
          {diagnoses.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <h2 className="text-sm font-semibold text-text-dark mb-4">
                {t("caseDetail.diagnosesSection")}
              </h2>
              <div className="space-y-4">
                {diagnoses.map((d, i) => {
                  const pct =
                    d.confidence != null
                      ? Math.round(d.confidence * 100)
                      : null;
                  const source = d.sources?.[0]?.title;
                  return (
                    <div key={d.id}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-dark">
                          {i + 1}. {d.content}
                        </p>
                        {pct != null && (
                          <span className="text-xs font-medium text-text-secondary shrink-0">
                            {pct}%
                          </span>
                        )}
                      </div>
                      {pct != null && (
                        <div className="mt-1.5 h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                      {source && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                          <ExternalLink size={10} strokeWidth={1.5} />
                          {source}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {blindSpots.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <h2 className="text-sm font-semibold text-text-dark mb-4">
                {t("caseDetail.blindSpotsSection")}
              </h2>
              <div className="space-y-3">
                {blindSpots.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-lg border border-border border-l-4 border-l-warning bg-warning/5 p-3"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        size={14}
                        strokeWidth={1.5}
                        className="text-warning shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-text-dark">{s.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendedTests.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <h2 className="text-sm font-semibold text-text-dark mb-4">
                {t("caseDetail.recommendedTestsSection")}
              </h2>
              <div className="space-y-2">
                {recommendedTests.map((rt) => (
                  <div
                    key={rt.id}
                    className="flex items-start gap-2 py-2 border-b border-border last:border-0"
                  >
                    <ChevronRight
                      size={14}
                      strokeWidth={1.5}
                      className="text-accent shrink-0 mt-0.5 rtl:rotate-180"
                    />
                    <p className="text-sm font-medium text-text-dark">
                      {rt.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {diagnoses.length > 0 && (
            <div className="bg-white rounded-lg border border-border shadow-sm p-5">
              <h2 className="text-sm font-semibold text-text-dark mb-4">
                {t("caseDetail.feedbackSection")}
              </h2>
              {feedbackSent ? (
                <p className="text-sm text-success">
                  {t("caseDetail.feedbackSent")}
                </p>
              ) : (
                <div className="space-y-3">
                  {diagnoses.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <p className="text-sm text-text-dark">{d.content}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeedback(d.id, "useful")}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors duration-150 ${
                            feedback[d.id] === "useful"
                              ? "bg-success/10 border-success/30 text-success"
                              : "border-border text-text-secondary hover:bg-surface"
                          }`}
                        >
                          <ThumbsUp size={12} strokeWidth={1.5} />
                          {t("caseDetail.useful")}
                        </button>
                        <button
                          onClick={() =>
                            toggleFeedback(d.id, "not_relevant")
                          }
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors duration-150 ${
                            feedback[d.id] === "not_relevant"
                              ? "bg-error/10 border-error/30 text-error"
                              : "border-border text-text-secondary hover:bg-surface"
                          }`}
                        >
                          <ThumbsDown size={12} strokeWidth={1.5} />
                          {t("caseDetail.notRelevant")}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3">
                    <label
                      htmlFor="comment"
                      className="block text-xs font-medium text-text-secondary mb-1.5"
                    >
                      {t("caseDetail.comment")}
                    </label>
                    <textarea
                      id="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-150 resize-none"
                      placeholder={t("caseDetail.commentPlaceholder")}
                    />
                  </div>
                  <button
                    onClick={submitFeedback}
                    disabled={
                      submittingFeedback ||
                      Object.keys(feedback).length === 0
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors duration-150"
                  >
                    <Send size={14} strokeWidth={1.5} />
                    {submittingFeedback
                      ? t("caseDetail.submitting")
                      : t("caseDetail.submitFeedback")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
