import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  "https://pulseflow-aeo-backend.onrender.com";

export async function GET(req: NextRequest) {
  // Verify Vercel Cron Secret (protects unauthorized public invocations)
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch all active monitored brands
    const { data: activeMonitors, error } = await supabaseAdmin
      .from("monitored_brands")
      .select("*, profiles:user_id(email, tier)")
      .eq("is_active", true);

    if (error || !activeMonitors) {
      return NextResponse.json({ error: "No active monitors found" }, { status: 200 });
    }

    const results = [];

    // 2. Trigger asynchronous batch runs
    for (const monitor of activeMonitors) {
      const isCompare = !!monitor.competitor_brand;
      const endpoint = isCompare
        ? `${API_BASE_URL}/api/v1/aeo/compare-audit`
        : `${API_BASE_URL}/api/v1/aeo/batch-audit`;

      const payload = isCompare
        ? {
            brand_a_name: monitor.brand_name,
            brand_a_domain: monitor.brand_domain,
            brand_b_name: monitor.competitor_brand,
            brand_b_domain: monitor.competitor_domain,
            category: monitor.category,
            user_id: monitor.user_id,
          }
        : {
            target_brand: monitor.brand_name,
            target_domain: monitor.brand_domain,
            category: monitor.category,
            user_id: monitor.user_id,
          };

      const auditRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (auditRes.ok) {
        const data = await auditRes.json();
        
        // Update last run time in monitoring table
        await supabaseAdmin
          .from("monitored_brands")
          .update({
            last_run_at: new Date().toISOString(),
          })
          .eq("id", monitor.id);

        results.push({ brand: monitor.brand_name, job_id: data.job_id, status: "triggered" });
      }
    }

    return NextResponse.json({
      status: "success",
      monitored_count: activeMonitors.length,
      runs: results,
    });
  } catch (err: any) {
    console.error("Cron Execution Failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}