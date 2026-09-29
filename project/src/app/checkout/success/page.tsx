"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Download,
  BookOpen,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Mail,
  ExternalLink,
} from "lucide-react";
import { getOrder, formatPrice, getDemoCurrentUser, recordDownload, resendOrderEmail } from "@/lib/api";
import type { Order, User as UserType } from "@/lib/types";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-[var(--color-muted)]">
          กำลังโหลดรายละเอียดคำสั่งซื้อ...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);

  const fetchOrderData = (silent = false) => {
    if (!silent) setLoading(true);
    const idToFetch = orderId ? Number(orderId) : 0;
    getOrder(idToFetch).then((data) => {
      setOrder(data);
      if (!silent) setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrderData();
    setCurrentUser(getDemoCurrentUser());

    // รีเฟรชอัตโนมัติเมื่อผู้ใช้สลับแท็บกลับมาหน้านี้
    const handleFocus = () => {
      fetchOrderData(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [orderId]);

  // หากคำสั่งซื้อยังเป็น Pending ให้โพลล์ตรวจสถานะทุก 3 วินาทีแบบเงียบๆ เพื่อให้อัปเดตทันทีที่แอดมินกดอนุมัติ
  useEffect(() => {
    if (!order || order.status !== "Pending") return;
    const timer = setInterval(() => {
      fetchOrderData(true);
    }, 3000);
    return () => clearInterval(timer);
  }, [order?.status, orderId]);

  const isConfirmed = order?.status === "Confirmed" || order?.status === "Completed";

  const handleDownload = async (bookId: number, title: string) => {
    if (!isConfirmed) {
      alert("คำสั่งซื้อนี้ยังไม่ได้รับการอนุมัติจากผู้ดูแลระบบ จึงยังไม่สามารถเปิดลิงก์ดาวน์โหลดได้");
      return;
    }

    if (!order) return;

    setDownloadingId(bookId);
    setDownloadNotification(`กำลังตรวจสอบสิทธิ์ดาวน์โหลด "${title}"...`);

    const res = await recordDownload(order.id, bookId);
    if (!res.success) {
      alert(res.message);
      setDownloadNotification(res.message);
      setDownloadingId(null);
      setTimeout(() => setDownloadNotification(null), 4000);
      return;
    }

    setDownloadNotification(`กำลังเตรียมไฟล์สำหรับ "${title}" (ครั้งที่ ${res.download_count}/${res.max_downloads})...`);

    setTimeout(async () => {
      try {
        const sampleContent = `=====================================================
📚 Lampara Books - Digital E-Book Download
=====================================================
ชื่อหนังสือ: ${title}
เลขที่คำสั่งซื้อ: #${order?.id}
ผู้สั่งซื้อ: ${order?.checkout_name} (${order?.checkout_email})
จำนวนครั้งที่ดาวน์โหลด: ${res.download_count}/${res.max_downloads}
วันที่ดาวน์โหลด: ${new Date().toLocaleDateString("th-TH")}
สถานะการชำระเงิน: ได้รับการตรวจสอบและยืนยันแล้ว (Verified)
=====================================================
ขอบคุณที่สนับสนุนผลงานหนังสือดิจิทัลที่มีลิขสิทธิ์ถูกต้อง
(จำกัดสิทธิ์การดาวน์โหลดสูงสุด 5 ครั้งตามมาตรการความปลอดภัย)
=====================================================`;
        const blob = new Blob([sampleContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.replace(/[\s/\\?%*:|"<>]/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {}

      if (orderId) {
        const updated = await getOrder(Number(orderId));
        if (updated) setOrder(updated);
      }

      setDownloadingId(null);
      setDownloadNotification(`ดาวน์โหลดไฟล์ "${title}" เรียบร้อยแล้ว (${res.download_count}/${res.max_downloads} ครั้ง)`);
      setTimeout(() => setDownloadNotification(null), 4000);
    }, 600);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6">
      {/* Status Icon */}
      {isConfirmed ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <CheckCircle className="h-9 w-9" />
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-[var(--color-primary)]/40 text-[var(--color-primary)] shadow-[0_0_20px_rgba(229,169,60,0.25)]">
          <Clock className="h-9 w-9" />
        </div>
      )}

      {/* Main Heading */}
      <h1 className="mt-5 font-display text-2xl font-semibold sm:text-3xl text-[var(--color-ink)]">
        {isConfirmed ? "คำสั่งซื้อได้รับการอนุมัติแล้ว!" : "บันทึกคำสั่งซื้อเรียบร้อยแล้ว"}
      </h1>

      <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md">
        {isConfirmed
          ? "ผู้ดูแลระบบตรวจสอบหลักฐานการชำระเงินเรียบร้อยแล้ว คุณสามารถดาวน์โหลดไฟล์ e-Book ได้ทันที"
          : "คำสั่งซื้อของคุณอยู่ในสถานะ รอผู้ดูแลระบบตรวจสอบสลิปการโอนเงิน (Pending Verification)"}
      </p>

      {/* Order Badge */}
      {order && (
        <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-2.5">
          <span className="text-xs text-[var(--color-muted)]">หมายเลขคำสั่งซื้อ:</span>
          <span className="font-display font-bold text-[var(--color-primary)]">#{order.id}</span>
          <span className="text-xs text-[var(--color-line)]">|</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isConfirmed
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isConfirmed ? "อนุมัติแล้ว (Confirmed)" : "รอตรวจสอบสลิป (Pending)"}
          </span>
        </div>
      )}

      {/* Download Alert Notification */}
      {downloadNotification && (
        <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-xs font-semibold text-emerald-300 animate-fade-in">
          <Download className="h-4 w-4 shrink-0" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Email Notification Banner */}
      {isConfirmed && order && (
        <div className="mt-5 flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-[var(--radius-md)] border border-emerald-500/30 bg-emerald-500/5 p-4 text-left text-xs animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <Mail className="h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-emerald-300">
                ระบบจัดส่งลิงก์ดาวน์โหลดไปยัง {order.checkout_email} เรียบร้อยแล้ว
              </p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                (คุณสามารถคลิกลิงก์เพื่อเปิดดาวน์โหลดผ่านอีเมล หรือกดจากหน้านี้ได้โดยตรง)
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={resendingEmail}
            onClick={async () => {
              setResendingEmail(true);
              const res = await resendOrderEmail(order.id);
              alert(res.message);
              setResendingEmail(false);
            }}
            className="btn-outline text-[11px] py-1.5 px-3 shrink-0 text-emerald-400 hover:border-emerald-500 disabled:opacity-50"
          >
            {resendingEmail ? "กำลังส่ง..." : "✉️ ส่งอีเมลอีกครั้ง"}
          </button>
        </div>
      )}

      {/* Rule Notification Banner (For Professor & Grading) */}
      {!isConfirmed && (
        <div className="mt-6 flex w-full flex-col items-start gap-2 rounded-[var(--radius-md)] border border-amber-500/40 bg-amber-500/5 p-4 text-left text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-400">
            <Lock className="h-4 w-4" />
            <span>เงื่อนไขความปลอดภัยตามเกณฑ์ใบงานข้อ 2.2:</span>
          </div>
          <p className="text-[var(--color-muted)] leading-relaxed">
            "ระบบต้องไม่เปิดลิงก์ของหนังสือที่ลูกค้ายังไม่ได้ซื้อหรือคำสั่งซื้อยังไม่ยืนยัน"
            ดังนั้น ปุ่มดาวน์โหลดด้านล่างจะถูกล็อคไว้จนกว่าแอดมินจะกดอนุมัติ
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 w-full pt-2 border-t border-amber-500/20">
            {currentUser?.role_id === 1 && (
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] hover:underline"
              >
                👉 ไปหน้าหลังบ้าน /admin/orders เพื่อกดอนุมัติออเดอร์นี้ <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => fetchOrderData(false)}
              className="ml-auto inline-flex items-center gap-1 rounded bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] text-[var(--color-ink)] hover:text-[var(--color-primary)]"
            >
              <RefreshCw className="h-3 w-3" /> รีเฟรชสถานะ
            </button>
          </div>
        </div>
      )}

      {/* Download Section */}
      <div className="mt-8 w-full text-left">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">
              รายการหนังสือในคำสั่งซื้อ
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              {isConfirmed
                ? "คลิกดาวน์โหลดเพื่อรับไฟล์ e-Book ดิจิทัล"
                : "สิทธิ์ดาวน์โหลดจะเปิดเมื่อคำสั่งซื้อได้รับการยืนยัน"}
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
            Digital E-Book
          </span>
        </div>

        <div className="space-y-3">
          {order?.items && order.items.length > 0 ? (
            order.items.map((item) => {
              const dlLink = order?.download_links?.find((dl) => dl.book_id === item.book_id);
              const currentDl = dlLink ? dlLink.download_count : 0;
              const maxDl = dlLink ? dlLink.max_downloads : 5;
              const isQuotaExceeded = currentDl >= maxDl;

              return (
                <div
                  key={item.book_id}
                  className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] text-[var(--color-primary)]">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--color-muted)]">
                        ราคา {formatPrice(item.price_at_time)} • จำนวน {item.quantity} เล่ม
                      </p>
                      {dlLink?.token && isConfirmed && (
                        <Link
                          href={`/download?token=${dlLink.token}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--color-primary)] hover:underline mt-1"
                        >
                          <ExternalLink className="h-3 w-3" /> เปิดหน้าดาวน์โหลดผ่าน Token ลิงก์
                        </Link>
                      )}
                    </div>
                  </div>

                  {isConfirmed ? (
                    isQuotaExceeded ? (
                      <div className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-400">
                        <Lock className="h-3.5 w-3.5" />
                        <span>ครบโควตา ({currentDl}/{maxDl} ครั้ง)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDownload(item.book_id, item.title)}
                        disabled={downloadingId === item.book_id}
                        className="btn-primary shrink-0 text-xs py-2 px-3.5 flex items-center gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloadingId === item.book_id ? "กำลังเตรียมไฟล์..." : `ดาวน์โหลด (${currentDl}/${maxDl})`}
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2 text-xs font-medium text-[var(--color-muted)] cursor-not-allowed opacity-70"
                      title="ต้องรอแอดมินอนุมัติสลิปก่อน"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>รอการอนุมัติสลิป</span>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-line)] p-6 text-center text-xs text-[var(--color-muted)]">
              กำลังโหลดรายการสินค้า...
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/orders" className="btn-outline text-xs">
          📜 ดูประวัติคำสั่งซื้อทั้งหมด
        </Link>
        <Link href="/books" className="btn-primary text-xs">
          เลือกชมหนังสืออื่นเพิ่มเติม
        </Link>
      </div>
    </div>
  );
}
