import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch all medicines from DB for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: medicines } = await supabase
      .from("medicines")
      .select("name, generic_name, category, description, dosage, active_ingredient, side_effects, form, manufacturer, requires_prescription, price");

    const medicineContext = (medicines || [])
      .map(
        (m) =>
          `- ${m.name} (${m.generic_name}): ${m.category}. ${m.description} Dosage: ${m.dosage}. Active: ${m.active_ingredient}. Form: ${m.form}. Side effects: ${(m.side_effects || []).join(", ")}. Price: ${m.price}. Prescription: ${m.requires_prescription ? "Yes" : "No"}.`
      )
      .join("\n");

    const langName = language || "English";

    const systemPrompt = `You are RxVault's friendly medicine assistant. You help users find medicines, understand dosages, side effects, and general pharmaceutical info.

IMPORTANT: Always respond in ${langName} language.

You have access to the following medicine catalog:
${medicineContext}

Guidelines:
- If a user describes symptoms or a medicine they don't know the name of, try to identify it from the catalog above.
- Always recommend consulting a doctor for medical advice.
- Be concise, helpful, and professional.
- Format responses with markdown for readability.
- If a medicine isn't in the catalog, say so honestly and suggest they consult a pharmacist.
- Never diagnose conditions — only provide medicine information.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
