import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { authorUrn } = await req.json();
  if (!authorUrn) return NextResponse.json({ error: "authorUrn requis" }, { status: 400 });

  await prisma.profile.update({
    where: { id: user.id },
    data: { linkedinAuthorUrn: authorUrn },
  });

  return NextResponse.json({ ok: true });
}
