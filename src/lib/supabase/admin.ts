import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS, **server only**.
 * Use exclusively from Route Handlers, Server Actions, or Server Components
 * after an auth check. NEVER import from a client component.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
