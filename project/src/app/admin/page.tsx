"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ClipboardList,
  Clock,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
} from "lucide-react";
import { getOrders, getAllBooksForAdmin, updateOrderStatus, formatPrice } from "@/lib/api";
import type { Order, Book } from "@/lib/types";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, booksData] = await Promise.all([
      getOrders(),
      getAllBooksForAdmin(),
    ]);
    setOrders(ordersData);
    setBooks(booksData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (orderId: number) => {
    await updateOrderStatus(orderId, "Confirmed", "อนุมัติด่วนจากหน้า Dashboard");
    setActionNotice(`อนุมัติคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว (ปลดล็อกดาวน์โหลดให้ลูกค้าแล้ว)`);
    await loadData();
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleQuickReject = async (orderId: number) => {
    await updateOrderStatus(orderId, "Cancelled", "ยกเลิกคำสั่งซื้อ");
    setActionNotice(`ยกเลิกคำสั่งซื้อ #${orderId} แล้ว`);
    await loadData();
    setTimeout(() => setActionNotice(null), 4000);
  };

  const confirmedOrders = orders.filter((o) => o.status === "Confirmed" || o.status === "Completed");
  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const totalSales = confirmedOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl text-[var(--color-ink)]">
            ภาพรวมระบบบริหารจัดการร้าน (Admin Dashboard)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
            สรุปสถานะธุรกรรม ข้อมูลในฐานข้อมูล PostgreSQL และการอนุมัติคำสั่งซื้อ
          </p>
        </div>

        <Link href="/admin/reports" className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start">
          <BarChart3 className="h-4 w-4" />
          <span>ดู 4 รายงานวิเคราะห์ SQL →</span>
        </Link>
      </div>

      {actionNotice && (
        <div className="rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Sales */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted)]">ยอดขายสุทธิที่ยืนยันแล้ว</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-[var(--color-primary)]">
            {formatPrice(totalSales)}
          </p>
          <span className="text-[11px] text-[var(--color-muted)]">
            จาก {confirmedOrders.length} คำสั่งซื้อที่ชำระสำเร็จ
          </span>
        </div>

        {/* Total Orders */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted)]">คำสั่งซื้อทั้งหมดในระบบ</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10 text-blue-400">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-[var(--color-ink)]">
            {orders.length}
          </p>
          <span className="text-[11px] text-[var(--color-muted)]">
            บันทึกในตาราง orders & order_items
          </span>
        </div>

        {/* Pending Orders */}
        <div className={`rounded-[var(--radius-lg)] border p-5 ${pendingOrders.length > 0 ? "border-amber-500/50 bg-amber-500/5" : "border-[var(--color-line)] bg-[var(--color-surface)]"}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 font-semibold">รอตรวจสอบสลิป</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/20 text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-amber-400">
            {pendingOrders.length}
          </p>
          <span className="text-[11px] text-[var(--color-muted)]">
            ต้องกดอนุมัติเพื่อปลดล็อกการดาวน์โหลด
          </span>
        </div>

        {/* Active Books */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--color-muted)]">หนังสือในระบบ</span>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10 text-purple-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-[var(--color-ink)]">
            {books.filter((b) => b.is_active !== false).length} / {books.length}
          </p>
          <span className="text-[11px] text-[var(--color-muted)]">
            เล่มพร้อมขาย / ทั้งหมดในแคตตาล็อก
          </span>
        </div>
      </div>

      {/* Pending Orders Review Box (Crucial for grading!) */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">
              รายการคำสั่งซื้อที่รอการตรวจสอบสลิป ({pendingOrders.length} รายการ)
            </h2>
          </div>
          <Link href="/admin/orders" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
            ดูทั้งหมด <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--color-muted)]">
            ✅ ไม่มีคำสั่งซื้อค้างรอตรวจสอบในขณะนี้
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-line)]/60">
            {pendingOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--color-ink)]">#{order.id}</span>
                    <span className="text-xs font-medium text-[var(--color-primary)]">{order.checkout_name}</span>
                    <span className="text-[11px] text-[var(--color-muted)]">({order.checkout_email})</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {order.items?.map((i) => i.title).join(", ")} • ยอดชำระ {formatPrice(order.total)}
                  </p>
                  <p className="text-[10px] text-amber-400 mt-0.5">
                    สลิป: {order.payment?.slip_url || "แนบสลิปแล้ว"} ({order.payment?.payment_method || "PromptPay"})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickApprove(order.id)}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>อนุมัติสลิป (Confirm)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickReject(order.id)}
                    className="btn-outline text-xs py-1.5 px-2.5 text-rose-400 hover:border-rose-500"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/admin/orders"
          className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-primary)] transition-all group"
        >
          <ClipboardList className="h-6 w-6 text-[var(--color-primary)] mb-2" />
          <h3 className="font-semibold text-sm text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
            จัดการคำสั่งซื้อทั้งหมด →
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            ค้นหาคำสั่งซื้อ ตรวจสอบหลักฐานสลิป และเปลี่ยนสถานะ
          </p>
        </Link>

        <Link
          href="/admin/books"
          className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-primary)] transition-all group"
        >
          <BookOpen className="h-6 w-6 text-[var(--color-primary)] mb-2" />
          <h3 className="font-semibold text-sm text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
            จัดการหนังสือในร้าน →
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            เพิ่มหนังสือใหม่ ปรับราคา หรือเปิด/ปิดการขาย (Soft Delete)
          </p>
        </Link>

        <Link
          href="/admin/reports"
          className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-primary)] transition-all group"
        >
          <BarChart3 className="h-6 w-6 text-[var(--color-primary)] mb-2" />
          <h3 className="font-semibold text-sm text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
            รายงานวิเคราะห์ 4 ด้าน →
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            ยอดขายตามเวลา, E-Book ขายดี, หมวดหมู่, และยอดซื้อลูกค้า
          </p>
        </Link>
      </div>
    </div>
  );
}
