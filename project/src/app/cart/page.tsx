"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/api";
import { BookCover } from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { Plus, Minus, X, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="py-8 font-display text-2xl font-semibold">ตะกร้าสินค้า</h1>
        <EmptyState
          icon={ShoppingBag}
          title="ตะกร้ายังว่าง"
          description="เริ่มเลือกหนังสือที่ชอบและหยิบใส่ตะกร้าได้เลย"
          actionLabel="ดูหนังสือทั้งหมด"
          actionHref="/books"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <h1 className="py-8 font-display text-2xl font-semibold">
        ตะกร้าสินค้า ({totalItems})
      </h1>

      <div className="divide-y divide-[var(--color-line)]">
        {items.map((item) => (
          <div key={item.book.id} className="flex gap-4 py-5">
            <BookCover book={item.book} size="sm" />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/books/${item.book.id}`}
                    className="font-display text-base font-semibold leading-snug text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                  >
                    {item.book.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                    {item.book.author}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.book.id)}
                  className="shrink-0 text-[var(--color-muted)] transition-colors hover:text-[var(--color-error)]"
                  aria-label={`ลบ ${item.book.title}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.book.id, item.quantity - 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] transition-colors hover:border-[var(--color-primary)]"
                    aria-label="ลดจำนวน"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.book.id, item.quantity + 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] transition-colors hover:border-[var(--color-primary)]"
                    aria-label="เพิ่มจำนวน"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-sans text-sm font-semibold text-[var(--color-accent)]">
                  {formatPrice(item.book.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-line)] pt-6">
        <span className="text-sm text-[var(--color-muted)]">ยอดรวมทั้งหมด</span>
        <span className="font-display text-2xl font-semibold">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <div className="mt-6 flex gap-3 pb-12">
        <Link href="/books" className="btn-outline flex-1">
          เลือกหนังสือเพิ่ม
        </Link>
        <Link href="/checkout" className="btn-primary flex-1">
          ดำเนินการสั่งซื้อ
        </Link>
      </div>
    </div>
  );
}
