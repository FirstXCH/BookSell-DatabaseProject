"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  BarChart3,
  Users,
  Store,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  LogIn,
  Loader2,
} from "lucide-react";
import { getDemoCurrentUser } from "@/lib/api";
import type { User as UserType } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrentUser(getDemoCurrentUser());
    setMounted(true);

    const handleUserChange = () => {
      setCurrentUser(getDemoCurrentUser());
    };
    window.addEventListener("user-changed", handleUserChange);
    return () => window.removeEventListener("user-changed", handleUserChange);
  }, []);

  const navItems = [
    { href: "/admin", label: "ภาพรวม (Dashboard)", icon: LayoutDashboard, exact: true },
    { href: "/admin/orders", label: "จัดการคำสั่งซื้อ & สลิป", icon: ClipboardList },
    { href: "/admin/books", label: "จัดการแคตตาล็อกหนังสือ", icon: BookOpen },
    { href: "/admin/reports", label: "4 รายงานวิเคราะห์ (SQL)", icon: BarChart3 },
    { href: "/admin/users", label: "จัดการผู้ใช้ & สิทธิ์", icon: Users },
  ];

  // 1. ระหว่างรอโหลดสถานะ Client
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0f11] text-[var(--color-muted)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          <span className="text-xs">กำลังตรวจสอบสิทธิ์การเข้าถึงระบบหลังบ้าน...</span>
        </div>
      </div>
    );
  }

  // 2. ป้องกันสิทธิ์: หากไม่ได้เป็น Admin (role_id !== 1) ให้บล็อก 100%
  if (!currentUser || currentUser.role_id !== 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0f11] px-4 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400 mb-3">
          403 Access Denied • สิทธิ์การเข้าถึงไม่เพียงพอ
        </div>

        <h1 className="font-display text-2xl font-bold sm:text-3xl text-[var(--color-ink)]">
          สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin Only)
        </h1>

        <p className="mt-3 max-w-md text-sm text-[var(--color-muted)] leading-relaxed">
          ระบบตรวจพบว่าคุณกำลังใช้งานในฐานะ:{" "}
          <strong className="text-[var(--color-ink)]">
            {currentUser ? `"${currentUser.full_name}" (ลูกค้าทั่วไป)` : "ผู้เยี่ยมชมที่ยังไม่เข้าสู่ระบบ"}
          </strong>{" "}
          บัญชีลูกค้าไม่มีสิทธิ์เข้าถึง ดูรายงาน หรือจัดการข้อมูลหลังบ้าน
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" /> กลับสู่หน้าร้าน (Storefront)
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-[#141618] transition-all hover:bg-[var(--color-primary)]/90 shadow-md shadow-[rgba(229,169,60,0.2)]"
          >
            <LogIn className="h-4 w-4" /> เข้าสู่ระบบด้วยบัญชี Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f11] text-[var(--color-ink)] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--color-line)] bg-[#141618] p-4 md:p-6 shrink-0 flex flex-col justify-between">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-[var(--color-line)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[#141618] font-bold text-lg shadow-[0_0_12px_rgba(229,169,60,0.4)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-semibold text-sm tracking-wide text-[var(--color-ink)]">
                Lampara Backoffice
              </span>
              <p className="text-[10px] text-[var(--color-primary)] font-semibold uppercase tracking-wider">
                ผู้ดูแลระบบ (Admin Portal)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[#141618] font-bold shadow-md shadow-[rgba(229,169,60,0.2)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#141618]" : "text-[var(--color-primary)]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom shortcut to Storefront */}
        <div className="pt-6 mt-6 border-t border-[var(--color-line)]">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] py-2 text-xs font-medium text-[var(--color-muted)] transition-all hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/50"
          >
            <Store className="h-4 w-4" />
            <span>กลับสู่หน้าร้าน (Storefront)</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
