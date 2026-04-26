import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { SAMPLE_COMMUNES } from "@/lib/sample-data";

export const revalidate = 3600;

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ source: "sample", communes: SAMPLE_COMMUNES });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ source: "sample", communes: SAMPLE_COMMUNES });
  }

  const { data, error } = await supabase
    .from("communes_public")
    .select("*")
    .limit(40000);

  if (error || !data || data.length === 0) {
    return NextResponse.json({
      source: "sample",
      communes: SAMPLE_COMMUNES,
      error: error?.message,
    });
  }

  return NextResponse.json({ source: "supabase", communes: data });
}
