import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data)
    return NextResponse.json(
      { error: "Profil introuvable" },
      { status: 404 }
    );

  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const body = await request.json();
  const { first_name, last_name, specialty, license_number } = body;

  const updates: Record<string, string> = {};
  if (first_name) updates.first_name = first_name;
  if (last_name) updates.last_name = last_name;
  if (specialty) updates.specialty = specialty;
  if (license_number !== undefined) updates.license_number = license_number;

  const { data, error } = await supabase
    .from("doctors")
    .update(updates)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
