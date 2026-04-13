import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  if (!secret) return false;
  try {
    const decoded = atob(secret);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@liw.com";
    const adminPass = process.env.ADMIN_PASS || "liwadmin2024";
    return decoded === `${adminEmail}:${adminPass}`;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status, adminNote } = await req.json();
  const supabase = getSupabase();

  const { error } = await supabase
    .from("orders")
    .update({ status, admin_note: adminNote || null })
    .eq("id", orderId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: order } = await supabase
    .from("orders")
    .select("customer_email, customer_name")
    .eq("id", orderId)
    .single();

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && order) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LIW Orders <orders@larryinverwholesale.com>",
        to: [order.customer_email],
        subject: `Your LIW Order — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <p>Hi ${order.customer_name},</p>
          <p>Your order has been <strong>${status}</strong>.</p>
          ${adminNote ? `<p>Note from our team: ${adminNote}</p>` : ""}
          <p>Thank you for choosing Larry Inver Wholesale.</p>
          <p><em>From Our Home to Yours</em></p>
        `,
      }),
    });
  }

  return NextResponse.json({ success: true });
}
