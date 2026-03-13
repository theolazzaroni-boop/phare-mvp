import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const LI_VERSION = "202401";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { auto, imageUrn } = await req.json().catch(() => ({ auto: false, imageUrn: null }));

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.profileId !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (auto) {
    const profile = await prisma.profile.findUnique({ where: { id: user.id } });

    if (!profile?.linkedinAccessToken)
      return NextResponse.json({ error: "LinkedIn non connecté" }, { status: 400 });

    if (profile.linkedinTokenExpiry && profile.linkedinTokenExpiry < new Date())
      return NextResponse.json({ error: "Token LinkedIn expiré — reconnectez LinkedIn" }, { status: 400 });

    const authorUrn = profile.linkedinAuthorUrn ?? profile.linkedinPersonUrn;
    if (!authorUrn)
      return NextResponse.json({ error: "Auteur LinkedIn non configuré" }, { status: 400 });

    const body: Record<string, unknown> = {
      author: authorUrn,
      commentary: post.content,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    if (imageUrn) {
      body.content = {
        media: { id: imageUrn },
      };
    }

    const shareRes = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${profile.linkedinAccessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": LI_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    if (!shareRes.ok) {
      const err = await shareRes.json().catch(() => ({}));
      return NextResponse.json({ error: "Erreur LinkedIn", details: err }, { status: 500 });
    }
  }

  await prisma.post.update({ where: { id }, data: { status: "PUBLISHED" } });
  return NextResponse.json({ ok: true });
}
