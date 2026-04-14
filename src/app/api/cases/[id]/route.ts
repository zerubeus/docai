import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data, error } = await supabase
    .from("cases")
    .select(
      `
      *,
      patients (*),
      case_symptoms (*),
      case_history (*),
      case_tests (*),
      case_treatments (*),
      suggestions (*, feedback(*))
    `
    )
    .eq("id", id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Cas introuvable" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const body = await request.json();
  const { status } = body;

  if (!["en_cours", "resolu", "archive"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("cases")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error || !data)
    return NextResponse.json(
      { error: error?.message || "Erreur" },
      { status: 500 }
    );

  return NextResponse.json(data);
}
