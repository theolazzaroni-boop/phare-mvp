import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!admin || admin.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, password, name, company } = await req.json();

  // Use service role key to create user without email confirmation
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRole)
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY manquant" }, { status: 500 });

  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRole
  );

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await prisma.profile.create({
    data: { id: data.user.id, email, name, company, role: "CLIENT" },
  });

  return NextResponse.json({ ok: true });
}
