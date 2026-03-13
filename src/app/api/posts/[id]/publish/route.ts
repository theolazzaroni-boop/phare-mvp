import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const LI_VERSION = "202503";

export async function publishToLinkedIn({
  token,
  authorUrn,
  content,
  imageUrn,
}: {
  token: string;
  authorUrn: string;
  content: string;
  imageUrn?: string | null;
}) {
  let res: Response;

  if (imageUrn) {
    res = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": LI_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        commentary: content,
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        content: { media: { id: imageUrn } },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });
  } else {
    res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[LinkedIn publish] failed:", JSON.stringify(err));
    throw new Error(JSON.stringify(err));
  }
}

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

    // Calculer l'heure exacte de publication
    const scheduled = new Date(post.weekStart);
    scheduled.setUTCDate(scheduled.getUTCDate() + (post.dayOfWeek - 1));
    const [hours, minutes] = post.publishTime.split(":").map(Number);
    scheduled.setUTCHours(hours, minutes, 0, 0);

    // Si l'heure est déjà passée, publier immédiatement
    if (scheduled <= new Date()) {
      await publishToLinkedIn({ token: profile.linkedinAccessToken!, authorUrn, content: post.content, imageUrn });
      await prisma.post.update({ where: { id }, data: { status: "PUBLISHED", scheduledPublishAt: null, scheduledImageUrn: null } });
      return NextResponse.json({ ok: true, immediate: true });
    }

    // Sinon programmer
    await prisma.post.update({
      where: { id },
      data: { status: "SCHEDULED", scheduledPublishAt: scheduled, scheduledImageUrn: imageUrn ?? null },
    });
    return NextResponse.json({ ok: true, scheduled: scheduled.toISOString() });
  }

  await prisma.post.update({ where: { id }, data: { status: "PUBLISHED" } });
  return NextResponse.json({ ok: true });
}
