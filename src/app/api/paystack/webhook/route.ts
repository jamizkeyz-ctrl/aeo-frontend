import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize admin Supabase client to update profile records
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    // 1. Verify Paystack HMAC SHA512 Signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 2. Parse Event Payload
    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const data = event.data;
      const metadata = data.metadata || {};
      const customFields = metadata.custom_fields || [];

      // Extract user_id and plan from metadata
      const userField = customFields.find((f: any) => f.variable_name === "user_id");
      const planField = customFields.find((f: any) => f.variable_name === "plan");

      const userId = userField?.value;
      const plan = planField?.value || "pro";
      const customerEmail = data.customer?.email;

      const auditsLimit = plan === "agency" ? 99999 : 50;

      // 3. Provision Plan in Supabase Profiles Table
      let updateQuery;
      if (userId) {
        updateQuery = supabaseAdmin
          .from("profiles")
          .update({
            tier: plan,
            audits_limit: auditsLimit,
            audits_used: 0,
            paystack_customer_code: data.customer?.customer_code || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      } else if (customerEmail) {
        updateQuery = supabaseAdmin
          .from("profiles")
          .update({
            tier: plan,
            audits_limit: auditsLimit,
            audits_used: 0,
            paystack_customer_code: data.customer?.customer_code || null,
            updated_at: new Date().toISOString(),
          })
          .eq("email", customerEmail);
      }

      if (updateQuery) {
        const { error: dbError } = await updateQuery;
        if (dbError) {
          console.error("Supabase provisioning error:", dbError);
          return NextResponse.json({ error: dbError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}