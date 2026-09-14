"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/api";
import type { Book } from "@/lib/types";
import { Plus, Check } from "lucide-react";

type Props = {
  book: Book;
  variant?: "row" | "card";
};

export default function BookCard({ book, variant = "row" }: Props) {
  const { addItem, justAdded } = useCart();
  const isAdded = justAdded === book.id;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
  };

    if (variant === "card") {
    return (
      <Link
        href={`/books/${book.id}`}
        className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      >
        <div>
          <div className="flex justify-center py-2">
            <BookCover book={book} size="md" />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
            <span className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-medium text-[var(--color-primary)]">
              {book.category}
            </span>
            <span>{book.pages} หน้า</span>
          </div>
          <h3 className="mt-2 font-display text-base font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)] line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{book.author}</p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)]/60 pt-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] block">
              e-Book
            </span>
            <span className="font-sans text-base font-bold text-[var(--color-primary)]">
              {formatPrice(book.price)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] transition-all active:scale-95 ${
              isAdded
                ? "bg-[var(--color-success)] text-white shadow-[0_0_12px_rgba(78,154,116,0.5)]"
                : "bg-[var(--color-primary)] text-[#141618] hover:bg-[var(--color-primary-hover)] shadow-[0_2px_8px_rgba(229,169,60,0.3)]"
            }`}
            aria-label={`หยิบ ${book.title} ใส่ตะกร้า`}
            title="เพิ่มเล่มนี้ลงตะกร้า"
          >
            {isAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/books/${book.id}`}
      className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 py-4.5 px-3 rounded-[var(--radius-md)] border border-transparent transition-all hover:border-[var(--color-line)] hover:bg-[var(--color-surface)]"
    >
      <BookCover book={book} size="sm" />
      <div className="min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">
            {book.category}
          </span>
          <span className="text-[11px] text-[var(--color-muted)]">
            {book.pages} หน้า • {book.language}
          </span>
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary)] line-clamp-1">
          {book.title}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-muted)]">{book.author}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <span className="font-sans text-sm font-bold text-[var(--color-primary)]">
          {formatPrice(book.price)}
        </span>
        <button
          onClick={handleAdd}
          className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-all active:scale-95 ${
            isAdded
              ? "bg-[var(--color-success)] text-white shadow-[0_0_10px_rgba(78,154,116,0.4)]"
              : "bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-line)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[#141618]"
          }`}
          aria-label={`หยิบ ${book.title} ใส่ตะกร้า`}
          title="เพิ่มลงตะกร้า"
        >
          {isAdded ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>
    </Link>
  );
}

export function BookCover({
  book,
  size = "md",
}: {
  book: Book;
  size?: "sm" | "md" | "lg";
}) {
  const dimensions = {
    sm: "w-13 h-18",
    md: "w-28 h-40",
    lg: "w-52 h-72",
  };

  return (
    <div
      className={`relative ${dimensions[size]} shrink-0 overflow-hidden rounded-[3px] border-l-2 border-white/20 shadow-[inset_3px_0_6px_rgba(0,0,0,0.5),0_6px_18px_rgba(0,0,0,0.5)] transition-transform duration-200 group-hover:scale-[1.02]`}
      style={{ backgroundColor: book.cover_color }}
    >
      {/* Book spine ridge highlight */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent" />
      
      {/* Inner cover layout */}
      <div className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3">
        <div className="flex items-center justify-between">
          <div className="h-0.5 w-6 bg-white/30" />
          <span className="text-[7px] sm:text-[8px] tracking-widest uppercase text-white/50 font-sans">
            LAMPARA
          </span>
        </div>
        
        <div className="my-auto text-center px-1">
          <p
            className={`font-display font-semibold leading-snug tracking-tight ${
              size === "sm"
                ? "text-[8px] line-clamp-2"
                : size === "md"
                ? "text-[11px] line-clamp-3"
                : "text-lg line-clamp-3"
            } text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]`}
          >
            {book.title}
          </p>
          {size !== "sm" && (
            <p className="mt-1 font-sans text-[9px] sm:text-[10px] text-white/75 truncate">
              {book.author}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[6px] sm:text-[7px] text-white/40 font-mono">
            {book.isbn ? book.isbn.slice(-5) : "EDITION"}
          </span>
          <div className="h-0.5 w-4 bg-white/30" />
        </div>
      </div>
    </div>
  );
}
