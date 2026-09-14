import { notFound } from "next/navigation";
import Link from "next/link";
import { getBook, getBooks, formatPrice } from "@/lib/api";
import { BookCover } from "@/components/BookCard";
import AddToCartButton from "@/components/AddToCartButton";
import { ArrowLeft, BookOpen, Globe, Calendar, Hash, Star } from "lucide-react";

export async function generateStaticParams() {
  const books = await getBooks();
  return books.map((book) => ({ id: String(book.id) }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(Number(id));
  if (!book) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 py-6 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปรายการหนังสือ
      </Link>

      <div className="grid grid-cols-1 gap-8 pb-12 md:grid-cols-[auto,1fr] md:gap-14">
        {/* Cover with ambient glow */}
        <div className="relative flex justify-center md:block">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[var(--color-primary)]/15 blur-2xl" />
          <BookCover book={book} size="lg" />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="mb-2 inline-flex w-fit rounded-full bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            {book.category}
          </span>
          <h1 className="font-display text-2xl font-semibold leading-tight text-[var(--color-ink)] sm:text-3xl">
            {book.title}
          </h1>
          <p className="mt-2 text-base text-[var(--color-muted)]">
            {book.author}
          </p>

          {book.rating > 0 && (
            <div className="mt-3 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-ink)]">
                {book.rating.toFixed(1)}
              </span>
            </div>
          )}

          <p className="mt-5 max-w-prose text-[var(--color-ink)] opacity-80">
            {book.description}
          </p>

          {/* Meta */}
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--color-line)] pt-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[var(--color-muted)]" />
              <dt className="text-[var(--color-muted)]">หน้า</dt>
              <dd className="font-medium text-[var(--color-ink)]">
                {book.pages}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--color-muted)]" />
              <dt className="text-[var(--color-muted)]">ภาษา</dt>
              <dd className="font-medium text-[var(--color-ink)]">
                {book.language}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--color-muted)]" />
              <dt className="text-[var(--color-muted)]">ปีที่พิมพ์</dt>
              <dd className="font-medium text-[var(--color-ink)]">
                {book.published_year}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-[var(--color-muted)]" />
              <dt className="text-[var(--color-muted)]">ISBN</dt>
              <dd className="font-medium text-[var(--color-ink)]">{book.isbn}</dd>
            </div>
          </dl>

          {/* Price + buy */}
          <div className="mt-8 flex items-center gap-4">
            <span className="font-sans text-2xl font-semibold text-[var(--color-accent)]">
              {formatPrice(book.price)}
            </span>
            <AddToCartButton book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}
