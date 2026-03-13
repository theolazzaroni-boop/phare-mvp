import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/dashboard?linkedin=error", req.nextUrl.origin));

  // Échanger le code contre un access token
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return NextResponse.redirect(new URL("/dashboard?linkedin=error", req.nextUrl.origin));

  const token = tokenData.access_token;
  const expiry = new Date(Date.now() + tokenData.expires_in * 1000);

  // Récupérer l'utilisateur Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.nextUrl.origin));

  // Récupérer l'identité LinkedIn (personUrn)
  const meRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const me = await meRes.json();
  const personUrn = `urn:li:person:${me.sub}`;

  // Récupérer les pages entreprise dont il est admin
  const orgsRes = await fetch(
    "https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,localizedName,logoV2(original~:playableStreams))))",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const orgsData = await orgsRes.json();

  const orgs = (orgsData.elements ?? []).map((el: any) => ({
    id: `urn:li:organization:${el["organization~"]?.id}`,
    name: el["organization~"]?.localizedName ?? "Page sans nom",
  }));

  // Sauvegarder en base
  await prisma.profile.update({
    where: { id: user.id },
    data: {
      linkedinAccessToken: token,
      linkedinTokenExpiry: expiry,
      linkedinPersonUrn: personUrn,
      linkedinOrgs: orgs,
      // Par défaut : profil perso
      linkedinAuthorUrn: personUrn,
    },
  });

  // Rediriger vers la page de choix si des pages entreprise existent
  if (orgs.length > 0) {
    return NextResponse.redirect(new URL("/dashboard/settings/linkedin", req.nextUrl.origin));
  }

  return NextResponse.redirect(new URL("/dashboard?linkedin=connected", req.nextUrl.origin));
}
