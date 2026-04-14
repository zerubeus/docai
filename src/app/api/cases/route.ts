import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!doctor)
    return NextResponse.json(
      { error: "Profil medecin introuvable" },
      { status: 404 }
    );

  const body = await request.json();
  const { age, sex, region, chief_complaint, symptoms, history, tests, treatments } =
    body;

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert({ doctor_id: doctor.id, age: parseInt(age), sex, region })
    .select("id")
    .single();
  if (patientError || !patient)
    return NextResponse.json(
      { error: patientError?.message || "Erreur patient" },
      { status: 500 }
    );

  const { data: caseRecord, error: caseError } = await supabase
    .from("cases")
    .insert({
      doctor_id: doctor.id,
      patient_id: patient.id,
      chief_complaint,
    })
    .select("id")
    .single();
  if (caseError || !caseRecord)
    return NextResponse.json(
      { error: caseError?.message || "Erreur cas" },
      { status: 500 }
    );

  const caseId = caseRecord.id;

  const validSymptoms = (symptoms || []).filter(
    (s: { name: string }) => s.name?.trim()
  );
  const validHistory = (history || []).filter(
    (h: { condition: string }) => h.condition?.trim()
  );
  const validTests = (tests || []).filter(
    (t: { testName: string }) => t.testName?.trim()
  );
  const validTreatments = (treatments || []).filter(
    (t: { name: string }) => t.name?.trim()
  );

  const inserts = [];

  if (validSymptoms.length) {
    inserts.push(
      supabase.from("case_symptoms").insert(
        validSymptoms.map((s: { name: string; severity: string; duration: string }) => ({
          case_id: caseId,
          symptom: s.name,
          severity: parseInt(s.severity) || null,
          duration: s.duration || null,
        }))
      )
    );
  }

  if (validHistory.length) {
    inserts.push(
      supabase.from("case_history").insert(
        validHistory.map((h: { condition: string; year: string; notes: string }) => ({
          case_id: caseId,
          condition_name: h.condition,
          year_diagnosed: h.year ? parseInt(h.year) : null,
          notes: h.notes || null,
        }))
      )
    );
  }

  if (validTests.length) {
    inserts.push(
      supabase.from("case_tests").insert(
        validTests.map((t: { testName: string; result: string; unit: string; referenceRange: string; date: string }) => ({
          case_id: caseId,
          test_name: t.testName,
          result_value: t.result || null,
          unit: t.unit || null,
          reference_range: t.referenceRange || null,
          test_date: t.date || null,
        }))
      )
    );
  }

  if (validTreatments.length) {
    inserts.push(
      supabase.from("case_treatments").insert(
        validTreatments.map((t: { name: string; dosage: string; duration: string; outcome: string }) => ({
          case_id: caseId,
          treatment_name: t.name,
          dosage: t.dosage || null,
          duration: t.duration || null,
          outcome: t.outcome
            ? t.outcome.toLowerCase().replace(/ /g, "_")
            : null,
        }))
      )
    );
  }

  await Promise.all(inserts);

  const mockSuggestions = [
    {
      case_id: caseId,
      type: "diagnosis",
      content: "Syndrome coronarien chronique",
      confidence: 0.82,
      sources: [{ title: "ESC Guidelines 2024 — Chronic Coronary Syndromes" }],
      sort_order: 1,
    },
    {
      case_id: caseId,
      type: "diagnosis",
      content: "Insuffisance cardiaque a fraction d'ejection preservee",
      confidence: 0.68,
      sources: [{ title: "AHA/ACC Heart Failure Guidelines 2023" }],
      sort_order: 2,
    },
    {
      case_id: caseId,
      type: "diagnosis",
      content: "Cardiomyopathie metabolique",
      confidence: 0.45,
      sources: [
        { title: "Diabetes Care 2024 — Cardiovascular Complications" },
      ],
      sort_order: 3,
    },
    {
      case_id: caseId,
      type: "blind_spot",
      content:
        "Evaluer la fonction diastolique par echocardiographie en raison des symptomes cardiaques.",
      confidence: null,
      sources: [],
      sort_order: 1,
    },
    {
      case_id: caseId,
      type: "blind_spot",
      content:
        "Rechercher une ischemie silencieuse chez ce patient avec facteurs de risque cardiovasculaire.",
      confidence: null,
      sources: [],
      sort_order: 2,
    },
    {
      case_id: caseId,
      type: "recommended_test",
      content: "Echocardiographie transthoracique",
      confidence: null,
      sources: [],
      sort_order: 1,
    },
    {
      case_id: caseId,
      type: "recommended_test",
      content: "Bilan lipidique complet et HbA1c",
      confidence: null,
      sources: [],
      sort_order: 2,
    },
  ];

  await supabase.from("suggestions").insert(mockSuggestions);

  return NextResponse.json({ id: caseId }, { status: 201 });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!doctor)
    return NextResponse.json(
      { error: "Profil medecin introuvable" },
      { status: 404 }
    );

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  let query = supabase
    .from("cases")
    .select(
      "id, chief_complaint, status, created_at, patients(age, sex, region), suggestions(id)"
    )
    .eq("doctor_id", doctor.id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
