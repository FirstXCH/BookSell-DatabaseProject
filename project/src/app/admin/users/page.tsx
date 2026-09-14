"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { getUsers, updateUserRole } from "@/lib/api";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (userId: number, currentRoleId: number) => {
    const newRoleId = currentRoleId === 1 ? 2 : 1;
    await updateUserRole(userId, newRoleId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              role_id: newRoleId,
              role: newRoleId === 1 ? { id: 1, name: "Admin" } : { id: 2, name: "Customer" },
            }
          : u
      )
    );
    setNotification(
      `เปลี่ยนบทบาทของผู้ใช้ #${userId} เป็น "${newRoleId === 1 ? "ผู้ดูแลระบบ (Admin)" : "ลูกค้า (Customer)"}" สำเร็จแล้ว`
    );
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--color-primary)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              จัดการผู้ใช้และบทบาท (Users & Roles)
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            ตามข้อกำหนดใบงานข้อ 3: ดูข้อมูลสมาชิกและกำหนดบทบาทระหว่างลูกค้ากับผู้ดูแลร้าน
          </p>
        </div>
      </div>

      {notification && (
        <div className="rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อหรืออีเมลสมาชิก..."
          className="input-field !pl-9 !py-2 text-xs"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">ชื่อสมาชิก</th>
                <th className="py-3 px-4">อีเมล</th>
                <th className="py-3 px-4">เบอร์โทร</th>
                <th className="py-3 px-4">บทบาทปัจจุบัน</th>
                <th className="py-3 px-4 text-right">ปรับเปลี่ยนบทบาท (Role)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]/60 text-[var(--color-ink)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--color-muted)]">
                    กำลังโหลดข้อมูลผู้ใช้...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--color-muted)]">
                    ไม่พบผู้ใช้ที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role_id === 1;

                  return (
                    <tr key={user.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[var(--color-muted)]">
                        #{user.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--color-ink)]">
                        {user.full_name}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-muted)] font-mono">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-muted)]">
                        {user.phone || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isAdmin
                              ? "bg-[var(--color-primary)] text-[#141618]"
                              : "bg-[var(--color-surface-2)] text-[var(--color-muted)] border border-[var(--color-line)]"
                          }`}
                        >
                          {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                          <span>{isAdmin ? "Admin (ผู้ดูแล)" : "Customer (ลูกค้า)"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(user.id, user.role_id)}
                          className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                            isAdmin
                              ? "border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-rose-400"
                              : "border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-black"
                          }`}
                        >
                          <span>{isAdmin ? "เปลี่ยนเป็นลูกค้า" : "แต่งตั้งเป็นแอดมิน"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
