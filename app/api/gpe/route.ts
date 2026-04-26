import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_GPE_STATIONS } from "@/lib/sample-data";

export const revalidate = 86400;

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ source: "sample", stations: SAMPLE_GPE_STATIONS });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ source: "sample", stations: SAMPLE_GPE_STATIONS });
  }

  const { data, error } = await supabase
    .from("gares_futures")
    .select("id, nom, ligne, lat, lon, annee_ouverture");

  if (error || !data || data.length === 0) {
    return NextResponse.json({ source: "sample", stations: SAMPLE_GPE_STATIONS });
  }

  return NextResponse.json({ source: "supabase", stations: data });
}
