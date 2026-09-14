import Link from "next/link";
import { BookOpen, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)] py-12 text-xs text-[var(--color-muted)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] border border-[var(--color-line)]">
                <span className="font-display text-xs font-bold text-[var(--color-primary)]">L</span>
              </div>
              <span className="font-display text-sm font-semibold tracking-wide text-[var(--color-ink)]">
                Lampara Books
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              ร้านหนังสือและอีบุ๊กออนไลน์ คัดสรรพิเศษเพื่อการอ่านยามค่ำคืน รองรับทั้งฟอร์แมต PDF และ EPUB คมชัดทุกขนาดหน้าจอ
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[var(--color-primary)]">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>100% DRM-Free • ปลอดภัย ไร้ข้อจำกัด</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-3">
              หมวดหมู่อ่านยอดนิยม
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/books?category=นวนิยาย" className="hover:text-[var(--color-primary)] transition-colors">
                  นวนิยายคัดสรร (Fiction)
                </Link>
              </li>
              <li>
                <Link href="/books?category=เทคโนโลยี" className="hover:text-[var(--color-primary)] transition-colors">
                  เทคโนโลยีและการเขียนโค้ด (Technology)
                </Link>
              </li>
              <li>
                <Link href="/books?category=เรียงความ" className="hover:text-[var(--color-primary)] transition-colors">
                  เรียงความและบันทึกชีวิต (Essays)
                </Link>
              </li>
              <li>
                <Link href="/books?category=ออกแบบ" className="hover:text-[var(--color-primary)] transition-colors">
                  ศิลปะและงานออกแบบ (Design)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-3">
              บริการและช่วยเหลือ
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/checkout" className="hover:text-[var(--color-primary)] transition-colors">
                  ขั้นตอนการสั่งซื้อ (Checkout Guide)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[var(--color-primary)] transition-colors">
                  ระบบสมาชิกและประวัติ (Account)
                </Link>
              </li>
              <li>
                <span className="text-[11px]">ดาวน์โหลดไฟล์ได้ทันทีหลังชำระเงิน</span>
              </li>
              <li>
                <span className="text-[11px]">ลิงก์สำรองจัดส่งเข้าอีเมล 24 ชั่วโมง</span>
              </li>
            </ul>
          </div>

          {/* Mini Project Credit */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)] mb-3">
              ข้อมูลโครงงาน
            </h4>
            <p className="text-[11px] leading-relaxed">
              โปรเจกต์พัฒนาระบบร้านค้าฐานข้อมูล (Database System Mini Project)
            </p>
            <div className="mt-3 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface-2)] p-2.5 text-[10px]">
              <p className="text-[var(--color-ink)] font-medium">สถาปัตยกรรมระบบ :</p>
              <p className="text-[var(--color-muted)] mt-0.5">Next.js 16 • PostgreSQL Ready • Prom Design System</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-line)] pt-6 sm:flex-row text-[11px]">
          <p>© {new Date().getFullYear()} Lampara Books. สงวนลิขสิทธิ์ทุกประการ</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">หน้าแรก</Link>
            <span>•</span>
            <Link href="/books" className="hover:text-[var(--color-primary)] transition-colors">แคตตาล็อก</Link>
            <span>•</span>
            <Link href="/cart" className="hover:text-[var(--color-primary)] transition-colors">ตะกร้าสินค้า</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
