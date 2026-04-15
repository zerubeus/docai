import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { KnowledgeEntry } from "./data/has-guidelines";
import { getHASGuidelines } from "./data/has-guidelines";
import { getOrphanetDiseases } from "./data/orphanet-diseases";
import { getICD10Codes } from "./data/icd10-codes";
import { getDrugInteractions } from "./data/drug-interactions";
import { getEmergencyProtocols } from "./data/emergency-protocols";
import { getTunisiaEpidemiology } from "./data/tunisia-epidemiology";

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 3072;
const VECTOR_DB_DIMENSIONS = 1536;
const EMBEDDING_BATCH_SIZE = 50;
const DB_BATCH_SIZE = 50;
const MAX_CHUNK_SIZE = 1000;
const MIN_CHUNK_SIZE = 200;

interface ChunkedEntry extends KnowledgeEntry {
  embedding?: number[];
}

function loadEnv(): { supabaseUrl: string; supabaseKey: string } {
  const envPath = resolve(__dirname, "../.env.local");
  const envContent = readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) vars[match[1].trim()] = match[2].trim();
  }
  return {
    supabaseUrl: vars["NEXT_PUBLIC_SUPABASE_URL"],
    supabaseKey: vars["SUPABASE_SERVICE_ROLE_KEY"],
  };
}

function getGoogleAIKey(): string {
  console.log("Fetching Google AI API key from 1Password...");
  const key = execSync(
    "op item get y7p3hzfhdxfgtzrqpbhlebzvo4 --vault openclaw --fields credential --reveal",
    { encoding: "utf-8" }
  ).trim();
  if (!key) throw new Error("Failed to get Google AI API key from 1Password");
  console.log("   Key retrieved successfully.");
  return key;
}

function chunkText(text: string, maxSize: number = MAX_CHUNK_SIZE): string[] {
  if (text.length <= maxSize) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n{2,}/);

  let current = "";
  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxSize && current.length >= MIN_CHUNK_SIZE) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }

  if (current.length > maxSize) {
    const sentences = current.split(/(?<=[.!?])\s+/);
    let sentChunk = "";
    for (const sent of sentences) {
      if (sentChunk.length + sent.length + 1 > maxSize && sentChunk.length >= MIN_CHUNK_SIZE) {
        chunks.push(sentChunk.trim());
        sentChunk = sent;
      } else {
        sentChunk += (sentChunk ? " " : "") + sent;
      }
    }
    if (sentChunk.trim()) chunks.push(sentChunk.trim());
  } else if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

function chunkEntries(entries: KnowledgeEntry[]): ChunkedEntry[] {
  const chunked: ChunkedEntry[] = [];
  for (const entry of entries) {
    const textChunks = chunkText(entry.content);
    if (textChunks.length === 1) {
      chunked.push({ ...entry });
    } else {
      for (let i = 0; i < textChunks.length; i++) {
        chunked.push({
          ...entry,
          title: `${entry.title} (${i + 1}/${textChunks.length})`,
          content: textChunks[i],
          metadata: { ...entry.metadata, chunkIndex: i, totalChunks: textChunks.length },
        });
      }
    }
  }
  return chunked;
}

async function generateEmbeddings(
  apiKey: string,
  chunks: ChunkedEntry[]
): Promise<ChunkedEntry[]> {
  console.log(`\nGenerating embeddings for ${chunks.length} chunks (model: ${EMBEDDING_MODEL})...`);

  const baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);

    const requests = batch.map((c) => ({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: `${c.title}\n${c.content}` }] },
      taskType: "RETRIEVAL_DOCUMENT",
    }));

    const response = await fetch(
      `${baseUrl}/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Embedding API error (${response.status}): ${errText}`);
    }

    const data = await response.json();

    for (let j = 0; j < data.embeddings.length; j++) {
      batch[j].embedding = padEmbedding(data.embeddings[j].values, VECTOR_DB_DIMENSIONS);
    }

    const progress = Math.min(i + EMBEDDING_BATCH_SIZE, chunks.length);
    process.stdout.write(`   Progress: ${progress}/${chunks.length} chunks embedded\r`);

    if (i + EMBEDDING_BATCH_SIZE < chunks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const sampleDim = chunks[0]?.embedding?.length ?? 0;
  console.log(`\n   Embedding dimensions: ${sampleDim} (padded from ${EMBEDDING_DIMENSIONS})`);

  return chunks;
}

function padEmbedding(embedding: number[], targetDim: number): number[] {
  if (embedding.length >= targetDim) return embedding.slice(0, targetDim);
  const padded = new Array(targetDim).fill(0);
  for (let i = 0; i < embedding.length; i++) padded[i] = embedding[i];
  return padded;
}

