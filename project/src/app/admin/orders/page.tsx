"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { getOrders, updateOrderStatus, formatPrice } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, status: "Confirmed" | "Cancelled" | "Pending") => {
    await updateOrderStatus(orderId, status);
    setNotification(`อัปเดตคำสั่งซื้อ #${orderId} เป็นสถานะ "${status}" เรียบร้อยแล้ว`);
    await loadOrders();
    if (inspectOrder && inspectOrder.id === orderId) {
      setInspectOrder((prev) => (prev ? { ...prev, status } : null));
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toString().includes(search.trim()) ||
      o.checkout_name.toLowerCase().includes(search.trim().toLowerCase()) ||
      o.checkout_email.toLowerCase().includes(search.trim().toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return o.status === "Pending";
    if (filterStatus === "confirmed") return o.status === "Confirmed" || o.status === "Completed";
    if (filterStatus === "cancelled") return o.status === "Cancelled";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-[var(--color-primary)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              จัดการคำสั่งซื้อและการตรวจสอบสลิป
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            ตรวจสอบหลักฐานการชำระเงินจำลอง (Mock Slip) และกดยืนยันคำสั่งซื้อเพื่อปลดล็อกสิทธิ์ดาวน์โหลด
          </p>
        </div>
      </div>

      {notification && (
        <div className="rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา Order ID, ชื่อ, หรืออีเมล..."
            className="input-field !pl-9 !py-2 text-xs"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: `ทั้งหมด (${orders.length})` },
            { id: "pending", label: `รอตรวจสอบ (${orders.filter((o) => o.status === "Pending").length})` },
            { id: "confirmed", label: `อนุมัติแล้ว (${orders.filter((o) => o.status === "Confirmed" || o.status === "Completed").length})` },
            { id: "cancelled", label: `ยกเลิก (${orders.filter((o) => o.status === "Cancelled").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filterStatus === tab.id
                  ? "bg-[var(--color-primary)] text-[#141618] font-bold shadow-sm"
                  : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">ลูกค้า</th>
                <th className="py-3 px-4">ยอดเงิน</th>
                <th className="py-3 px-4">วันที่สั่งซื้อ</th>
                <th className="py-3 px-4">หลักฐานสลิป</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4 text-right">การกระทำ (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]/60 text-[var(--color-ink)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                    กำลังโหลดข้อมูลคำสั่งซื้อ...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                    ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isConfirmed = order.status === "Confirmed" || order.status === "Completed";
                  const isPending = order.status === "Pending";

                  return (
                    <tr key={order.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[var(--color-primary)]">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{order.checkout_name}</p>
                        <p className="text-[11px] text-[var(--color-muted)]">{order.checkout_email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold font-display text-[var(--color-ink)]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[var(--color-muted)]">
                        {new Date(order.created_at).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setInspectOrder(order)}
                          className="inline-flex items-center gap-1 rounded border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1 text-[11px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40"
                        >
                          <Eye className="h-3 w-3" />
                          <span>ดูสลิป & รายละเอียด</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isConfirmed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isConfirmed ? "Confirmed" : isPending ? "Pending" : "Cancelled"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {!isConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Confirmed")}
                            className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                            title="อนุมัติสลิปและปลดล็อกดาวน์โหลด"
                          >
                            อนุมัติ
                          </button>
                        )}
                        {order.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, "Cancelled")}
                            className="rounded border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1 text-[11px] text-[var(--color-muted)] hover:text-rose-400 hover:border-rose-500/40 transition-all"
                            title="ยกเลิกคำสั่งซื้อ"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Slip & Details Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[#141618] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
              <div>
                <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">
                  ตรวจสอบคำสั่งซื้อ #{inspectOrder.id}
                </h3>
                <p className="text-xs text-[var(--color-muted)]">
                  ผู้สั่งซื้อ: {inspectOrder.checkout_name} ({inspectOrder.checkout_email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="rounded p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mock Slip Preview Box */}
            <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[#0d0f11] p-4 text-center">
              <span className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                หลักฐานการโอนเงินจำลอง (Mock Payment Slip)
              </span>
              <div className="mt-3 mx-auto max-w-[280px] rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-left font-mono text-xs space-y-2 shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-[10px] text-neutral-400">
                  <span>TRANSFER SLIP</span>
                  <span className="text-emerald-400">SUCCESS</span>
                </div>
                <div className="text-[11px]">
                  <p className="text-neutral-400 text-[10px]">ไปยังบัญชี:</p>
                  <p className="text-white font-semibold">ร้าน Lampara Books</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-[10px]">ยอดเงินที่ชำระ:</p>
                  <p className="text-emerald-400 font-bold text-base font-sans">{formatPrice(inspectOrder.total)}</p>
                </div>
                <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800">
                  <p>วิธี: {inspectOrder.payment?.payment_method || "พร้อมเพย์"}</p>
                  <p>ไฟล์: {inspectOrder.payment?.slip_url || "mock-slip.jpg"}</p>
                </div>
              </div>
            </div>

            {/* Items list */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-ink)] mb-2">
                รายการหนังสือที่สั่งซื้อ:
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {inspectOrder.items?.map((it) => (
                  <div key={it.book_id} className="flex justify-between items-center text-xs p-2 rounded bg-[var(--color-surface-2)]">
                    <span className="text-[var(--color-ink)]">{it.title} × {it.quantity}</span>
                    <span className="font-semibold text-[var(--color-primary)]">{formatPrice(it.price_at_time * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons inside modal */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-line)]">
              <button
                type="button"
                onClick={() => handleStatusChange(inspectOrder.id, "Cancelled")}
                className="btn-outline text-xs text-rose-400 hover:border-rose-500/50"
              >
                ปฏิเสธ / ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(inspectOrder.id, "Confirmed")}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>อนุมัติคำสั่งซื้อ (Confirm)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
