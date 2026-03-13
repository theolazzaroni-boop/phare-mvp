import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const LI_VERSION = "202503";

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

    let shareRes: Response;

    if (imageUrn) {
      // Nouvelle API /rest/posts pour les posts avec image
      const body = {
        author: authorUrn,
        commentary: post.content,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: { media: { id: imageUrn } },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      };
      shareRes = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${profile.linkedinAccessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": LI_VERSION,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
      });
    } else {
      // API legacy ugcPosts pour les posts texte (pas de version requise)
      shareRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${profile.linkedinAccessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: post.content },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });
    }

    if (!shareRes.ok) {
      const err = await shareRes.json().catch(() => ({}));
      console.error("[LinkedIn publish] failed:", JSON.stringify(err), "body:", JSON.stringify(body));
      return NextResponse.json({ error: "Erreur LinkedIn", details: err }, { status: 500 });
    }
  }

  await prisma.post.update({ where: { id }, data: { status: "PUBLISHED" } });
  return NextResponse.json({ ok: true });
}