async function insertChunks(
  supabase: ReturnType<typeof createClient>,
  chunks: ChunkedEntry[]
): Promise<void> {
  console.log(`\nInserting ${chunks.length} chunks into knowledge_chunks...`);

  const { count: existingCount } = await supabase
    .from("knowledge_chunks")
    .select("*", { count: "exact", head: true });

  if (existingCount && existingCount > 0) {
    console.log(`   Found ${existingCount} existing chunks. Clearing table...`);
    await supabase.from("knowledge_chunks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    console.log("   Table cleared.");
  }

  let inserted = 0;
  for (let i = 0; i < chunks.length; i += DB_BATCH_SIZE) {
    const batch = chunks.slice(i, i + DB_BATCH_SIZE);
    const rows = batch.map((c) => ({
      source: c.source,
      title: c.title,
      content: c.content,
      embedding: JSON.stringify(c.embedding),
      metadata: c.metadata,
    }));

    const { error } = await supabase.from("knowledge_chunks").insert(rows);
    if (error) {
      console.error(`\n   Error inserting batch ${i / DB_BATCH_SIZE + 1}:`, error.message);
      throw error;
    }

    inserted += batch.length;
    process.stdout.write(`   Inserted: ${inserted}/${chunks.length}\r`);
  }

  console.log(`\n   All ${inserted} chunks inserted successfully.`);
}

function printStats(chunks: ChunkedEntry[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("SEEDING STATISTICS");
  console.log("=".repeat(60));

  const bySource: Record<string, number> = {};
  const bySourceChars: Record<string, number> = {};
  for (const c of chunks) {
    bySource[c.source] = (bySource[c.source] || 0) + 1;
    bySourceChars[c.source] = (bySourceChars[c.source] || 0) + c.content.length;
  }

  console.log(`\nTotal chunks: ${chunks.length}`);
  console.log(`Total characters: ${chunks.reduce((a, c) => a + c.content.length, 0).toLocaleString()}`);
  console.log(`\nBreakdown by source:`);
  for (const [source, count] of Object.entries(bySource)) {
    const chars = bySourceChars[source];
    const avgLen = Math.round(chars / count);
    console.log(`  ${source}: ${count} chunks (avg ${avgLen} chars/chunk)`);
  }

  const specialties = new Set(chunks.map((c) => (c.metadata as any)?.specialty).filter(Boolean));
  console.log(`\nMedical specialties covered: ${specialties.size}`);
  for (const s of Array.from(specialties).sort()) {
    console.log(`  - ${s}`);
  }

  console.log(`\nEmbedding model: ${EMBEDDING_MODEL} (${EMBEDDING_DIMENSIONS} dimensions)`);
  console.log("=".repeat(60));
}

async function main() {
  console.log("DocAI Knowledge Base Seeding Script");
  console.log("=".repeat(60));

  const { supabaseUrl, supabaseKey } = loadEnv();
  const googleKey = getGoogleAIKey();

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("\nLoading medical knowledge data...");

  const hasEntries = getHASGuidelines();
  console.log(`   HAS France guidelines: ${hasEntries.length} entries`);

  const orphanetEntries = getOrphanetDiseases();
  console.log(`   Orphanet rare diseases: ${orphanetEntries.length} entries`);

  const icd10Entries = getICD10Codes();
  console.log(`   CIM-10/ICD-10 codes: ${icd10Entries.length} entries`);

  const drugEntries = getDrugInteractions();
  console.log(`   Drug interactions: ${drugEntries.length} entries`);

  const emergencyEntries = getEmergencyProtocols();
  console.log(`   Emergency protocols: ${emergencyEntries.length} entries`);

  const epidemiologyEntries = getTunisiaEpidemiology();
  console.log(`   Tunisia epidemiology: ${epidemiologyEntries.length} entries`);

  const allEntries = [...hasEntries, ...orphanetEntries, ...icd10Entries, ...drugEntries, ...emergencyEntries, ...epidemiologyEntries];
  console.log(`   Total entries before chunking: ${allEntries.length}`);

  console.log("\nChunking content (target: 500-1000 chars per chunk)...");
  const chunks = chunkEntries(allEntries);
  console.log(`   Total chunks after splitting: ${chunks.length}`);

  const withEmbeddings = await generateEmbeddings(googleKey, chunks);

  await insertChunks(supabase, withEmbeddings);

  printStats(withEmbeddings);

  console.log("\nKnowledge base seeding complete!");
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
