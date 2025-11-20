// /supabase/functions/create-checkout/index.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {

  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, plan } = await req.json();
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const INTASEND_SECRET_KEY = Deno.env.get("INTASEND_SECRET_KEY");

    const planPrices: Record<string, number> = { pro: 500 };
    const amount = planPrices[plan];

    const paymentRef = `T2P_${Date.now()}`;

    // Store pending payment
    await supabase.from("payments").insert({
      user_id,
      amount,
      reference: paymentRef,
      status: "PENDING",
    });

    const payload = {
      first_name: "Text2Pot",
      last_name: "User",
      amount,
      email: `${user_id}@text2pot.ai`,
      currency: "KES",
      api_ref: paymentRef,
      redirect_url: "https://text2potai.netlify.app/payment-success.html",
      callback_url: "https://text2potai.netlify.app/payment-callback",
      hosted: true,
    };

    const response = await fetch("https://sandbox.intasend.com/api/v1/checkout/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${INTASEND_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ checkout_url: data.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
