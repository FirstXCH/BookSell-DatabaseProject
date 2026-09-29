import nodemailer from "nodemailer";
import { Resend } from "resend";

export type EmailItem = {
  book_id: number;
  title: string;
  quantity: number;
  price_at_time: number;
  token?: string;
};

export type SendOrderEmailPayload = {
  order_id: number;
  checkout_name: string;
  checkout_email: string;
  total: number;
  items: EmailItem[];
  host_url?: string;
};

export type SendEmailResult = {
  success: boolean;
  provider: "resend" | "smtp" | "mock";
  message: string;
  info?: any;
};

export function generateOrderEmailHtml(payload: SendOrderEmailPayload): string {
  const host = payload.host_url || (process.env.NEXT_PUBLIC_SITE_URL || "https://project-three-zeta-90.vercel.app");

  const itemsHtml = payload.items
    .map((item) => {
      const downloadUrl = item.token
        ? `${host}/download?token=${item.token}`
        : `${host}/checkout/success?id=${payload.order_id}`;

      return `
        <div style="background-color: #1a1d21; border: 1px solid #2d3239; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <div style="font-size: 15px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">
            📚 ${item.title}
          </div>
          <div style="font-size: 12px; color: #9ca3af; margin-bottom: 12px;">
            จำนวน: ${item.quantity} เล่ม • ราคาเล่มละ ฿${Number(item.price_at_time).toFixed(2)}
          </div>
          <div style="margin-top: 10px;">
            <a href="${downloadUrl}" target="_blank" style="display: inline-block; background-color: #e5a93c; color: #0d0f11; font-weight: bold; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 6px;">
              📥 คลิกเพื่อดาวน์โหลด e-Book (จำกัด 5 ครั้ง)
            </a>
          </div>
          <div style="font-size: 11px; color: #f59e0b; margin-top: 8px;">
            🔒 เงื่อนไขความปลอดภัย: จำกัดสิทธิ์การดาวน์โหลดสูงสุด 5 ครั้ง • ลิงก์มีอายุ 30 วัน
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ยืนยันคำสั่งซื้อ #${payload.order_id} - Lampara Books</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d0f11; color: #e5e7eb; margin: 0; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #141618; border: 1px solid #2d3239; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <div style="background-color: #1a1d21; border-bottom: 1px solid #2d3239; padding: 24px; text-align: center;">
          <h1 style="color: #e5a93c; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
            📚 Lampara Books
          </h1>
          <p style="color: #9ca3af; margin: 6px 0 0 0; font-size: 12px;">
            ระบบร้านขายหนังสือดิจิทัล (Digital E-Book Store)
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <div style="display: inline-block; background-color: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px; margin-bottom: 14px;">
            ✓ ชำระเงินเรียบร้อยแล้ว (Verified)
          </div>

          <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 8px 0;">
            ยืนยันคำสั่งซื้อ #${payload.order_id}
          </h2>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
            สวัสดีคุณ <strong>${payload.checkout_name}</strong> ขอขอบคุณสำหรับการสนับสนุนผลงานหนังสือที่มีลิขสิทธิ์ถูกต้อง เจ้าหน้าที่ได้ตรวจสอบหลักฐานการชำระเงินเรียบร้อยแล้ว คุณสามารถคลิกดาวน์โหลดไฟล์ e-Book ผ่านลิงก์ด้านล่างได้ทันที:
          </p>

          <!-- Book Items -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 13px; color: #d1d5db; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
              รายการหนังสือที่คุณได้รับสิทธิ์:
            </h3>
            ${itemsHtml}
          </div>

          <!-- Summary Box -->
          <div style="background-color: #1a1d21; border: 1px solid #2d3239; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #9ca3af;">ยอดรวมสุทธิ:</span>
              <strong style="color: #e5a93c; font-size: 15px;">฿${Number(payload.total).toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #9ca3af;">อีเมลผู้รับ:</span>
              <span style="color: #ffffff;">${payload.checkout_email}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #9ca3af;">วันที่ยืนยัน:</span>
              <span style="color: #ffffff;">${new Date().toLocaleDateString("th-TH")}</span>
            </div>
          </div>

          <!-- Note -->
          <p style="font-size: 11px; color: #6b7280; line-height: 1.5; margin: 0;">
            * หากคุณไม่ได้เป็นผู้ทำรายการนี้ หรือพบปัญหาในการดาวน์โหลด สามารถติดต่อผู้ดูแลระบบได้ที่ support@lampara.com
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #101214; border-top: 1px solid #2d3239; padding: 16px; text-align: center; font-size: 11px; color: #6b7280;">
          © 2026 Lampara Books. โครงงานระบบฐานข้อมูล (Database Systems Project)
        </div>

      </div>
    </body>
    </html>
  `;
}

export async function sendOrderConfirmedEmail(
  payload: SendOrderEmailPayload
): Promise<SendEmailResult> {
  const subject = `📚 ยืนยันคำสั่งซื้อ #${payload.order_id} - ลิงก์ดาวน์โหลด e-Book ของคุณ (Lampara Books)`;
  const html = generateOrderEmailHtml(payload);

  // 1. ลองส่งผ่าน Resend (ถ้ามี RESEND_API_KEY)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM || "Lampara Books <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from: fromEmail,
        to: [payload.checkout_email],
        subject,
        html,
      });

      if (!result.error) {
        return {
          success: true,
          provider: "resend",
          message: `ส่งอีเมลผ่าน Resend ไปยัง ${payload.checkout_email} เรียบร้อยแล้ว`,
          info: result.data,
        };
      } else {
        console.warn("Resend email error:", result.error);
      }
    } catch (err) {
      console.error("Resend delivery failed:", err);
    }
  }

  // 2. ลองส่งผ่าน SMTP / Nodemailer (เช่น Gmail หรือ Custom SMTP)
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== "false",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `Lampara Books <${smtpUser}>`,
        to: payload.checkout_email,
        subject,
        html,
      });

      return {
        success: true,
        provider: "smtp",
        message: `ส่งอีเมลผ่าน SMTP ไปยัง ${payload.checkout_email} เรียบร้อยแล้ว (MessageId: ${info.messageId})`,
        info,
      };
    } catch (smtpErr) {
      console.error("SMTP delivery failed:", smtpErr);
    }
  }

  // 3. Fallback: บันทึกและจำลองการส่ง (Mock Dispatch)
  console.log(`[Email Dispatch Simulation] Sent to: ${payload.checkout_email}, Subject: ${subject}`);
  return {
    success: true,
    provider: "mock",
    message: `จำลองการส่งอีเมลไปยัง ${payload.checkout_email} เรียบร้อยแล้ว (สามารถระบุ RESEND_API_KEY หรือ SMTP_USER เพื่อส่งจริงเข้า Inbox ได้ทันที)`,
  };
}
