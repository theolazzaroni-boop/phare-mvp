import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publishToLinkedIn } from "../../posts/[id]/publish/route";

export async function GET(req: NextRequest) {
  // Vérifier le secret Vercel cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Trouver tous les posts programmés dont l'heure est passée
  const posts = await prisma.post.findMany({
    where: {
      status: "SCHEDULED",
      scheduledPublishAt: { lte: now },
    },
    include: { profile: true },
  });

  const results = await Promise.allSettled(
    posts.map(async (post) => {
      const { profile } = post;

      if (!profile.linkedinAccessToken || !profile.linkedinAuthorUrn) {
        throw new Error(`Profile ${profile.id} has no LinkedIn token`);
      }

      await publishToLinkedIn({
        token: profile.linkedinAccessToken,
        authorUrn: profile.linkedinAuthorUrn ?? profile.linkedinPersonUrn!,
        content: post.content,
        imageUrn: post.scheduledImageUrn,
      });

      await prisma.post.update({
        where: { id: post.id },
        data: { status: "PUBLISHED", scheduledPublishAt: null, scheduledImageUrn: null },
      });

      return post.id;
    })
  );

  const published = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;

  console.log(`[cron/publish] ${published} publiés, ${failed} échoués`);

  return NextResponse.json({ published, failed });
}
