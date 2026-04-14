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
  const { suggestion_id, rating, comment } = body;

  if (!suggestion_id || !["useful", "not_relevant"].includes(rating)) {
    return NextResponse.json({ error: "Donnees invalides" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      suggestion_id,
      doctor_id: doctor.id,
      rating,
      comment: comment || null,
    })
    .select("id")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
