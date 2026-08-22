import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pulseflow-aeo-backend.onrender.com";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch active monitored brands
    const { data: activeMonitors, error: dbError } = await supabaseAdmin
      .from("monitored_brands")
      .select("id, user_id, brand_name, brand_domain, competitor_brand, competitor_domain, category, is_active, last_sov")
      .eq("is_active", true);

    if (dbError) {
      console.error("Supabase query error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!activeMonitors || activeMonitors.length === 0) {
      return NextResponse.json({
        status: "success",
        message: "No active monitored brands found",
        monitored_count: 0,
        runs: []
      }, { status: 200 });
    }

    const results = [];

    // 2. Process each monitored brand
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
            category: monitor.category || "General",
            user_id: monitor.user_id,
          }
        : {
            target_brand: monitor.brand_name,
            target_domain: monitor.brand_domain,
            category: monitor.category || "General",
            user_id: monitor.user_id,
          };

      try {
        const auditRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (auditRes.ok) {
          const data = await auditRes.json();
          const jobId = data.job_id;

          // Update last run time in monitoring table
          await supabaseAdmin
            .from("monitored_brands")
            .update({
              last_run_at: new Date().toISOString(),
            })
            .eq("id", monitor.id);

          // Fetch user's email address (Dual lookup: Auth Admin -> Profiles table)
          let recipientEmail: string | null = null;
          if (monitor.user_id) {
            try {
              const { data: userData } = await supabaseAdmin.auth.admin.getUserById(monitor.user_id);
              recipientEmail = userData?.user?.email || null;
            } catch {
              // Fallback to profiles table
              const { data: profileData } = await supabaseAdmin
                .from("profiles")
                .select("email")
                .eq("id", monitor.user_id)
                .single();
              recipientEmail = profileData?.email || null;
            }
          }

          let emailStatus = "not_sent";
          let emailErrorMsg: string | null = null;

          // Send Email Digest via Resend
          if (recipientEmail && resend) {
            try {
              const reportUrl = `https://pulseflowaeo.com/?report=${jobId}`;
              const { error: resendErr } = await resend.emails.send({
                from: "PulseFlow AEO <onboarding@resend.dev>",
                to: recipientEmail,
                subject: `[PulseFlow AEO] Weekly Citation Digest: ${monitor.brand_name}`,
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f8fafc; margin: 0; padding: 24px; }
                      .card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; }
                      .badge { display: inline-block; background-color: #1e1b4b; color: #818cf8; font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; border: 1px solid #3730a3; }
                      h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
                      p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px 0; }
                      .kpi-container { display: flex; gap: 12px; margin-bottom: 24px; }
                      .kpi-box { flex: 1; background-color: #030712; border: 1px solid #334155; border-radius: 12px; padding: 16px; text-align: center; }
                      .kpi-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
                      .kpi-value { font-size: 24px; font-weight: 900; color: #818cf8; }
                      .btn { display: inline-block; width: 100%; box-sizing: border-box; background: linear-gradient(to right, #4f46e5, #6366f1); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; text-align: center; padding: 14px 20px; border-radius: 12px; margin-top: 12px; }
                      .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 24px; }
                    </style>
                  </head>
                  <body>
                    <div class="card">
                      <div class="badge">Weekly AEO Monitoring</div>
                      <h1>Citation Audit Dispatched</h1>
                      <p>Your automated weekly evaluation for <strong>${monitor.brand_name}</strong> (${monitor.brand_domain}) has been executed across ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews.</p>
                      
                      <div class="kpi-container">
                        <div class="kpi-box">
                          <div class="kpi-label">Target Brand</div>
                          <div class="kpi-value" style="font-size: 16px; color: #f8fafc; padding-top: 4px;">${monitor.brand_name}</div>
                        </div>
                        <div class="kpi-box">
                          <div class="kpi-label">Category</div>
                          <div class="kpi-value" style="font-size: 14px; color: #38bdf8; padding-top: 4px;">${monitor.category || "General"}</div>
                        </div>
                      </div>

                      <p>View your fresh Share of Voice report, competitor displacement metrics, and new outreach listicles below:</p>

                      <a href="${reportUrl}" class="btn" target="_blank">View Live AEO Report &rarr;</a>

                      <div class="footer">
                        PulseFlow AEO Engine &bull; Automated Agency Monitoring<br>
                        You are receiving this digest because weekly citation monitoring is enabled for ${monitor.brand_domain}.
                      </div>
                    </div>
                  </body>
                  </html>
                `
              });

              if (resendErr) {
                emailStatus = "error";
                emailErrorMsg = resendErr.message;
              } else {
                emailStatus = "sent";
              }
            } catch (mailErr: any) {
              emailStatus = "error";
              emailErrorMsg = mailErr.message;
            }
          }

          results.push({
            brand: monitor.brand_name,
            job_id: jobId,
            recipient_email: recipientEmail,
            email_status: emailStatus,
            email_error: emailErrorMsg,
            status: "triggered"
          });
        } else {
          results.push({
            brand: monitor.brand_name,
            status: "failed",
            error: `API responded with status ${auditRes.status}`
          });
        }
      } catch (err: any) {
        results.push({
          brand: monitor.brand_name,
          status: "failed",
          error: err.message
        });
      }
    }

    return NextResponse.json({
      status: "success",
      has_resend_key: !!resendApiKey,
      monitored_count: activeMonitors.length,
      runs: results,
    });
  } catch (err: any) {
    console.error("Cron Execution Failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}