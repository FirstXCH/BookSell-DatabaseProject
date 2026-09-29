"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BookCover } from "@/components/BookCard";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice, getBookStatusOverrides, getBookFeaturedOverrides } from "@/lib/api";
import type { Book } from "@/lib/types";

type Props = {
  initialBooks: Book[];
};

export default function FeaturedHeroShowcase({ initialBooks }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync client-side localStorage overrides
  useEffect(() => {
    const statusOverrides = getBookStatusOverrides();
    const featOverrides = getBookFeaturedOverrides();

    const synced = initialBooks
      .map((b) => ({
        ...b,
        is_active: statusOverrides[b.id] !== undefined ? statusOverrides[b.id] : (b.is_active !== false),
        featured: featOverrides[b.id] !== undefined ? featOverrides[b.id] : Boolean(b.featured),
      }))
      .filter((b) => b.is_active !== false);

    setBooks(synced);
  }, [initialBooks]);

  // Books that are active and marked as featured
  const featuredBooks = books.filter((b) => b.featured);
  const displayList = featuredBooks.length > 0 ? featuredBooks : books.slice(0, 3);

  // Guard index out of range
  const safeIndex = selectedIndex >= displayList.length ? 0 : selectedIndex;
  const currentBook = displayList[safeIndex];

  if (!currentBook) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10 lg:p-12 shadow-[var(--shadow-lg)] transition-all">
      {/* Subtle ambient amber lantern glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

      {/* Top selector tabs if multiple featured books exist */}
      {displayList.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-[var(--color-line)]/60 pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mr-2">
            เลือกชมเล่มแนะนำ:
          </span>
          {displayList.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                safeIndex === idx
                  ? "bg-[var(--color-primary)] text-[#141618] shadow-sm font-bold scale-105"
                  : "border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-primary)]/40"
              }`}
            >
              <span>⭐ อันดับ {idx + 1}:</span>
              <span className="max-w-[120px] truncate">{b.title}</span>
            </button>
          ))}
        </div>
      )}

      <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[auto,1fr] lg:gap-14">
        {/* Cover Preview with Rank Badge */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-[var(--color-primary)]/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <BookCover book={currentBook} size="lg" />
              <div className="absolute -bottom-2 -right-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-[#141618] shadow-lg animate-fade-in">
                แนะนำอันดับ {safeIndex + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Details & Action */}
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[var(--color-primary)]">
              <Sparkles className="h-3 w-3" />
              เล่มเด่นประจำสัปดาห์ : ฉบับคัดสรร (อันดับ {safeIndex + 1})
            </span>
            <span className="text-xs text-[var(--color-muted)] font-mono">
              {currentBook.category}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--color-ink)] tracking-tight">
            {currentBook.title}
          </h1>

          <p className="mt-1.5 text-sm sm:text-base font-medium text-[var(--color-muted)]">
            ประพันธ์โดย <span className="text-[var(--color-ink)]">{currentBook.author}</span>
          </p>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--color-ink)]/85">
            {currentBook.description}
          </p>

          {/* Book Specificity Metas */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)] border-y border-[var(--color-line)]/70 py-3">
            <span>ความยาว <strong>{currentBook.pages} หน้า</strong></span>
            <span>•</span>
            <span>ภาษา <strong>{currentBook.language}</strong></span>
            <span>•</span>
            <span>ISBN <strong>{currentBook.isbn}</strong></span>
            <span>•</span>
            <span className="text-[var(--color-primary)] font-semibold">คะแนน {currentBook.rating} / 5.0</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <span className="text-[11px] block uppercase tracking-wider text-[var(--color-muted)]">
                ราคา e-Book
              </span>
              <span className="font-sans text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                {formatPrice(currentBook.price)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AddToCartButton book={currentBook} />
              <Link
                href={`/books/${currentBook.id}`}
                className="btn-outline text-xs sm:text-sm"
              >
                อ่านเรื่องย่อฉบับเต็ม
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
