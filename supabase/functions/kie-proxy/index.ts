import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const KIE_API_KEY = "9a87eccff0cfc2f9effdef7be2acc545";

const MODEL_URLS: Record<string, string> = {
  "gemini-2.5-pro": "https://api.kie.ai/gemini-2.5-pro/v1/chat/completions",
  "gemini-2.0-flash": "https://api.kie.ai/gemini-2.0-flash/v1/chat/completions",
};
const DEFAULT_URL = MODEL_URLS["gemini-2.0-flash"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const model: string = body.model ?? "gemini-2.0-flash";
    const kieUrl = MODEL_URLS[model] ?? DEFAULT_URL;

    const res = await fetch(kieUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
