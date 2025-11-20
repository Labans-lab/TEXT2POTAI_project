// /supabase/functions/payment-callback/index.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const body = await req.json();
  const { api_ref, status } = body;

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // 1. Update payments table
  const { data } = await supabase
    .from("payments")
    .update({ status })
    .eq("reference", api_ref)
    .select("user_id")
    .single();

  if (status === "SUCCESS") {
    await supabase
      .from("users")
      .update({ is_pro: true })
      .eq("id", data.user_id);
  }

  return new Response("OK", { status: 200 });
});
