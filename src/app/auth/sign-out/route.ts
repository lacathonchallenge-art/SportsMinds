import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  const url = new URL("/admin/login?message=Vous+avez+été+déconnecté.", request.url);
  return NextResponse.redirect(url, { status: 303 });
}
