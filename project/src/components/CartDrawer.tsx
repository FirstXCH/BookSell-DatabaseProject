"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/api";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { BookCover } from "./BookCard";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="animate-fade-in absolute inset-0 bg-black/30"
        onClick={closeCart}
      />
      <aside className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[var(--color-bg)] shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
          <h2 className="font-display text-lg font-semibold">ตะกร้าสินค้า</h2>
          <button
            onClick={closeCart}
            className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            aria-label="ปิดตะกร้า"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-[var(--color-muted)] opacity-40" />
            <div>
              <p className="font-display text-base font-semibold text-[var(--color-ink)]">
                ตะกร้ายังว่าง
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                เริ่มเลือกหนังสือที่ชอบและหยิบใส่ตะกร้าได้เลย
              </p>
            </div>
            <Link
              href="/books"
              onClick={closeCart}
              className="btn-primary mt-2"
            >
              ดูหนังสือทั้งหมด
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <div
                  key={item.book.id}
                  className="flex gap-3 border-b border-[var(--color-line)] py-4"
                >
                  <BookCover book={item.book} size="sm" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/books/${item.book.id}`}
                          onClick={closeCart}
                          className="font-display text-sm font-semibold leading-snug text-[var(--color-ink)] hover:text-[var(--color-primary)]"
                        >
                          {item.book.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                          {item.book.author}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.book.id)}
                        className="shrink-0 text-[var(--color-muted)] transition-colors hover:text-[var(--color-error)]"
                        aria-label={`ลบ ${item.book.title} ออกจากตะกร้า`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-primary)]"
                          aria-label="ลดจำนวน"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.book.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-line)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-primary)]"
                          aria-label="เพิ่มจำนวน"
                        >
                          <Plus className="h-3.5 w-3.5" />
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

            <div className="border-t border-[var(--color-line)] px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-[var(--color-muted)]">ยอดรวม</span>
                <span className="font-display text-xl font-semibold text-[var(--color-ink)]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full"
              >
                ดำเนินการสั่งซื้อ
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
