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
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.profileId !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile?.linkedinAccessToken || !profile.linkedinPersonUrn)
    return NextResponse.json({ error: "LinkedIn non connecté" }, { status: 400 });

  const token = profile.linkedinAccessToken;
  const ownerUrn = profile.linkedinAuthorUrn ?? profile.linkedinPersonUrn;

  // Récupérer le fichier depuis le form data
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // 1. Initialiser l'upload
  const initRes = await fetch("https://api.linkedin.com/rest/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LI_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      initializeUploadRequest: { owner: ownerUrn },
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.json();
    console.error("[LinkedIn media] initializeUpload failed:", JSON.stringify(err), "ownerUrn:", ownerUrn);
    return NextResponse.json({ error: "Erreur init upload LinkedIn", details: err }, { status: 500 });
  }

  const { value: { uploadUrl, image: imageUrn } } = await initRes.json();

  // 2. Uploader le binaire
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: fileBuffer,
  });

  if (!uploadRes.ok) {
    return NextResponse.json({ error: "Erreur upload binaire LinkedIn" }, { status: 500 });
  }

  return NextResponse.json({ imageUrn });
}
