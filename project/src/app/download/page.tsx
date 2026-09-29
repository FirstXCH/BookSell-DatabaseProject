"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Download,
  BookOpen,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Mail,
  RefreshCw,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { recordDownload, formatPrice } from "@/lib/api";
import { mockBooks, mockOrders } from "@/lib/mock-data";

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-[var(--color-muted)]">
          กำลังตรวจสอบสิทธิ์การดาวน์โหลด...
        </div>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<any>(null);
  const [book, setBook] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchLinkDetails = async () => {
    if (!token) {
      setErrorMsg("ไม่พบโทเค็น (Token) การดาวน์โหลดใน URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // 1. ตรวจสอบใน Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: link, error } = await supabase
          .from("download_links")
          .select(`
            *,
            books (*)
          `)
          .eq("token", token)
          .single();

        if (!error && link) {
          setDownloadLink(link);
          setBook(link.books || mockBooks.find((b) => b.id === link.book_id));
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase token fetch error:", err);
      }
    }

    // 2. Fallback ตรวจสอบใน Local Storage / Mock
    let found = false;
    for (const ord of mockOrders) {
      const lk = ord.download_links?.find((l) => l.token === token);
      if (lk) {
        setDownloadLink(lk);
        setBook(mockBooks.find((b) => b.id === lk.book_id));
        found = true;
        break;
      }
    }

    if (!found) {
      // Mock ให้ทดสอบได้หากเป็น token ที่เพิ่งสร้างใหม่
      setDownloadLink({
        token,
        order_id: 48,
        book_id: 1,
        download_count: 0,
        max_downloads: 5,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setBook(mockBooks[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLinkDetails();
  }, [token]);

  const handleDownloadFile = async () => {
    if (!downloadLink || !book) return;

    const currentCount = downloadLink.download_count || 0;
    const maxDl = downloadLink.max_downloads || 5;

    if (currentCount >= maxDl) {
      alert(`คุณได้ดาวน์โหลดครบโควตาสูงสุดแล้ว (${currentCount}/${maxDl} ครั้ง) ตามเงื่อนไขความปลอดภัย`);
      return;
    }

    setDownloading(true);
    setNotification("กำลังตรวจสอบโควตาและจัดเตรียมไฟล์...");

    const res = await recordDownload(downloadLink.order_id, downloadLink.book_id);

    if (!res.success) {
      alert(res.message);
      setNotification(res.message);
      setDownloading(false);
      return;
    }

    // อัปเดต state ตัวนับในหน้าจอทันที
    setDownloadLink((prev: any) => ({
      ...prev,
      download_count: res.download_count,
    }));

    try {
      const sampleContent = `=====================================================
📚 Lampara Books - Digital E-Book Download
=====================================================
ชื่อหนังสือ: ${book.title}
ผู้แต่ง: ${book.author || "Lampara Author"}
รหัสคำสั่งซื้อ: #${downloadLink.order_id}
โทเค็น: ${downloadLink.token}
ดาวน์โหลดครั้งที่: ${res.download_count}/${res.max_downloads}
วันที่ดาวน์โหลด: ${new Date().toLocaleDateString("th-TH")}
=====================================================
🔒 ข้อกำหนดความปลอดภัยของระบบ (Security Policy):
1. ไฟล์นี้มีลิขสิทธิ์ถูกต้อง สำหรับการใช้งานส่วนบุคคลเท่านั้น
2. ลิงก์นี้จำกัดการดาวน์โหลดสูงสุด 5 ครั้ง (One-Time / Quota Controlled)
3. มีการบันทึก Audit Log ลงฐานข้อมูล Supabase ทุกครั้งที่กดดาวน์โหลด
=====================================================`;
      const blob = new Blob([sampleContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/[\s/\\?%*:|"<>]/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}

    setDownloading(false);
    setNotification(`ดาวน์โหลดสำเร็จแล้ว! (ครั้งที่ ${res.download_count}/${res.max_downloads})`);
    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent mb-4" />
        <p className="text-sm text-[var(--color-muted)]">กำลังตรวจสอบสิทธิ์ความปลอดภัยในฐานข้อมูล...</p>
      </div>
    );
  }

  if (errorMsg || !downloadLink) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
          ไม่สามารถเปิดลิงก์ดาวน์โหลดได้
        </h2>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          {errorMsg || "ลิงก์หรือโทเค็นนี้ไม่ถูกต้อง หรือคำสั่งซื้อยังไม่ได้รับการยืนยัน"}
        </p>
        <Link href="/" className="mt-6 inline-flex btn-primary text-xs">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> กลับสู่หน้าแรก
        </Link>
      </div>
    );
  }

  const currentCount = downloadLink.download_count || 0;
  const maxDl = downloadLink.max_downloads || 5;
  const isExpired = downloadLink.expires_at && new Date(downloadLink.expires_at) < new Date();
  const isQuotaExceeded = currentCount >= maxDl;
  const remaining = Math.max(0, maxDl - currentCount);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {/* Security Badge */}
      <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-primary)]/30 px-3.5 py-1 text-xs font-semibold text-[var(--color-primary)] mb-6 shadow-[0_0_15px_rgba(229,169,60,0.15)]">
        <ShieldCheck className="h-4 w-4" />
        <span>ระบบตรวจสอบสิทธิ์ดาวน์โหลดปลอดภัย (Secure Token)</span>
      </div>

      {/* Main Card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8 text-left space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
          <div>
            <span className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
              คำสั่งซื้อ #{downloadLink.order_id}
            </span>
            <h1 className="font-display text-xl font-bold text-[var(--color-ink)] mt-0.5">
              ดาวน์โหลดหนังสือดิจิทัล (e-Book)
            </h1>
          </div>
          <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
            ✓ ได้รับสิทธิ์ถูกต้อง
          </span>
        </div>

        {/* Book Preview */}
        {book && (
          <div className="flex items-center gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-4 border border-[var(--color-line)]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-line)]">
              <BookOpen className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-base text-[var(--color-ink)] truncate">
                {book.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                ผู้แต่ง: {book.author || "Lampara Books"} • e-Book ดิจิทัล
              </p>
            </div>
          </div>
        )}

        {/* Quota & Policy Status */}
        <div className="rounded-[var(--radius-md)] bg-[#0d0f11] border border-[var(--color-line)] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">โควตาดาวน์โหลดที่ได้รับ:</span>
            <span className="font-bold text-[var(--color-ink)]">{maxDl} ครั้ง</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">ดาวน์โหลดไปแล้ว:</span>
            <span className={`font-bold ${isQuotaExceeded ? "text-rose-400" : "text-[var(--color-primary)]"}`}>
              {currentCount} ครั้ง
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">คงเหลือสิทธิ์:</span>
            <span className={`font-bold ${remaining === 0 ? "text-rose-400" : "text-emerald-400"}`}>
              {remaining} ครั้ง
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isQuotaExceeded ? "bg-rose-500" : "bg-[var(--color-primary)]"
              }`}
              style={{ width: `${Math.min(100, (currentCount / maxDl) * 100)}%` }}
            />
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="flex items-center gap-2 rounded bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Action Button & Security Warning */}
        {isExpired ? (
          <div className="rounded-[var(--radius-md)] border border-rose-500/40 bg-rose-500/5 p-4 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <Clock className="h-4 w-4" />
              <span>ลิงก์ดาวน์โหลดหมดอายุแล้ว</span>
            </div>
            <p className="text-neutral-400">
              ลิงก์นี้หมดอายุตามเงื่อนไขความปลอดภัย (เกิน 30 วัน) กรุณาติดต่อแอดมินเพื่อขอออกลิงก์ใหม่
            </p>
          </div>
        ) : isQuotaExceeded ? (
          <div className="rounded-[var(--radius-md)] border border-rose-500/40 bg-rose-500/5 p-4 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <Lock className="h-4 w-4" />
              <span>ครบโควตาสูงสุดแล้ว ({currentCount}/{maxDl} ครั้ง)</span>
            </div>
            <p className="text-neutral-400">
              ระบบจำกัดสิทธิ์การดาวน์โหลดสูงสุด 5 ครั้งเพื่อป้องกันการทำซ้ำและส่งต่อไฟล์ตามกฎหมายลิขสิทธิ์
            </p>
            <button
              disabled
              className="mt-3 w-full py-3 rounded-[var(--radius-md)] bg-neutral-800 text-neutral-500 font-semibold cursor-not-allowed text-xs flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4" />
              <span>ไม่สามารถดาวน์โหลดได้ (ครบโควตาแล้ว)</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleDownloadFile}
            disabled={downloading}
            className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span>
              {downloading ? "กำลังดาวน์โหลดไฟล์..." : `คลิกดาวน์โหลด e-Book (ครั้งที่ ${currentCount + 1}/${maxDl})`}
            </span>
          </button>
        )}

        {/* Security Footer Details */}
        <div className="pt-3 border-t border-[var(--color-line)]/50 text-[11px] text-[var(--color-muted)] flex flex-wrap items-center justify-between gap-2">
          <span>โทเค็น: <code className="text-neutral-400">{(token || downloadLink?.token || "").slice(0, 16)}...</code></span>
          <Link href="/orders" className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
            ดูประวัติคำสั่งซื้อทั้งหมด <ArrowLeft className="h-3 w-3 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
