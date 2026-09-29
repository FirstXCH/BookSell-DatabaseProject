import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendOrderConfirmedEmail, EmailItem } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const hostUrl = req.headers.get("origin") || req.nextUrl.origin || "https://project-three-zeta-90.vercel.app";

    if (isSupabaseConfigured && supabase) {
      // 1. ดึงข้อมูล Order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          download_links (*)
        `)
        .eq("id", order_id)
        .single();

      if (orderErr || !order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 2. จับคู่ Item กับ Token ดาวน์โหลด
      const items: EmailItem[] = (order.order_items || []).map((it: any) => {
        const link = (order.download_links || []).find((l: any) => l.book_id === it.book_id);
        return {
          book_id: it.book_id,
          title: it.title,
          quantity: it.quantity,
          price_at_time: Number(it.price_at_time),
          token: link?.token,
        };
      });

      // 3. ส่งอีเมล
      const result = await sendOrderConfirmedEmail({
        order_id: order.id,
        checkout_name: order.checkout_name,
        checkout_email: order.checkout_email,
        total: Number(order.total),
        items,
        host_url: hostUrl,
      });

      // 4. บันทึกสถานะ email_sent = true
      await supabase
        .from("orders")
        .update({ email_sent: true, updated_at: new Date().toISOString() })
        .eq("id", order_id);

      return NextResponse.json({
        success: true,
        order_id: order.id,
        provider: result.provider,
        message: result.message,
      });
    }

    return NextResponse.json({
      success: true,
      order_id,
      provider: "mock",
      message: "ระบบฐานข้อมูลในเครื่องจำลองการส่งเรียบร้อยแล้ว",
    });
  } catch (err: any) {
    console.error("API send-order-email error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
