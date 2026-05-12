import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("scan_history")
      .select("id, token_address, token_name, token_symbol, risk_score, risk_level, analyzed_at, ai_explanation")
      .order("analyzed_at", { ascending: false })
      .limit(20);

    if (error) {
      // Table may not exist yet — return empty gracefully
      console.warn("Supabase history error (table may not exist):", error.message);
      return NextResponse.json({ history: [] });
    }

    return NextResponse.json({ history: data || [] });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ history: [] });
  }
}
