"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Download,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ExternalLink,
  User,
} from "lucide-react";
import { getOrders, getDemoCurrentUser, formatPrice } from "@/lib/api";
import type { Order, User as UserType } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  useEffect(() => {
    const user = getDemoCurrentUser();
    setCurrentUser(user);
    if (user) {
      getOrders(user.id).then((data) => {
        setOrders(data);
        setLoading(false);
      });
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "confirmed") return o.status === "Confirmed" || o.status === "Completed";
    if (selectedStatus === "pending") return o.status === "Pending";
    if (selectedStatus === "cancelled") return o.status === "Cancelled";
    return true;
  });

  const handleDownload = (title: string, orderId: number) => {
    setDownloadNotification(`กำลังดาวน์โหลด "${title}"...`);
    try {
      const sampleContent = `=====================================================
📚 Lampara Books - Digital E-Book Download
=====================================================
ชื่อหนังสือ: ${title}
เลขที่คำสั่งซื้อ: #${orderId}
ผู้ดาวน์โหลด: ${currentUser?.full_name} (${currentUser?.email})
วันที่ดาวน์โหลด: ${new Date().toLocaleDateString("th-TH")}
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

    setTimeout(() => setDownloadNotification(null), 3000);
  };

  if (!currentUser && !loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 mb-4 shadow-[0_0_20px_rgba(229,169,60,0.15)]">
          <User className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
          กรุณาเข้าสู่ระบบก่อน
        </h2>
        <p className="mt-2 text-xs text-[var(--color-muted)] leading-relaxed">
          เพื่อดูประวัติคำสั่งซื้อ ตรวจสอบสถานะการอนุมัติสลิป และดาวน์โหลดไฟล์ e-Book ของคุณ
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="btn-primary text-xs py-2 px-5">
            เข้าสู่ระบบ / สมัครสมาชิก
          </Link>
          <Link href="/books" className="btn-outline text-xs py-2 px-4">
            ดูหนังสือทั้งหมด
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--color-line)]">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-[var(--color-primary)]" />
            <h1 className="font-display text-2xl font-semibold sm:text-3xl text-[var(--color-ink)]">
              ประวัติคำสั่งซื้อของฉัน
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
            รายการสั่งซื้อ e-Book และสถานะการอนุมัติสำหรับบัญชี:{" "}
            <span className="text-[var(--color-ink)] font-medium">
              {currentUser?.full_name} ({currentUser?.email})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-outline text-xs py-1.5 px-3">
            <User className="h-3.5 w-3.5" /> สลับผู้ใช้งาน
          </Link>
          <Link href="/books" className="btn-primary text-xs py-1.5 px-3">
            เลือกซื้อหนังสือเพิ่ม
          </Link>
        </div>
      </div>

      {downloadNotification && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 animate-fade-in">
          <Download className="h-4 w-4" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { id: "all", label: `ทั้งหมด (${orders.length})` },
          { id: "confirmed", label: `อนุมัติแล้ว/ดาวน์โหลดได้ (${orders.filter((o) => o.status === "Confirmed" || o.status === "Completed").length})` },
          { id: "pending", label: `รอตรวจสอบสลิป (${orders.filter((o) => o.status === "Pending").length})` },
          { id: "cancelled", label: `ยกเลิก (${orders.filter((o) => o.status === "Cancelled").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedStatus === tab.id
                ? "bg-[var(--color-primary)] text-[#141618] font-bold shadow-sm"
                : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-[var(--color-muted)]">
            กำลังโหลดข้อมูลคำสั่งซื้อ...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-line)] p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-[var(--color-muted)] opacity-50" />
            <h3 className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
              ไม่พบคำสั่งซื้อในสถานะนี้
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              เมื่อคุณทำการสั่งซื้อ หนังสือและสถานะจะปรากฏในหน้านี้
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isConfirmed = order.status === "Confirmed" || order.status === "Completed";
            const isPending = order.status === "Pending";
            const isCancelled = order.status === "Cancelled";

            return (
              <div
                key={order.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-primary)]/40"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[var(--color-line)]">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-[var(--color-ink)]">
                      คำสั่งซื้อ #{order.id}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {new Date(order.created_at).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isConfirmed
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : isPending
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {isConfirmed && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {isPending && <Clock className="h-3.5 w-3.5" />}
                      {isCancelled && <XCircle className="h-3.5 w-3.5" />}
                      <span>
                        {isConfirmed
                          ? "อนุมัติแล้ว (Confirmed)"
                          : isPending
                          ? "รอตรวจสอบสลิป (Pending)"
                          : "ยกเลิก (Cancelled)"}
                      </span>
                    </span>

                    <span className="font-display font-semibold text-[var(--color-primary)]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="mt-4 space-y-3">
                  {order.items?.map((item) => (
                    <div
                      key={item.book_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-line)]">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--color-ink)]">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[var(--color-muted)]">
                            จำนวน {item.quantity} เล่ม • เล่มละ {formatPrice(item.price_at_time)}
                          </p>
                        </div>
                      </div>

                      {/* Download Button Guard */}
                      {isConfirmed ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(item.title, order.id)}
                          className="btn-primary text-xs py-1.5 px-3 shrink-0"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>ดาวน์โหลด e-Book</span>
                        </button>
                      ) : isPending ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-400 shrink-0">
                          <Lock className="h-3.5 w-3.5" />
                          <span>รอแอดมินอนุมัติสลิป</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--color-muted)] shrink-0">
                          ไม่สามารถดาวน์โหลดได้
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer notes */}
                <div className="mt-4 pt-3 border-t border-[var(--color-line)]/50 flex flex-wrap items-center justify-between text-[11px] text-[var(--color-muted)]">
                  <span>
                    การชำระเงิน: {order.payment?.payment_method || "พร้อมเพย์"} •{" "}
                    {order.payment?.status === "Verified" ? "ตรวจสอบแล้ว" : "รอตรวจสอบ"}
                  </span>
                  <Link
                    href={`/checkout/success?id=${order.id}`}
                    className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
                  >
                    ดูหน้ารายละเอียดคำสั่งซื้อ <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
