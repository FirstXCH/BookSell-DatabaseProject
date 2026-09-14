"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Award,
  PieChart,
  Users,
  Download,
  Code2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  getSalesReport,
  getTopBooksReport,
  getCategorySalesReport,
  getCustomerReport,
  formatPrice,
} from "@/lib/api";
import type {
  SalesReportRow,
  TopBookReportRow,
  CategorySalesReportRow,
  CustomerReportRow,
} from "@/lib/types";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const [salesReport, setSalesReport] = useState<SalesReportRow[]>([]);
  const [topBooksReport, setTopBooksReport] = useState<TopBookReportRow[]>([]);
  const [categoryReport, setCategoryReport] = useState<CategorySalesReportRow[]>([]);
  const [customerReport, setCustomerReport] = useState<CustomerReportRow[]>([]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    const [r1, r2, r3, r4] = await Promise.all([
      getSalesReport(),
      getTopBooksReport(),
      getCategorySalesReport(),
      getCustomerReport(),
    ]);
    setSalesReport(r1);
    setTopBooksReport(r2);
    setCategoryReport(r3);
    setCustomerReport(r4);
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const downloadName = `${filename}_${timestamp}.csv`;
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`ส่งออกไฟล์ "${downloadName}" ข้อมูลอัปเดตล่าสุด (${rows.length} แถว) เรียบร้อยแล้ว!`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[var(--color-primary)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              รายงานวิเคราะห์จากข้อมูลจริง (4 Analytical Reports)
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            ตามข้อกำหนดใบงานข้อ 5: รัน Query จากฐานข้อมูล PostgreSQL เชื่อมโยงหลายตารางและส่งออกไฟล์ได้
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          disabled={loading}
          className="btn-outline text-xs py-2 px-3.5 flex items-center gap-2 self-start"
          title="ดึงข้อมูลคำสั่งซื้อล่าสุดจากระบบและคำนวณรายงานใหม่"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[var(--color-primary)]" : ""}`} />
          <span>{loading ? "กำลังคำนวณสด..." : "รีเฟรชข้อมูลล่าสุด (Live)"}</span>
        </button>
      </div>

      {exportNotice && (
        <div className="rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { id: 1, label: "1. ยอดขายตามช่วงเวลา", icon: Calendar, subtitle: "JOIN, GROUP BY, SUM, COUNT, AVG" },
          { id: 2, label: "2. E-Book ขายดีที่สุด", icon: Award, subtitle: "JOIN 4 ตาราง, GROUP BY, LIMIT 5" },
          { id: 3, label: "3. ยอดขายตามหมวดหมู่", icon: PieChart, subtitle: "JOIN หลายตาราง, GROUP BY, SUM" },
          { id: 4, label: "4. ลูกค้าและยอดสะสม", icon: Users, subtitle: "JOIN, GROUP BY, HAVING, CASE WHEN" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-start rounded-[var(--radius-md)] border p-3.5 text-left transition-all ${
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-surface-2)] shadow-md shadow-[rgba(229,169,60,0.15)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]"
              }`}
            >
              <div className="flex items-center gap-2 font-display text-xs font-semibold text-[var(--color-ink)]">
                <Icon className={`h-4 w-4 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`} />
                <span className={isActive ? "text-[var(--color-primary)]" : ""}>{tab.label}</span>
              </div>
              <span className="mt-1 text-[10px] text-[var(--color-muted)] font-mono">{tab.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Report 1 Content */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <div>
              <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                รายงานที่ 1: ยอดขายตามช่วงเวลา (Sales Over Time by Month)
              </h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                คำถาม: ยอดขาย จำนวนคำสั่งซื้อ และค่าเฉลี่ยต่อคำสั่งซื้อ (AOV) เปลี่ยนไปอย่างไรตามเดือน?
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                exportCSV(
                  "sales_over_time_report",
                  ["เดือน", "จำนวนคำสั่งซื้อ", "ยอดขายรวม (บาท)", "ค่าเฉลี่ยต่อออเดอร์ (บาท)"],
                  salesReport.map((r) => [r.sale_month, r.total_orders, r.total_sales, r.avg_order_value])
                )
              }
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* SQL Snippet Preview */}
          <div className="rounded-[var(--radius-md)] bg-[#0d0f11] border border-[var(--color-line)] p-3.5 font-mono text-[11px] text-[var(--color-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>SQL Query สำหรับรายงานที่ 1:</span>
            </div>
            <pre className="overflow-x-auto text-[var(--color-ink)]">
{`SELECT 
    TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month,
    COUNT(o.id) AS total_orders,
    SUM(o.total) AS total_sales,
    ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY sale_month DESC;`}
            </pre>
          </div>

          {/* Data Table */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold border-b border-[var(--color-line)]">
                <tr>
                  <th className="py-3 px-4">เดือนที่มียอดขาย</th>
                  <th className="py-3 px-4">จำนวนคำสั่งซื้อ</th>
                  <th className="py-3 px-4">ยอดขายรวมสุทธิ</th>
                  <th className="py-3 px-4">ค่าเฉลี่ยต่อคำสั่งซื้อ (AOV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]/60">
                {salesReport.map((row) => (
                  <tr key={row.sale_month} className="hover:bg-[var(--color-surface-2)]/40">
                    <td className="py-3 px-4 font-bold text-[var(--color-primary)] font-mono">
                      {row.sale_month}
                    </td>
                    <td className="py-3 px-4">{row.total_orders} ออเดอร์</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400 font-display text-sm">
                      {formatPrice(row.total_sales)}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-ink)] font-mono">
                      {formatPrice(row.avg_order_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 2 Content */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <div>
              <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                รายงานที่ 2: E-Book ขายดีที่สุด (Top-Selling Books)
              </h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                คำถาม: E Book ใดขายได้มากที่สุด 5 อันดับแรกตามจำนวนเล่มและยอดขาย?
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                exportCSV(
                  "top_selling_books_report",
                  ["รหัสหนังสือ", "ชื่อหนังสือ", "ผู้แต่ง", "หมวดหมู่", "จำนวนเล่มที่ขายได้", "รายได้รวม (บาท)"],
                  topBooksReport.map((r) => [r.book_id, r.title, r.author_name, r.category_name, r.total_sold_copies, r.total_revenue])
                )
              }
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[#0d0f11] border border-[var(--color-line)] p-3.5 font-mono text-[11px] text-[var(--color-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>SQL Query สำหรับรายงานที่ 2:</span>
            </div>
            <pre className="overflow-x-auto text-[var(--color-ink)]">
{`SELECT 
    b.id AS book_id,
    b.title,
    a.name AS author_name,
    c.name AS category_name,
    SUM(oi.quantity) AS total_sold_copies,
    SUM(oi.quantity * oi.price_at_time) AS total_revenue
FROM order_items oi
JOIN books b ON oi.book_id = b.id
LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN categories c ON b.category_id = c.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY b.id, b.title, a.name, c.name
ORDER BY total_sold_copies DESC, total_revenue DESC
LIMIT 5;`}
            </pre>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold border-b border-[var(--color-line)]">
                <tr>
                  <th className="py-3 px-4">อันดับ</th>
                  <th className="py-3 px-4">ชื่อหนังสือ</th>
                  <th className="py-3 px-4">ผู้แต่ง</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">ยอดขาย (เล่ม)</th>
                  <th className="py-3 px-4">รายได้รวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]/60">
                {topBooksReport.map((row, idx) => (
                  <tr key={row.book_id} className="hover:bg-[var(--color-surface-2)]/40">
                    <td className="py-3 px-4 font-bold text-amber-400 font-mono">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--color-ink)]">
                      {row.title}
                    </td>
                    <td className="py-3 px-4 text-[var(--color-muted)]">{row.author_name}</td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] border border-[var(--color-line)]">
                        {row.category_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--color-primary)] font-mono">
                      {row.total_sold_copies} เล่ม
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400 font-display">
                      {formatPrice(row.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3 Content */}
      {activeTab === 3 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <div>
              <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                รายงานที่ 3: ยอดขายตามหมวดหมู่ (Sales by Category)
              </h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                คำถาม: หมวดหมู่ใดสร้างยอดขายและจำนวนรายการขายได้สูงสุด?
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                exportCSV(
                  "sales_by_category_report",
                  ["รหัสหมวดหมู่", "ชื่อหมวดหมู่", "จำนวนออเดอร์", "จำนวนเล่มที่ขายได้", "ยอดขายรวม (บาท)"],
                  categoryReport.map((r) => [r.category_id, r.category_name, r.total_orders, r.total_books_sold, r.total_category_revenue])
                )
              }
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[#0d0f11] border border-[var(--color-line)] p-3.5 font-mono text-[11px] text-[var(--color-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>SQL Query สำหรับรายงานที่ 3:</span>
            </div>
            <pre className="overflow-x-auto text-[var(--color-ink)]">
{`SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.quantity) AS total_books_sold,
    SUM(oi.quantity * oi.price_at_time) AS total_category_revenue
FROM categories c
JOIN books b ON c.id = b.category_id
JOIN order_items oi ON b.id = oi.book_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY c.id, c.name
ORDER BY total_category_revenue DESC;`}
            </pre>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold border-b border-[var(--color-line)]">
                <tr>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">จำนวนออเดอร์ที่มีการซื้อ</th>
                  <th className="py-3 px-4">จำนวนเล่มที่ขายได้รวม</th>
                  <th className="py-3 px-4">ยอดขายรวมของหมวดหมู่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]/60">
                {categoryReport.map((row) => (
                  <tr key={row.category_id} className="hover:bg-[var(--color-surface-2)]/40">
                    <td className="py-3 px-4 font-bold text-[var(--color-ink)]">
                      {row.category_name}
                    </td>
                    <td className="py-3 px-4">{row.total_orders} ออเดอร์</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                      {row.total_books_sold} เล่ม
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400 font-display text-sm">
                      {formatPrice(row.total_category_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 4 Content */}
      {activeTab === 4 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <div>
              <h2 className="font-display font-semibold text-sm text-[var(--color-ink)]">
                รายงานที่ 4: พฤติกรรมลูกค้าและสถานะคำสั่งซื้อ (Customer Lifetime Value)
              </h2>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                คำถาม: ลูกค้ารายใดซื้อบ่อยหรือมียอดซื้อสะสมสูง และแต่ละสถานะมีจำนวนเท่าใด?
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                exportCSV(
                  "customer_lifetime_value_report",
                  ["User ID", "ชื่อลูกค้า", "อีเมล", "ออเดอร์ทั้งหมด", "ยอดซื้อสะสม (บาท)", "ออเดอร์สำเร็จ", "รอตรวจสอบ", "ยกเลิก"],
                  customerReport.map((r) => [r.user_id, r.full_name, r.email, r.total_orders, r.total_spent, r.confirmed_orders, r.pending_orders, r.cancelled_orders])
                )
              }
              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[#0d0f11] border border-[var(--color-line)] p-3.5 font-mono text-[11px] text-[var(--color-muted)]">
            <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold mb-1.5">
              <Code2 className="h-3.5 w-3.5" />
              <span>SQL Query สำหรับรายงานที่ 4:</span>
            </div>
            <pre className="overflow-x-auto text-[var(--color-ink)]">
{`SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.status IN ('Confirmed', 'Completed', 'Paid') THEN o.total ELSE 0 END) AS total_spent,
    COUNT(CASE WHEN o.status IN ('Confirmed', 'Completed', 'Paid') THEN 1 END) AS confirmed_orders,
    COUNT(CASE WHEN o.status = 'Pending' THEN 1 END) AS pending_orders,
    COUNT(CASE WHEN o.status = 'Cancelled' THEN 1 END) AS cancelled_orders
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.full_name, u.email
HAVING COUNT(o.id) >= 1
ORDER BY total_spent DESC;`}
            </pre>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold border-b border-[var(--color-line)]">
                <tr>
                  <th className="py-3 px-4">ลูกค้า</th>
                  <th className="py-3 px-4">ออเดอร์ทั้งหมด</th>
                  <th className="py-3 px-4">ยอดซื้อสะสม</th>
                  <th className="py-3 px-4 text-emerald-400">อนุมัติสำเร็จ</th>
                  <th className="py-3 px-4 text-amber-400">รอตรวจสลิป</th>
                  <th className="py-3 px-4 text-rose-400">ยกเลิก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]/60">
                {customerReport.map((row) => (
                  <tr key={row.user_id} className="hover:bg-[var(--color-surface-2)]/40">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[var(--color-ink)]">{row.full_name}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">{row.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">{row.total_orders} รายการ</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400 font-display text-sm">
                      {formatPrice(row.total_spent)}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-mono font-bold">
                      {row.confirmed_orders}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-mono font-bold">
                      {row.pending_orders}
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-mono font-bold">
                      {row.cancelled_orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
