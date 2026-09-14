"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X, User, ShieldCheck, ClipboardList } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getDemoCurrentUser } from "@/lib/api";
import type { User as UserType } from "@/lib/types";

export default function Header() {
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    setCurrentUser(getDemoCurrentUser());
    const handleUserChange = () => setCurrentUser(getDemoCurrentUser());
    window.addEventListener("user-changed", handleUserChange);
    return () => window.removeEventListener("user-changed", handleUserChange);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/books?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/books");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[#141618]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] border border-[var(--color-line)] transition-all group-hover:border-[var(--color-primary)] group-hover:shadow-[0_0_12px_rgba(229,169,60,0.3)]">
            <span className="font-display text-base font-bold text-[var(--color-primary)]">L</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold tracking-wide text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)]">
              Lampara
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-sans -mt-1">
              Books
            </span>
          </div>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-md items-center md:flex"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง, หรือเนื้อหา..."
              className="input-field !pl-10 !py-2 text-xs sm:text-sm bg-[var(--color-surface)]/80 border-[var(--color-line)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
            />
          </div>
        </form>

        {/* Navigation links & user/admin actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/books"
              className={`text-sm transition-colors hover:text-[var(--color-primary)] font-medium ${
                pathname === "/books"
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              หนังสือทั้งหมด
            </Link>

            <Link
              href="/orders"
              className={`text-sm transition-colors hover:text-[var(--color-primary)] font-medium flex items-center gap-1.5 ${
                pathname === "/orders"
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>คำสั่งซื้อของฉัน</span>
            </Link>

            {/* Admin Backoffice Link - แสดงเฉพาะ Admin เท่านั้น */}
            {currentUser?.role_id === 1 && (
              <Link
                href="/admin"
                className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-2.5 py-1 text-xs font-semibold transition-all ${
                  pathname.startsWith("/admin")
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[#141618]"
                    : "border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-primary)] hover:border-[var(--color-primary)]/60"
                }`}
                title="ระบบบริหารจัดการร้านหลังบ้าน"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>หลังบ้าน (Admin)</span>
              </Link>
            )}
          </nav>

          {/* User Profile / Login */}
          <div className="hidden items-center sm:flex">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              title={currentUser ? "จัดการบัญชี / โปรไฟล์" : "เข้าสู่ระบบ / สมัครสมาชิก"}
            >
              <User className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span className="max-w-[120px] truncate">
                {currentUser?.full_name ? currentUser.full_name.split(" ")[0] : "เข้าสู่ระบบ"}
              </span>
              {currentUser && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    currentUser.role_id === 1
                      ? "bg-[var(--color-primary)] text-[#141618]"
                      : "bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-line)]"
                  }`}
                >
                  {currentUser.role_id === 1 ? "ADMIN" : "ลูกค้า"}
                </span>
              )}
            </Link>
          </div>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 rounded-[var(--radius-md)] border border-transparent bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] transition-all hover:border-[var(--color-line)] hover:bg-[var(--color-surface-2)]"
            aria-label="ตะกร้าสินค้า"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-[var(--color-ink)]" />
            <span className="hidden sm:inline text-xs font-medium text-[var(--color-muted)]">
              ตะกร้า
            </span>
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[11px] font-bold text-[#141618] shadow-[0_0_10px_rgba(229,169,60,0.5)]"
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-[var(--radius-md)] p-2 text-[var(--color-ink)] md:hidden"
            aria-label="เมนู"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ค้นหาหนังสือ..."
                className="input-field !pl-10 text-xs"
              />
            </div>
          </form>
          <div className="space-y-1">
            <Link
              href="/books"
              className="block py-2 text-sm text-[var(--color-ink)] font-medium"
            >
              📚 หนังสือทั้งหมด
            </Link>
            <Link
              href="/orders"
              className="block py-2 text-sm text-[var(--color-ink)] font-medium"
            >
              📜 คำสั่งซื้อของฉัน (My Orders)
            </Link>
            {currentUser?.role_id === 1 && (
              <Link
                href="/admin"
                className="block py-2 text-sm text-[var(--color-primary)] font-semibold"
              >
                ⚙️ ระบบหลังบ้าน (Admin Backoffice)
              </Link>
            )}
            <Link
              href="/login"
              className="flex items-center justify-between py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--color-primary)]" />
                <span>
                  {currentUser ? currentUser.full_name : "เข้าสู่ระบบ / สมัครสมาชิก"}
                </span>
              </div>
              {currentUser && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    currentUser.role_id === 1
                      ? "bg-[var(--color-primary)] text-[#141618]"
                      : "bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-line)]"
                  }`}
                >
                  {currentUser.role_id === 1 ? "ADMIN" : "ลูกค้า"}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
