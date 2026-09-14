"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { getBooks } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import BookCard from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import { SearchX } from "lucide-react";
import type { Book } from "@/lib/types";

export default function BooksPage() {
  return (
    <SuspenseWrapper>
      <BooksContent />
    </SuspenseWrapper>
  );
}

import { Suspense } from "react";

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--color-muted)]">กำลังโหลด...</div>}>
      {children}
    </Suspense>
  );
}

function BooksContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "ทั้งหมด";

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(queryParam);
  const [category, setCategory] = useState(categoryParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = books;
    if (category !== "ทั้งหมด") {
      result = result.filter((b) => b.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }
    return result;
  }, [books, search, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="py-8">
        <h1 className="font-display text-2xl font-semibold">หนังสือทั้งหมด</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          ค้นหาและเลือกหนังสือที่ใช่สำหรับคุณ
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..."
            className="input-field"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                category === cat
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[#141618] font-bold shadow-[0_0_10px_rgba(229,169,60,0.35)]"
                  : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[var(--color-muted)]">
          กำลังโหลด...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="ไม่พบหนังสือที่ค้นหา"
          description="ลองเปลี่ยนคำค้นหรือเลือกหมวดหมู่อื่น หรือดูหนังสือทั้งหมด"
          actionLabel="ดูหนังสือทั้งหมด"
          actionHref="/books"
        />
      ) : (
        <>
          <p className="mb-2 text-sm text-[var(--color-muted)]">
            พบ {filtered.length} รายการ
          </p>
          <div className="divide-y divide-[var(--color-line)]">
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} variant="row" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
