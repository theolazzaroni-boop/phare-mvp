import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.profileId !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.revisionRequest.create({ data: { postId: id, message } }),
    prisma.post.update({ where: { id }, data: { status: "REVISION_REQUESTED" } }),
  ]);

  return NextResponse.json({ ok: true });
}
