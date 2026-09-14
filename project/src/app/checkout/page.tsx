"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder, formatPrice, getDemoCurrentUser } from "@/lib/api";
import { BookCover } from "@/components/BookCard";
import EmptyState from "@/components/EmptyState";
import { ShoppingBag, Loader2, QrCode, UploadCloud, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import type { PaymentMethod, User as UserType } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PromptPay");
  const [slipAttached, setSlipAttached] = useState<boolean>(true);
  const [slipFileName, setSlipFileName] = useState<string>("mock-slip-transfer-verified.jpg");
  const [errors, setErrors] = useState<{ email?: string; name?: string; slip?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getDemoCurrentUser();
    setCurrentUser(user);
    if (user) {
      setEmail(user.email);
      setFullName(user.full_name);
    }
  }, []);

  const validate = () => {
    const e: { email?: string; name?: string; slip?: string } = {};
    if (!email.trim()) e.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!fullName.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!slipAttached) e.slip = "กรุณาแนบหลักฐานการชำระเงินจำลอง";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const currentUser = getDemoCurrentUser();

    const order = await createOrder({
      user_id: currentUser?.id || 2,
      checkout_email: email.trim(),
      checkout_name: fullName.trim(),
      items: items.map((i) => ({
        book_id: i.book.id,
        quantity: i.quantity,
        price_at_time: i.book.price,
      })),
      total: totalPrice,
      payment_method: paymentMethod,
      slip_url: `/slips/${slipFileName}`,
    });

    setSubmitting(false);

    if (order) {
      clearCart();
      router.push(`/checkout/success?id=${order.id}`);
    } else {
      setErrors({ email: "เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="py-8 font-display text-2xl font-semibold">
          สั่งซื้อสินค้า
        </h1>
        <EmptyState
          icon={ShoppingBag}
          title="ไม่มีสินค้าในตะกร้า"
          description="เพิ่มหนังสือที่ต้องการซื้อในตะกร้าก่อนดำเนินการสั่งซื้อ"
          actionLabel="ดูหนังสือทั้งหมด"
          actionHref="/books"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="py-6 border-b border-[var(--color-line)] mb-6">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl text-[var(--color-ink)]">
          สั่งซื้อและชำระเงิน (Checkout)
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[var(--color-muted)]">
          กรอกข้อมูลผู้ซื้อ เลือกช่องทางชำระเงินจำลอง และแนบหลักฐานเพื่อส่งให้ผู้ดูแลร้านตรวจสอบ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 pb-16 md:grid-cols-[1.2fr,0.8fr]">
        {/* Left column: Steps */}
        <div className="space-y-8">
          {/* Step 1: User details */}
          <fieldset className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[#141618]">
                1
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">
                  ข้อมูลผู้สั่งซื้อ (Customer Details)
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  อีเมลนี้จะใช้รับใบเสร็จและแจ้งสถานะการอนุมัติคำสั่งซื้อ
                </p>
              </div>
            </div>

            {currentUser?.bank_account_name && (
              <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs text-emerald-300 animate-fade-in">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  ยืนยันตัวตนสำเร็จ: ชื่อสั่งซื้อตรงกับบัญชี <strong>{currentUser.bank_account_name}</strong> ({currentUser.bank_name || "พร้อมเพย์"} {currentUser.bank_account_number || ""})
                </span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="mb-1 block text-xs font-medium text-[var(--color-muted)]">
                  ชื่อ-นามสกุลผู้สั่งซื้อ
                </label>
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น นายกานต์นิธิ ยะโส"
                  className="input-field text-sm"
                  autoComplete="name"
                />
                {errors.name && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium text-[var(--color-muted)]">
                  อีเมล (Email Address)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="firts.zx99@gmail.com"
                  className="input-field text-sm"
                  autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email}</p>}
              </div>
            </div>
          </fieldset>

          {/* Step 2: Payment Simulation (Mock Slip Transfer) */}
          <fieldset className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-[#141618]">
                2
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-[var(--color-ink)]">
                  ชำระเงินแบบจำลอง (Mock Payment)
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  เลือกวิธีชำระเงินและแนบหลักฐานสลิปจำลอง (ห้ามใช้บัญชีจริง)
                </p>
              </div>
            </div>

            {/* Warning alert */}
            <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-line)] p-3 text-xs text-[var(--color-muted)] mb-4">
              <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--color-primary)] mt-0.5" />
              <p>
                <strong>ข้อกำหนดรายวิชา:</strong> เป็นระบบจำลองธุรกรรม ห้ามโอนเงินจริง หลังกดยืนยัน ออเดอร์จะเข้าสู่สถานะ <strong>รอผู้ดูแลตรวจสอบ</strong> และจะปลดล็อกดาวน์โหลดเมื่อแอดมินกดยืนยันแล้วเท่านั้น
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("PromptPay")}
                className={`flex flex-col items-center justify-center rounded-[var(--radius-md)] border p-3.5 text-center transition-all ${
                  paymentMethod === "PromptPay"
                    ? "border-[var(--color-primary)] bg-[var(--color-surface-2)] shadow-[0_0_12px_rgba(229,169,60,0.15)]"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]"
                }`}
              >
                <QrCode className="h-5 w-5 text-[var(--color-primary)] mb-1" />
                <span className="text-xs font-semibold text-[var(--color-ink)]">พร้อมเพย์ QR Code</span>
                <span className="text-[10px] text-[var(--color-muted)]">สแกนจ่ายจำลอง</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BankTransfer")}
                className={`flex flex-col items-center justify-center rounded-[var(--radius-md)] border p-3.5 text-center transition-all ${
                  paymentMethod === "BankTransfer"
                    ? "border-[var(--color-primary)] bg-[var(--color-surface-2)] shadow-[0_0_12px_rgba(229,169,60,0.15)]"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]"
                }`}
              >
                <UploadCloud className="h-5 w-5 text-[var(--color-primary)] mb-1" />
                <span className="text-xs font-semibold text-[var(--color-ink)]">โอนผ่านธนาคาร</span>
                <span className="text-[10px] text-[var(--color-muted)]">แนบสลิปโอนเงิน</span>
              </button>
            </div>

            {/* QR Mock Display */}
            {paymentMethod === "PromptPay" && (
              <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[#0d0f11] p-4 text-center mb-4">
                <div className="bg-white p-3 rounded-lg shadow-inner">
                  <div className="flex flex-col items-center justify-center h-28 w-28 border border-neutral-300 text-neutral-800 text-[11px] font-mono leading-tight">
                    <QrCode className="h-14 w-14 text-neutral-900" />
                    <span className="font-bold mt-1">PROMPTPAY</span>
                    <span className="text-[9px] text-neutral-600">MOCK QR</span>
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-[var(--color-primary)]">
                  ยอดชำระ: {formatPrice(totalPrice)}
                </p>
                <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                  บัญชี: ร้านหนังสือจำลอง Lampara Books (089-XXX-XXXX)
                </p>
              </div>
            )}

            {/* Mock Slip Attachment Box */}
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-line)] bg-[var(--color-surface-2)] p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-xs font-semibold text-[var(--color-ink)]">
                  หลักฐานการโอนเงินจำลองพร้อมส่ง (Mock Slip Attached)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[var(--color-muted)]">
                ไฟล์: <code className="text-[var(--color-primary)]">{slipFileName}</code> (ยอดเงิน {formatPrice(totalPrice)})
              </p>
              <div className="mt-2.5 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSlipAttached(true);
                    setSlipFileName(`slip-mock-${Date.now().toString().slice(-4)}.jpg`);
                  }}
                  className="rounded px-2.5 py-1 text-[11px] border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  สลับสลิปตัวอย่างอื่น
                </button>
              </div>
              {errors.slip && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.slip}</p>}
            </div>
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center py-3 text-sm font-semibold shadow-lg shadow-[rgba(229,169,60,0.25)]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึกคำสั่งซื้อลงฐานข้อมูล...
              </>
            ) : (
              `ยืนยันการสั่งซื้อ (${formatPrice(totalPrice)})`
            )}
          </button>
        </div>

        {/* Right column: Order Summary */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 h-fit sticky top-24">
          <h2 className="font-display text-base font-semibold text-[var(--color-ink)] pb-3 border-b border-[var(--color-line)]">
            สรุปรายการในคำสั่งซื้อ ({items.length} รายการ)
          </h2>

          <div className="mt-4 space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.book.id} className="flex items-center gap-3">
                <BookCover book={item.book} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs font-semibold text-[var(--color-ink)] truncate">
                    {item.book.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    {item.book.author} × {item.quantity} เล่ม
                  </p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-primary)] shrink-0">
                  {formatPrice(item.book.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-[var(--color-line)] pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>ราคารวมหนังสือดิจิทัล</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>ค่าจัดส่ง (ไฟล์ดิจิทัล)</span>
              <span className="text-emerald-400">ฟรี (Digital)</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[var(--color-ink)] pt-2 border-t border-[var(--color-line)]">
              <span>ยอดรวมสุทธิ</span>
              <span className="font-display text-lg text-[var(--color-primary)]">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
