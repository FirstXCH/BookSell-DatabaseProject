"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Check,
  LogOut,
  UserPlus,
  LogIn,
  Save,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  Phone,
  ClipboardList,
  Settings,
  CreditCard,
  Building2,
  X,
  Sparkles,
} from "lucide-react";
import { mockUsers } from "@/lib/mock-data";
import {
  getDemoCurrentUser,
  setDemoCurrentUser,
  signUpUser,
  signInWithEmail,
  signOutUser,
  updateUserProfile,
} from "@/lib/api";
import type { User as UserType } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up Form State
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  // Edit Profile Form State (ข้อมูลพื้นฐาน & บัญชียืนยันตัวตน)
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBankAccountName, setEditBankAccountName] = useState("");
  const [editBankAccountNumber, setEditBankAccountNumber] = useState("");
  const [editBankName, setEditBankName] = useState("พร้อมเพย์ (PromptPay)");
  const [editingProfile, setEditingProfile] = useState(false);

  // 1. ดึงผู้ใช้ปัจจุบัน
  useEffect(() => {
    const user = getDemoCurrentUser();
    setCurrentUser(user);
    if (user) {
      setEditName(user.full_name);
      setEditEmail(user.email);
      setEditPhone(user.phone || "");
      setEditBankAccountName(user.bank_account_name || user.full_name);
      setEditBankAccountNumber(user.bank_account_number || "");
      setEditBankName(user.bank_name || "พร้อมเพย์ (PromptPay)");
    }

    const handleUserChange = () => {
      const updated = getDemoCurrentUser();
      setCurrentUser(updated);
      if (updated) {
        setEditName(updated.full_name);
        setEditEmail(updated.email);
        setEditPhone(updated.phone || "");
        setEditBankAccountName(updated.bank_account_name || updated.full_name);
        setEditBankAccountNumber(updated.bank_account_number || "");
        setEditBankName(updated.bank_name || "พร้อมเพย์ (PromptPay)");
      }
    };

    window.addEventListener("user-changed", handleUserChange);
    return () => window.removeEventListener("user-changed", handleUserChange);
  }, []);

  // 2. สมัครสมาชิกใหม่ (Sign Up)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setNotification({ type: "error", message: "กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบถ้วน" });
      return;
    }

    if (signupPassword.length < 6) {
      setNotification({ type: "error", message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setNotification({ type: "error", message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน" });
      return;
    }

    setLoading(true);
    const res = await signUpUser({
      full_name: signupName,
      email: signupEmail,
      phone: signupPhone,
      password: signupPassword,
    });
    setLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setEditName(res.user.full_name);
      setEditEmail(res.user.email);
      setEditPhone(res.user.phone || "");
      setNotification({
        type: "success",
        message: `สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${res.user.full_name} สิทธิ์สมาชิกทั่วไป (Customer)`,
      });
    } else {
      setNotification({
        type: "error",
        message: res.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      });
    }
  };

  // 3. เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน (Sign In)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!loginEmail.trim()) {
      setNotification({ type: "error", message: "กรุณากรอกอีเมล" });
      return;
    }

    setLoading(true);
    const res = await signInWithEmail(loginEmail, loginPassword);
    setLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      setEditName(res.user.full_name);
      setEditEmail(res.user.email);
      setEditPhone(res.user.phone || "");
      setNotification({
        type: "success",
        message: `เข้าสู่ระบบสำเร็จในฐานะ "${res.user.full_name}" (${res.user.role_id === 1 ? "ผู้ดูแลระบบ" : "ลูกค้า"})`,
      });
      if (res.user.role_id === 1) {
        setTimeout(() => router.push("/admin"), 1000);
      }
    } else {
      setNotification({
        type: "error",
        message: res.error || "ไม่พบอีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // 4. แก้ไขข้อมูลพื้นฐาน & บัญชียืนยันตัวตน (ตามเกณฑ์ใบงานข้อ 2.1)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editName.trim()) {
      setNotification({ type: "error", message: "ชื่อ-นามสกุลต้องไม่ว่างเปล่า" });
      return;
    }
    if (!editEmail.trim()) {
      setNotification({ type: "error", message: "อีเมลต้องไม่ว่างเปล่า" });
      return;
    }

    setLoading(true);
    const success = await updateUserProfile(
      currentUser.id,
      editName,
      editPhone,
      editEmail,
      editBankAccountName,
      editBankAccountNumber,
      editBankName
    );
    setLoading(false);

    if (success) {
      setEditingProfile(false);
      setNotification({
        type: "success",
        message: "บันทึกการแก้ไขข้อมูลพื้นฐานและบัญชียืนยันตัวตนเรียบร้อยแล้ว!",
      });
      const updated = getDemoCurrentUser();
      if (updated) setCurrentUser(updated);
    }
  };

  // 5. ออกจากระบบ
  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setNotification({ type: "info", message: "ออกจากระบบเรียบร้อยแล้ว" });
  };

  // 6. สลับบัญชีทดสอบด่วน (สำหรับอาจารย์และกรรมการ)
  const handleQuickSelect = (user: UserType, redirectPath?: string) => {
    setDemoCurrentUser(user);
    setCurrentUser(user);
    setEditName(user.full_name);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");
    setEditBankAccountName(user.bank_account_name || user.full_name);
    setEditBankAccountNumber(user.bank_account_number || "");
    setNotification({
      type: "success",
      message: `สลับบทบาทเป็น "${user.full_name}" (${user.role_id === 1 ? "ผู้ดูแลระบบ" : "ลูกค้า"}) สำเร็จ!`,
    });
    if (redirectPath) {
      setTimeout(() => router.push(redirectPath), 900);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-10 sm:px-6">
      {/* Icon & Title */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-primary)]/40 shadow-[0_0_20px_rgba(229,169,60,0.2)]">
        <User className="h-8 w-8" />
      </div>

      <h1 className="mt-5 font-display text-2xl font-bold sm:text-3xl text-[var(--color-ink)] text-center">
        ระบบสมาชิก & สิทธิ์การใช้งาน
      </h1>
      <p className="mt-2 text-center text-xs sm:text-sm text-[var(--color-muted)] max-w-md">
        Lampara Books Authentication, Membership & Access Control (Supabase DB)
      </p>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mt-5 flex w-full items-start gap-2 rounded-[var(--radius-md)] border p-3.5 text-xs sm:text-sm font-medium animate-fade-in ${
            notification.type === "success"
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
              : notification.type === "error"
              ? "border-red-500/50 bg-red-500/10 text-red-300"
              : "border-[var(--color-primary)]/50 bg-[var(--color-surface-2)] text-[var(--color-primary)]"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{notification.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* กรณีที่ 1: ผู้ใช้ล็อกอินแล้ว (Active Session & Profile Card) */}
      {/* ========================================================================= */}
      {currentUser ? (
        <div className="mt-6 w-full space-y-4">
          {/* Active User Card */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)] font-bold text-xl border border-[var(--color-primary)]/30">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--color-ink)] text-base">
                      {currentUser.full_name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        currentUser.role_id === 1
                          ? "bg-[var(--color-primary)] text-[#141618]"
                          : "bg-[var(--color-surface-2)] text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {currentUser.role_id === 1 ? "ADMIN (ผู้ดูแลระบบ)" : "CUSTOMER (ลูกค้า)"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{currentUser.email}</p>
                  {currentUser.phone && (
                    <p className="text-[11px] text-[var(--color-muted)]">โทร: {currentUser.phone}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {currentUser.role_id === 1 ? (
                  <Link href="/admin" className="btn-primary text-xs py-2 px-3.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>ไปหลังบ้าน Admin →</span>
                  </Link>
                ) : (
                  <Link href="/orders" className="btn-outline text-xs py-2 px-3.5">
                    <ClipboardList className="h-3.5 w-3.5" />
                    <span>คำสั่งซื้อของฉัน →</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                  title="ออกจากระบบ"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </div>
            </div>

            {/* Verified Bank Account Status Badge */}
            {currentUser.bank_account_name && (
              <div className="mt-3.5 flex items-center gap-2 rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  บัญชียืนยันตัวตนสั่งซื้อ: <strong>{currentUser.bank_account_name}</strong>{" "}
                  ({currentUser.bank_name || "ธนาคาร"} {currentUser.bank_account_number || ""})
                </span>
              </div>
            )}

            {/* Quick Navigation & Gear Button */}
            <div className="mt-4 pt-4 border-t border-[var(--color-line)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[var(--color-muted)]">
                {currentUser.role_id === 1
                  ? "สิทธิ์ Admin: สามารถจัดการออเดอร์ หนังสือ หมวดหมู่ และดูรายงาน 4 ด้าน"
                  : "สิทธิ์ลูกค้า: สามารถสั่งซื้อ ชำระเงิน และดาวน์โหลด e-Book ได้"}
              </span>

              {/* Gear Settings Button */}
              <button
                type="button"
                onClick={() => setEditingProfile(!editingProfile)}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-primary)]/40 bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[#141618] transition-all shadow-sm"
              >
                <Settings className={`h-3.5 w-3.5 ${editingProfile ? "rotate-90 text-[#141618]" : ""}`} />
                <span>{editingProfile ? "ปิดฟอร์มแก้ไข" : "แก้ไขข้อมูลพื้นฐาน & บัญชียืนยันตัวตน"}</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {editingProfile && (
            <form
              onSubmit={handleSaveProfile}
              className="rounded-[var(--radius-lg)] border border-[var(--color-primary)]/40 bg-[var(--color-surface)] p-5 sm:p-6 space-y-4 animate-fade-in shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[var(--color-primary)]" />
                  <span className="font-semibold text-xs sm:text-sm text-[var(--color-ink)]">
                    แก้ไขข้อมูลพื้นฐานของสมาชิก (ตามเกณฑ์ใบงานข้อ 2.1)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Primary User Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1 mb-1">
                    <User className="h-3 w-3 text-[var(--color-primary)]" />
                    <span>ชื่อ-นามสกุล *</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="input-field text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1 mb-1">
                    <Mail className="h-3 w-3 text-[var(--color-primary)]" />
                    <span>อีเมล (Email) *</span>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    placeholder="เปลี่ยนอีเมลสำหรับรับข้อมูลและล็อกอิน"
                    className="input-field text-xs sm:text-sm"
                  />
                  <p className="text-[10px] text-[var(--color-muted)] mt-1">
                    ใช้สำหรับรับลิงก์ดาวน์โหลดและเข้าสู่ระบบ
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1 mb-1">
                  <Phone className="h-3 w-3 text-[var(--color-primary)]" />
                  <span>เบอร์โทรศัพท์</span>
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="เช่น 081-999-8877"
                  className="input-field text-xs sm:text-sm"
                />
              </div>

              {/* Identity Verification Bank Account Section */}
              <div className="rounded-[var(--radius-md)] border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)]">
                  <CreditCard className="h-4 w-4" />
                  <span>ข้อมูลบัญชีธนาคารเพื่อยืนยันตัวตน (Payment Identity Verification)</span>
                </div>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  ระบุชื่อบัญชีธนาคารให้ตรงกับชื่อผู้โอน เพื่อให้ระบบและแอดมินสามารถตรวจสอบสลิปและยืนยันคำสั่งซื้อได้อัตโนมัติตามชื่อที่สั่งซื้อ
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                      ชื่อบัญชีธนาคาร (Bank Account Name) *
                    </label>
                    <input
                      type="text"
                      value={editBankAccountName}
                      onChange={(e) => setEditBankAccountName(e.target.value)}
                      placeholder="เช่น KANNITI YASO (ตรงตามชื่อสั่งซื้อ)"
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                      เลขที่บัญชีธนาคาร (Account Number)
                    </label>
                    <input
                      type="text"
                      value={editBankAccountNumber}
                      onChange={(e) => setEditBankAccountNumber(e.target.value)}
                      placeholder="เช่น 081-999-8877 หรือ 123-4-56789-0"
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                    ธนาคาร / ผู้ให้บริการ
                  </label>
                  <select
                    value={editBankName}
                    onChange={(e) => setEditBankName(e.target.value)}
                    className="input-field text-xs bg-[var(--color-surface)]"
                  >
                    <option value="พร้อมเพย์ (PromptPay)">พร้อมเพย์ (PromptPay)</option>
                    <option value="ธนาคารกสิกรไทย (KBANK)">ธนาคารกสิกรไทย (KBANK)</option>
                    <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB)</option>
                    <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                    <option value="ธนาคารกรุงเทพ (BBL)">ธนาคารกรุงเทพ (BBL)</option>
                    <option value="ธนาคารทหารไทยธนชาต (TTB)">ธนาคารทหารไทยธนชาต (TTB)</option>
                    <option value="ธนาคารกรุงศรีอยุธยา (BAY)">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-line)]">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="btn-outline text-xs py-2 px-3"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  <span>บันทึกข้อมูลพื้นฐาน & บัญชียืนยันตัวตน</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* กรณีที่ 2: ยังไม่ได้เข้าสู่ระบบ (Sign Up / Sign In Form) */
        /* ========================================================================= */
        <div className="mt-8 w-full space-y-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-xl">
            {/* Tabs: Sign Up vs Sign In */}
            <div className="grid grid-cols-2 gap-2 border-b border-[var(--color-line)] pb-4 mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setNotification(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-[var(--radius-md)] py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "signup"
                    ? "bg-[var(--color-primary)] text-[#141618] shadow-sm font-bold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>สมัครสมาชิกใหม่ (Sign Up)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setNotification(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-[var(--radius-md)] py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "signin"
                    ? "bg-[var(--color-primary)] text-[#141618] shadow-sm font-bold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>เข้าสู่ระบบ (Sign In)</span>
              </button>
            </div>

            {/* TAB 1: สมัครสมาชิกใหม่ */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 text-xs font-semibold text-[var(--color-primary)]">
                  <UserPlus className="h-4 w-4" />
                  <span>สร้างบัญชีสิทธิ์ลูกค้า (Customer) เพื่อสั่งซื้อ e-Book</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>ชื่อ-นามสกุล *</span>
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="เช่น กานต์นิธิ ยะโส"
                    required
                    className="input-field mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>อีเมล (Email) *</span>
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="youremail@gmail.com"
                    required
                    className="input-field mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>เบอร์โทรศัพท์ (ไม่บังคับ)</span>
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="081-999-8877"
                    className="input-field mt-1 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                      <span>รหัสผ่าน (Password) *</span>
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      required
                      className="input-field mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                      <span>ยืนยันรหัสผ่าน *</span>
                    </label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                      required
                      className="input-field mt-1 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-2.5 text-sm mt-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  <span>สร้างบัญชีและเข้าสู่ระบบทันที</span>
                </button>

                <p className="text-center text-xs text-[var(--color-muted)] pt-1">
                  มีบัญชีอยู่แล้ว?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-[var(--color-primary)] font-semibold hover:underline"
                  >
                    เข้าสู่ระบบที่นี่
                  </button>
                </p>
              </form>
            )}

            {/* TAB 2: เข้าสู่ระบบ */}
            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 text-xs font-semibold text-[var(--color-primary)]">
                  <LogIn className="h-4 w-4" />
                  <span>เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน</span>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>อีเมล (Email)</span>
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="youremail@gmail.com หรือ admin@lampara.com"
                    required
                    className="input-field mt-1 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>รหัสผ่าน (Password)</span>
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field mt-1 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-2.5 text-sm"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  <span>เข้าสู่ระบบ</span>
                </button>

                <p className="text-center text-xs text-[var(--color-muted)] pt-1">
                  ยังไม่มีบัญชีสมาชิก?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="text-[var(--color-primary)] font-semibold hover:underline"
                  >
                    สมัครสมาชิกใหม่ก่อนเข้าใช้งาน
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ส่วนสลับบัญชีทดสอบด่วนสำหรับอาจารย์และผู้ตรวจ (Teacher & Grader Quick Switcher) */}
      {/* ========================================================================= */}
      <div className="mt-8 w-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-3 mb-3 text-xs font-semibold text-[var(--color-primary)]">
          <Sparkles className="h-4 w-4" />
          <span>สลับบทบาททดสอบด่วน (สำหรับอาจารย์ผู้ตรวจและกรรมการ)</span>
        </div>
        <p className="text-xs text-[var(--color-muted)] mb-3 leading-relaxed">
          คลิกเลือกบทบาทเพื่อสลับสิทธิ์ได้ทันทีโดยไม่ต้องจำรหัสผ่าน เพื่อทดสอบความแตกต่างระหว่างสิทธิ์ลูกค้าและแอดมิน:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {mockUsers.slice(0, 4).map((user) => {
            const isAdmin = user.role_id === 1;
            const isCurrent = currentUser?.id === user.id;

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickSelect(user, isAdmin ? "/admin" : undefined)}
                className={`flex items-start gap-2.5 rounded-[var(--radius-md)] border p-2.5 text-left transition-all ${
                  isCurrent
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]"
                    : "border-[var(--color-line)] bg-[var(--color-surface-2)] hover:border-[var(--color-muted)]"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isAdmin
                      ? "bg-[var(--color-primary)] text-[#141618]"
                      : "bg-[var(--color-line)] text-[var(--color-ink)]"
                  }`}
                >
                  {isAdmin ? "AD" : "CU"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-[var(--color-ink)]">
                      {user.full_name}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        isAdmin
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {isAdmin ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <p className="truncate text-[11px] text-[var(--color-muted)]">{user.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
