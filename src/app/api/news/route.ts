import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, weekStart } = await req.json();

  await prisma.weeklyNews.upsert({
    where: {
      id: (await prisma.weeklyNews.findFirst({
        where: { profileId: user.id, weekStart: new Date(weekStart) },
        select: { id: true },
      }))?.id ?? "nonexistent",
    },
    update: { content },
    create: { profileId: user.id, content, weekStart: new Date(weekStart) },
  });

  return NextResponse.json({ ok: true });
}
