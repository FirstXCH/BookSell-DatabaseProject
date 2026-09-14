"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Edit2,
  X,
  FolderTree,
  Tag,
  Save,
} from "lucide-react";
import {
  getAllBooksForAdmin,
  getCategories,
  getAuthors,
  toggleBookActive,
  createBook,
  createCategory,
  updateCategory,
  formatPrice,
} from "@/lib/api";
import type { Book, Category, Author } from "@/lib/types";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New book form state
  const [newTitle, setNewTitle] = useState("");
  const [newAuthorId, setNewAuthorId] = useState<number>(1);
  const [newCategoryId, setNewCategoryId] = useState<number>(1);
  const [newPrice, setNewPrice] = useState<number>(299);
  const [newPages, setNewPages] = useState<number>(200);
  const [newDesc, setNewDesc] = useState("");

  // Category management form state (ใบงานข้อ 3: จัดการหมวดหมู่ เพิ่ม แก้ไข)
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatSlug, setEditingCatSlug] = useState("");
  const [editingCatDesc, setEditingCatDesc] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [b, c, a] = await Promise.all([
      getAllBooksForAdmin(),
      getCategories(),
      getAuthors(),
    ]);
    setBooks(b);
    setCategories(c);
    setAuthors(a);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (bookId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    await toggleBookActive(bookId, newStatus);
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, is_active: newStatus } : b))
    );
    setNotification(
      newStatus
        ? `เปิดการขายหนังสือ #${bookId} เรียบร้อยแล้ว`
        : `ปิดการขายหนังสือ #${bookId} แล้ว (Soft Delete)`
    );
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const authorObj = authors.find((a) => a.id === Number(newAuthorId));
    const catObj = categories.find((c) => c.id === Number(newCategoryId));

    await createBook({
      title: newTitle.trim(),
      author: authorObj?.name || "ไม่ระบุผู้แต่ง",
      author_id: Number(newAuthorId),
      category: catObj?.name || "นวนิยาย",
      category_id: Number(newCategoryId),
      price: Number(newPrice),
      pages: Number(newPages),
      description: newDesc.trim(),
    });

    setShowAddModal(false);
    setNewTitle("");
    setNewDesc("");
    setNotification(`เพิ่มหนังสือ "${newTitle}" สำเร็จแล้ว!`);
    await loadData();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await createCategory(newCatName, newCatSlug, newCatDesc);
    setNotification(`เพิ่มหมวดหมู่ "${newCatName}" เรียบร้อยแล้ว!`);
    setNewCatName("");
    setNewCatSlug("");
    setNewCatDesc("");
    await loadData();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatId || !editingCatName.trim()) return;

    await updateCategory(editingCatId, editingCatName, editingCatSlug, editingCatDesc);
    setNotification(`แก้ไขหมวดหมู่ "${editingCatName}" เรียบร้อยแล้ว!`);
    setEditingCatId(null);
    await loadData();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStartEditCategory = (c: Category) => {
    setEditingCatId(c.id);
    setEditingCatName(c.name);
    setEditingCatSlug(c.slug);
    setEditingCatDesc(c.description || "");
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (selectedCategory === "all") return true;
    return b.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-line)]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[var(--color-primary)]" />
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              จัดการแคตตาล็อกหนังสือ (Books Management)
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            เพิ่ม แก้ไข และเปิด/ปิดการขายหนังสือ พร้อมจัดการหมวดหมู่ (ตามข้อกำหนดใบงานข้อ 3)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="จัดการหมวดหมู่หนังสือ (เพิ่ม / แก้ไข)"
          >
            <FolderTree className="h-4 w-4 text-[var(--color-primary)]" />
            <span>จัดการหมวดหมู่ (Categories)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>เพิ่มหนังสือใหม่</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..."
            className="input-field !pl-9 !py-2 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-[var(--color-primary)] text-[#141618] font-bold"
                : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            ทุกหมวดหมู่ ({books.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === c.name
                  ? "bg-[var(--color-primary)] text-[#141618] font-bold"
                  : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Books Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-muted)] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">ชื่อหนังสือ</th>
                <th className="py-3 px-4">ผู้แต่ง (Author)</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4">ราคา</th>
                <th className="py-3 px-4">สถานะการขาย</th>
                <th className="py-3 px-4 text-right">เปิด/ปิดการขาย (Soft Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]/60 text-[var(--color-ink)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                    กำลังโหลดข้อมูลหนังสือ...
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                    ไม่พบหนังสือที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => {
                  const isActive = book.is_active !== false;

                  return (
                    <tr key={book.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[var(--color-muted)]">
                        #{book.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[var(--color-ink)]">
                        {book.title}
                        {book.featured && (
                          <span className="ml-2 rounded bg-amber-500/10 text-amber-400 px-1.5 py-0.5 text-[9px] font-bold border border-amber-500/30">
                            แนะนำ
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--color-muted)]">
                        {book.author}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] border border-[var(--color-line)]">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold font-display text-[var(--color-primary)]">
                        {formatPrice(book.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30"
                          }`}
                        >
                          {isActive ? "พร้อมขาย" : "ปิดการขาย"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggle(book.id, isActive)}
                          className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white"
                              : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                          }`}
                        >
                          {isActive ? (
                            <>
                              <XCircle className="h-3.5 w-3.5" />
                              <span>ปิดการขาย</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>เปิดขาย</span>
                            </>
                          )}
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

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[#141618] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-line)]">
              <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">
                เพิ่มหนังสือใหม่ลงระบบ (Add Book)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  ชื่อเรื่องหนังสือ *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น มนต์เสน่ห์แห่งระบบฐานข้อมูล"
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                    ผู้แต่ง (Author 3NF) *
                  </label>
                  <select
                    value={newAuthorId}
                    onChange={(e) => setNewAuthorId(Number(e.target.value))}
                    className="input-field text-sm bg-[#141618]"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                    หมวดหมู่ (Category 3NF) *
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(Number(e.target.value))}
                    className="input-field text-sm bg-[#141618]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                    ราคาขาย (บาท) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                    จำนวนหน้า
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newPages}
                    onChange={(e) => setNewPages(Number(e.target.value))}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  เรื่องย่อ / คำอธิบาย
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="เขียนเรื่องย่อหนังสือสั้นๆ..."
                  className="input-field text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-line)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-outline text-xs"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary text-xs">
                  บันทึกลงฐานข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal (ใบงานข้อ 3: จัดการหมวดหมู่ เพิ่ม แก้ไข) */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-line)]">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-[var(--color-primary)]" />
                <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">
                  จัดการหมวดหมู่หนังสือ (Category Management)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCatId(null);
                }}
                className="rounded p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List of Existing Categories */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                หมวดหมู่ปัจจุบัน ({categories.length} หมวด)
              </span>

              <div className="mt-2 divide-y divide-[var(--color-line)] rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface-2)]/50">
                {categories.map((c) => {
                  const bookCount = books.filter(
                    (b) => b.category_id === c.id || b.category === c.name
                  ).length;
                  const isEditingThis = editingCatId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[var(--color-ink)]">
                            {c.name}
                          </span>
                          <span className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)] font-mono border border-[var(--color-line)]">
                            slug: {c.slug}
                          </span>
                          <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
                            {bookCount} เล่ม
                          </span>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-[var(--color-muted)] line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartEditCategory(c)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition-all shrink-0 self-end sm:self-center ${
                          isEditingThis
                            ? "bg-[var(--color-primary)] text-[#141618]"
                            : "text-[var(--color-muted)] hover:text-[var(--color-primary)] border border-[var(--color-line)] bg-[var(--color-surface)]"
                        }`}
                      >
                        {isEditingThis ? "กำลังแก้ไข" : "✏️ แก้ไข"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Edit Category Form or Add Category Form */}
            <div className="mt-6 pt-5 border-t border-[var(--color-line)]">
              {editingCatId ? (
                /* Edit Category Form */
                <form onSubmit={handleUpdateCategory} className="space-y-3 bg-[var(--color-surface-2)] p-4 rounded-[var(--radius-md)] border border-[var(--color-primary)]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>แก้ไขหมวดหมู่ #{editingCatId}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingCatId(null)}
                      className="text-xs text-[var(--color-muted)] hover:underline"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                        ชื่อหมวดหมู่ *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editingCatSlug}
                        onChange={(e) => setEditingCatSlug(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                      คำอธิบายหมวดหมู่
                    </label>
                    <input
                      type="text"
                      value={editingCatDesc}
                      onChange={(e) => setEditingCatDesc(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingCatId(null)}
                      className="btn-outline text-xs py-1.5 px-3"
                    >
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1">
                      <Save className="h-3.5 w-3.5" />
                      <span>บันทึกการแก้ไข</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Add New Category Form */
                <form onSubmit={handleCreateCategory} className="space-y-3 bg-[var(--color-surface-2)] p-4 rounded-[var(--radius-md)] border border-[var(--color-line)]">
                  <span className="text-xs font-bold text-[var(--color-ink)] flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>เพิ่มหมวดหมู่ใหม่</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                        ชื่อหมวดหมู่ *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น จิตวิทยา, ประวัติศาสตร์"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                        Slug (สร้างอัตโนมัติหากว่าง)
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น psychology, history"
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        className="input-field text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--color-muted)] mb-1">
                      คำอธิบายหมวดหมู่
                    </label>
                    <input
                      type="text"
                      placeholder="คำอธิบายสั้นๆ เกี่ยวกับหมวดหมู่นี้..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button type="submit" className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1">
                      <Plus className="h-3.5 w-3.5" />
                      <span>บันทึกหมวดหมู่ใหม่</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
