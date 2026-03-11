import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminProfile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!adminProfile || adminProfile.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { clientId, weekStart, posts } = await req.json();

  // Delete existing posts for this client/week and replace
  await prisma.post.deleteMany({
    where: { profileId: clientId, weekStart: new Date(weekStart) },
  });

  await prisma.post.createMany({
    data: posts.map((p: { dayOfWeek: number; publishTime: string; content: string }) => ({
      profileId: clientId,
      weekStart: new Date(weekStart),
      dayOfWeek: p.dayOfWeek,
      publishTime: p.publishTime,
      content: p.content,
      status: "READY",
    })),
  });

  return NextResponse.json({ ok: true });
}
