import Link from "next/link";
import { getBooks, formatPrice } from "@/lib/api";
import { categories } from "@/lib/mock-data";
import BookCard, { BookCover } from "@/components/BookCard";
import AddToCartButton from "@/components/AddToCartButton";
import type { Book } from "@/lib/types";
import { Sparkles, Download, ShieldCheck, Smartphone, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const books = await getBooks();
  const featured = books.find((b) => b.featured) ?? books[0];
  const recommended = books.filter((b) => b.id !== featured.id);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero : Cinematic Editorial Showcase */}
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-10 lg:p-12 shadow-[var(--shadow-lg)]">
        {/* Subtle ambient amber lantern glow behind cover */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[auto,1fr] lg:gap-14">
          <div className="flex justify-center">
            <HeroCover book={featured} />
          </div>

          <div className="flex flex-col justify-center text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[var(--color-primary)]">
                <Sparkles className="h-3 w-3" />
                เล่มเด่นประจำสัปดาห์ : ฉบับคัดสรร
              </span>
              <span className="text-xs text-[var(--color-muted)] font-mono">
                {featured.category}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--color-ink)] tracking-tight">
              {featured.title}
            </h1>

            <p className="mt-1.5 text-sm sm:text-base font-medium text-[var(--color-muted)]">
              ประพันธ์โดย <span className="text-[var(--color-ink)]">{featured.author}</span>
            </p>

            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--color-ink)]/85">
              {featured.description}
            </p>

            {/* Book Specificity Metas */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)] border-y border-[var(--color-line)]/70 py-3">
              <span>ความยาว <strong>{featured.pages} หน้า</strong></span>
              <span>•</span>
              <span>ภาษา <strong>{featured.language}</strong></span>
              <span>•</span>
              <span>ISBN <strong>{featured.isbn}</strong></span>
              <span>•</span>
              <span className="text-[var(--color-primary)] font-semibold">คะแนน {featured.rating} / 5.0</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <span className="text-[11px] block uppercase tracking-wider text-[var(--color-muted)]">
                  ราคา e-Book
                </span>
                <span className="font-sans text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">
                  {formatPrice(featured.price)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AddToCartButton book={featured} />
                <Link
                  href={`/books/${featured.id}`}
                  className="btn-outline text-xs sm:text-sm"
                >
                  อ่านเรื่องย่อฉบับเต็ม
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            ดูทั้งหมด 10 เล่ม <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === "ทั้งหมด" ? books.length : books.filter(b => b.category === cat).length;
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

        {/* Grid layout for night reader presentation */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {recommended.slice(0, 8).map((book) => (
            <BookCard key={book.id} book={book} variant="card" />
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroCover({ book }: { book: Book }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-lg bg-[var(--color-primary)]/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <BookCover book={book} size="lg" />
        <div className="absolute -bottom-2 -right-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-[#141618] shadow-lg">
          แนะนำอันดับ 1
        </div>
      </div>
    </div>
  );
}



