"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-line)] bg-[#141618]/95 backdrop-blur-md md:hidden"
    >
      <div className="flex h-14 items-center justify-around px-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors ${
            pathname === "/"
              ? "text-[var(--color-primary)] font-semibold"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[10px]">หน้าแรก</span>
        </Link>

        <Link
          href="/books"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors ${
            pathname.startsWith("/books")
              ? "text-[var(--color-primary)] font-semibold"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          <span className="text-[10px]">หนังสือ</span>
        </Link>

        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-1 w-16 py-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          aria-label="เปิดตะกร้าสินค้า"
        >
          <div className="relative">
            <ShoppingBag className="h-4.5 w-4.5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold text-[#141618] shadow-[0_0_8px_rgba(229,169,60,0.4)]">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">ตะกร้า</span>
        </button>

        <Link
          href="/login"
          className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors ${
            pathname === "/login"
              ? "text-[var(--color-primary)] font-semibold"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[10px]">บัญชี</span>
        </Link>
      </div>
    </nav>
  );
}
