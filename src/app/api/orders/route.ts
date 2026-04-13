import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, address,
      businessName, businessType,
      items, total, paymentMethod,
    } = body;

    if (!name || !email || !phone || !address || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (total < 150) {
      return NextResponse.json({ error: "Minimum order is $150" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        business_name: businessName || null,
        business_type: businessType || null,
        items,
        total,
        payment_method: paymentMethod || "invoice",
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    await sendOrderConfirmation(email, name, data.id, items, total);

    return NextResponse.json({ orderId: data.id, success: true });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const itemsList = items.map((i) => `${i.name} × ${i.quantity}`).join(", ");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LIW Orders <orders@larryinverwholesale.com>",
      to: [email, process.env.ADMIN_EMAIL || "admin@larryinverwholesale.com"],
      subject: `LIW Order Received — #${orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <h2>Order Received — Larry Inver Wholesale</h2>
        <p>Hi ${name}, thank you for your order!</p>
        <p><strong>Order #:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
        <p><strong>Items:</strong> ${itemsList}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p>Our team will review and confirm your order within 2 business hours.</p>
        <br/>
        <p><em>Larry Inver Wholesale — From Our Home to Yours</em></p>
      `,
    }),
  });
}
