import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { theme, message } = await req.json();

  // Log for now — wire up email sending here (Resend, etc.)
  console.log("[CONTACT]", {
    userId: user?.id,
    email: user?.email,
    theme,
    message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
