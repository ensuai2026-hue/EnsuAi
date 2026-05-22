import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to create the admin user fresh
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: "admin@ensu.ai",
      password: "Admin@Ensu2024",
      email_confirm: true,
    });

    if (createError) {
      // If already exists, try to find and update
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (listError) throw listError;
      const adminUser = listData.users.find((u) => u.email === "admin@ensu.ai");
      if (!adminUser) throw new Error(`Create failed: ${createError.message}. User also not found in list.`);

      const { error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
        password: "Admin@Ensu2024",
        email_confirm: true,
      });
      if (updateError) throw updateError;
      return new Response(JSON.stringify({ success: true, action: "updated", userId: adminUser.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, action: "created", userId: createData.user?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
