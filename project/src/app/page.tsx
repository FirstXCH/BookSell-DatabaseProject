import Link from "next/link";
import { getBooks } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import BookCard from "@/components/BookCard";
import FeaturedHeroShowcase from "@/components/FeaturedHeroShowcase";
import { Download, ShieldCheck, Smartphone, Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const books = await getBooks();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero : Interactive Editorial Showcase (Supports Multiple Featured Books & Status Sync) */}
      <FeaturedHeroShowcase initialBooks={books} />

      {/* Proof Strip : Specificity & Trust Signals */}
      <section className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3.5 sm:p-4">
          <Download className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">ดาวน์โหลดทันที</h4>
            <p className="text-[11px] text-[var(--color-muted)]">รับไฟล์ภายใน 5 วินาที</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3.5 sm:p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">100% DRM-Free</h4>
            <p className="text-[11px] text-[var(--color-muted)]">อ่านได้ทุกแอป ทุกอุปกรณ์</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3.5 sm:p-4">
          <Smartphone className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">PDF & EPUB</h4>
            <p className="text-[11px] text-[var(--color-muted)]">จัดหน้าสบายตา คมชัด 300 DPI</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3.5 sm:p-4">
          <Sparkles className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-ink)]">Guest Checkout</h4>
            <p className="text-[11px] text-[var(--color-muted)]">สั่งซื้อง่าย ไม่ต้องสมัครสมาชิก</p>
          </div>
        </div>
      </section>

      {/* Category Pills with counts */}
      <section className="border-b border-[var(--color-line)] pb-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-medium">
            เลือกดูตามหมวดหมู่
          </span>
          <Link href="/books" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
            ดูทั้งหมด {books.length} เล่ม <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === "ทั้งหมด" ? books.length : books.filter((b) => b.category === cat).length;
            return (
              <Link
                key={cat}
                href={cat === "ทั้งหมด" ? "/books" : `/books?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs text-[var(--color-ink)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-2)]"
              >
                <span>{cat}</span>
                <span className="text-[10px] text-[var(--color-muted)] font-mono">
                  ({count})
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Curated Catalog Shelf */}
      <section className="py-2">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)]">
              ชั้นหนังสือแนะนำ
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[var(--color-ink)]">
              เล่มที่ผู้อ่านให้คะแนนสูงสุด
            </h2>
          </div>
          <Link
            href="/books"
            className="text-xs sm:text-sm font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1"
          >
            เปิดดูทั้งแคตตาล็อก <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid layout for catalog items */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {books.slice(0, 8).map((book) => (
            <BookCard key={book.id} book={book} variant="card" />
          ))}
        </div>
      </section>
    </div>
  );
}
