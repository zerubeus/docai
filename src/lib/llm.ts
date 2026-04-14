import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateEmbedding, searchKnowledge } from "./embeddings";

interface CaseData {
  chief_complaint: string;
  age: number;
  sex: string;
  region?: string;
  symptoms: { name: string; severity?: string; duration?: string }[];
  history: { condition: string; year?: string; notes?: string }[];
  tests: {
    testName: string;
    result?: string;
    unit?: string;
    referenceRange?: string;
    date?: string;
  }[];
  treatments: {
    name: string;
    dosage?: string;
    duration?: string;
    outcome?: string;
  }[];
}

interface Diagnosis {
  content: string;
  confidence: number;
  sources: { title: string }[];
}

interface Suggestion {
  content: string;
  sources: { title: string }[];
}

export interface AnalysisResult {
  diagnoses: Diagnosis[];
  blind_spots: Suggestion[];
  recommended_tests: Suggestion[];
}

function buildCaseSummary(caseData: CaseData): string {
  const parts = [
    `Motif de consultation: ${caseData.chief_complaint}`,
    `Patient: ${caseData.age} ans, sexe ${caseData.sex}${caseData.region ? `, region ${caseData.region}` : ""}`,
  ];

  if (caseData.symptoms.length > 0) {
    const symptomsText = caseData.symptoms
      .map(
        (s) =>
          `${s.name}${s.severity ? ` (severite: ${s.severity}/5)` : ""}${s.duration ? ` depuis ${s.duration}` : ""}`
      )
      .join(", ");
    parts.push(`Symptomes: ${symptomsText}`);
  }

  if (caseData.history.length > 0) {
    const historyText = caseData.history
      .map(
        (h) =>
          `${h.condition}${h.year ? ` (${h.year})` : ""}${h.notes ? ` — ${h.notes}` : ""}`
      )
      .join(", ");
    parts.push(`Antecedents: ${historyText}`);
  }

  if (caseData.tests.length > 0) {
    const testsText = caseData.tests
      .map(
        (t) =>
          `${t.testName}: ${t.result || "en attente"}${t.unit ? ` ${t.unit}` : ""}${t.referenceRange ? ` (ref: ${t.referenceRange})` : ""}`
      )
      .join(", ");
    parts.push(`Examens: ${testsText}`);
  }

  if (caseData.treatments.length > 0) {
    const treatmentsText = caseData.treatments
      .map(
        (t) =>
          `${t.name}${t.dosage ? ` ${t.dosage}` : ""}${t.duration ? ` pendant ${t.duration}` : ""}${t.outcome ? ` (resultat: ${t.outcome})` : ""}`
      )
      .join(", ");
    parts.push(`Traitements en cours: ${treatmentsText}`);
  }

  return parts.join("\n");
}

const SYSTEM_PROMPT = `Tu es un systeme d'aide a la decision clinique pour les medecins. Tu analyses les cas cliniques en te basant sur les donnees medicales fournies et les connaissances de la base documentaire.

REGLES STRICTES:
- Ne JAMAIS donner un diagnostic definitif unique. Toujours proposer 3 a 5 diagnostics differentiels.
- Attribuer un score de confiance entre 0 et 1 a chaque diagnostic.
- Identifier 2 a 3 angles morts ou facteurs potentiellement negliges.
- Recommander 2 a 4 examens complementaires pertinents.
- Citer les sources specifiques de la base documentaire utilisees.
- Repondre UNIQUEMENT en francais.

AVERTISSEMENT: Ceci est un outil d'aide a la decision. Il ne remplace en aucun cas le jugement clinique du medecin. Les suggestions doivent etre evaluees dans le contexte clinique complet du patient.

Tu dois repondre STRICTEMENT au format JSON suivant, sans aucun texte avant ou apres:
{
  "diagnoses": [
    {
      "content": "Nom du diagnostic",
      "confidence": 0.85,
      "sources": [{"title": "Titre de la source"}]
    }
  ],
  "blind_spots": [
    {
      "content": "Description du facteur neglige",
      "sources": [{"title": "Titre de la source"}]
    }
  ],
  "recommended_tests": [
    {
      "content": "Nom de l'examen recommande",
      "sources": [{"title": "Titre de la source"}]
    }
  ]
}`;

function extractJson(text: string): string {
  // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return codeBlock[1].trim();
  return text.trim();
}

export async function analyzeCase(caseData: CaseData): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
  });

  const caseSummary = buildCaseSummary(caseData);

  const embedding = await generateEmbedding(caseSummary);
  const chunks = await searchKnowledge(embedding, 12);

  const contextText = chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1}: ${chunk.title} (${chunk.source}, pertinence: ${(chunk.similarity * 100).toFixed(1)}%)]\n${chunk.content}`
    )
    .join("\n\n");

  const prompt = `${SYSTEM_PROMPT}

BASE DOCUMENTAIRE (extraits les plus pertinents):
${contextText}

---

CAS CLINIQUE A ANALYSER:
${caseSummary}

Analyse ce cas clinique en te basant sur la base documentaire ci-dessus. Fournis les diagnostics differentiels, les angles morts et les examens recommandes au format JSON specifie.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from LLM");
  }

  const parsed = JSON.parse(extractJson(text)) as AnalysisResult;

  if (
    !Array.isArray(parsed.diagnoses) ||
    !Array.isArray(parsed.blind_spots) ||
    !Array.isArray(parsed.recommended_tests)
  ) {
    throw new Error("Invalid LLM response structure");
  }

  return parsed;
}
