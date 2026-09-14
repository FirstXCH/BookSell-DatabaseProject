import type {
  Book,
  Category,
  Author,
  User,
  Order,
  OrderStatus,
  CheckoutPayload,
  SalesReportRow,
  TopBookReportRow,
  CategorySalesReportRow,
  CustomerReportRow,
} from "./types";
import {
  mockBooks,
  mockCategories,
  mockAuthors,
  mockUsers,
  mockOrders,
  calculateMockSalesReport,
  calculateMockTopBooksReport,
  calculateMockCategorySalesReport,
  calculateMockCustomerReport,
} from "./mock-data";
import { supabase, isSupabaseConfigured } from "./supabase";

// Memory storage สำหรับจำลองการแก้ไขสถานะในฝั่ง Client
let runtimeOrders: Order[] = [...mockOrders];
let runtimeBooks: Book[] = [...mockBooks];
let runtimeUsers: User[] = [...mockUsers];
let runtimeCategories: Category[] = [...mockCategories];

function getLocalOrders(): Order[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("lampara_runtime_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          runtimeOrders = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return runtimeOrders;
}

function saveLocalOrders(orders: Order[]): void {
  runtimeOrders = orders;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("lampara_runtime_orders", JSON.stringify(orders));
    } catch {}
  }
}

/**
 * ดึงแคตตาล็อกหนังสือทั้งหมด
 */
export async function getBooks(): Promise<Book[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (id, name, bio),
          categories (id, name, slug)
        `)
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          ...b,
          author: b.authors?.name || b.author || "ไม่ระบุผู้แต่ง",
          category: b.categories?.name || b.category || "ทั่วไป",
        })) as Book[];
      }
    } catch (err) {
      console.warn("Supabase getBooks fallback:", err);
    }
  }
  return runtimeBooks.filter((b) => b.is_active !== false);
}

/**
 * ดึงหนังสือทั้งหมดรวมทั้งที่ปิดการขาย (สำหรับแอดมิน)
 */
export async function getAllBooksForAdmin(): Promise<Book[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (id, name, bio),
          categories (id, name, slug)
        `)
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          ...b,
          author: b.authors?.name || b.author || "ไม่ระบุผู้แต่ง",
          category: b.categories?.name || b.category || "ทั่วไป",
        })) as Book[];
      }
    } catch {
      // fallback
    }
  }
  return runtimeBooks;
}

/**
 * ดึงรายละเอียดหนังสือรายเล่ม
 */
export async function getBook(id: number): Promise<Book | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("books")
        .select(`
          *,
          authors (id, name, bio),
          categories (id, name, slug)
        `)
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          ...data,
          author: data.authors?.name || data.author || "ไม่ระบุผู้แต่ง",
          category: data.categories?.name || data.category || "ทั่วไป",
        } as Book;
      }
    } catch {
      // fallback
    }
  }
  return runtimeBooks.find((b) => b.id === id) ?? null;
}

/**
 * ดึงหมวดหมู่ทั้งหมด
 */
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) return data as Category[];
    } catch {
      // fallback
    }
  }
  return runtimeCategories;
}

/**
 * ดึงนักเขียนทั้งหมด
 */
export async function getAuthors(): Promise<Author[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) return data as Author[];
    } catch {
      // fallback
    }
  }
  return mockAuthors;
}

/**
 * สร้างคำสั่งซื้อใหม่ (Checkout พร้อมแนบสลิปจำลอง)
 * กำหนดสถานะเป็น 'Pending' ตามเกณฑ์ใบงาน เพื่อรอผู้ดูแลตรวจสอบสลิป
 */
export async function createOrder(payload: CheckoutPayload): Promise<Order | null> {
  const newOrderId = Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  // 1. ลองบันทึกลง Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: payload.user_id || null,
          checkout_email: payload.checkout_email,
          checkout_name: payload.checkout_name,
          total: payload.total,
          status: "Pending", // รอแอดมินตรวจ
          email_sent: false,
        })
        .select()
        .single();

      if (!orderErr && orderData) {
        const orderItemsToInsert = payload.items.map((item) => {
          const book = mockBooks.find((b) => b.id === item.book_id);
          return {
            order_id: orderData.id,
            book_id: item.book_id,
            title: book?.title ?? "หนังสือ",
            quantity: item.quantity,
            price_at_time: item.price_at_time,
          };
        });

        await supabase.from("order_items").insert(orderItemsToInsert);

        // บันทึกการชำระเงิน
        try {
          await supabase.from("payments").insert({
            order_id: orderData.id,
            payment_method: payload.payment_method || "PromptPay",
            slip_url: payload.slip_url || "/slips/mock-user-slip.jpg",
            amount: payload.total,
            status: "Pending",
          });
        } catch {}

        const createdOrder: Order = {
          id: orderData.id,
          user_id: orderData.user_id,
          status: "Pending",
          checkout_email: orderData.checkout_email,
          checkout_name: orderData.checkout_name,
          total: Number(orderData.total),
          created_at: orderData.created_at,
          items: orderItemsToInsert,
          email_sent: false,
          payment: {
            order_id: orderData.id,
            payment_method: payload.payment_method || "PromptPay",
            slip_url: payload.slip_url || "/slips/mock-user-slip.jpg",
            amount: payload.total,
            status: "Pending",
          },
        };

        const currentOrders = getLocalOrders();
        saveLocalOrders([createdOrder, ...currentOrders.filter((o) => o.id !== createdOrder.id)]);
        return createdOrder;
      }
    } catch (err) {
      console.warn("Supabase createOrder fallback:", err);
    }
  }

  // 2. Fallback Mock Memory
  const newOrder: Order = {
    id: newOrderId,
    user_id: payload.user_id || 2,
    status: "Pending",
    checkout_email: payload.checkout_email,
    checkout_name: payload.checkout_name,
    total: payload.total,
    created_at: now,
    updated_at: now,
    items: payload.items.map((i) => {
      const b = mockBooks.find((book) => book.id === i.book_id);
      return {
        order_id: newOrderId,
        book_id: i.book_id,
        title: b?.title || "หนังสือ",
        quantity: i.quantity,
        price_at_time: i.price_at_time,
        file_url: b?.file_url || `/ebooks/sample-${i.book_id}.pdf`,
      };
    }),
    email_sent: false,
    payment: {
      order_id: newOrderId,
      payment_method: payload.payment_method || "PromptPay",
      slip_url: payload.slip_url || "/slips/mock-user-slip.jpg",
      amount: payload.total,
      status: "Pending",
      paid_at: now,
      note: "รอผู้ดูแลระบบตรวจสอบสลิป",
    },
  };

  const currentFallback = getLocalOrders();
  saveLocalOrders([newOrder, ...currentFallback.filter((o) => o.id !== newOrder.id)]);

  if (typeof window !== "undefined") {
    sessionStorage.setItem(`order_${newOrderId}`, JSON.stringify(newOrder));
    sessionStorage.setItem("latest_order", JSON.stringify(newOrder));
  }

  return newOrder;
}

/**
 * ดึงข้อมูลคำสั่งซื้อตาม ID
 */
export async function getOrder(id: number): Promise<Order | null> {
  // ตรวจใน Runtime Memory ก่อนเสมอเพื่อให้สะท้อนสถานะสด
  const memoryMatch = runtimeOrders.find((o) => o.id === id);
  if (memoryMatch) return memoryMatch;

  if (isSupabaseConfigured && supabase && id > 0) {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          payments (*)
        `)
        .eq("id", id)
        .single();

      if (!error && order) {
        return {
          id: order.id,
          user_id: order.user_id,
          status: order.status,
          checkout_email: order.checkout_email,
          checkout_name: order.checkout_name,
          total: Number(order.total),
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: order.order_items || [],
          email_sent: order.email_sent,
          payment: order.payments?.[0] || order.payments || null,
        };
      }
    } catch {}
  }

  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(`order_${id}`) || sessionStorage.getItem("latest_order");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }

  return mockOrders.find((o) => o.id === id) ?? mockOrders[0];
}

/**
 * ดึงคำสั่งซื้อทั้งหมด (สำหรับแอดมิน หรือกรองตาม user_id)
 */
export async function getOrders(userId?: number): Promise<Order[]> {
  const localList = getLocalOrders();
  let ordersList: Order[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("orders").select(`
        *,
        order_items (*),
        payments (*)
      `).order("id", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        ordersList = data.map((o: any) => ({
          id: o.id,
          user_id: o.user_id,
          status: o.status,
          checkout_email: o.checkout_email,
          checkout_name: o.checkout_name,
          total: Number(o.total),
          created_at: o.created_at,
          updated_at: o.updated_at,
          items: o.order_items || [],
          email_sent: o.email_sent,
          payment: o.payments?.[0] || o.payments || null,
        }));
      }
    } catch {}
  }

  if (ordersList.length === 0) {
    ordersList = localList;
  } else {
    // ผสานรายการคำสั่งซื้อจาก Local ที่ยังไม่มีใน Supabase หรือเพิ่งสั่งซื้อ
    const existingIds = new Set(ordersList.map((o) => o.id));
    for (const lo of localList) {
      if (!existingIds.has(lo.id)) {
        ordersList.push(lo);
      }
    }
  }

  if (userId) {
    return ordersList.filter((o) => o.user_id === userId);
  }
  return ordersList;
}

/**
 * ปรับเปลี่ยนสถานะคำสั่งซื้อ (สำหรับแอดมิน ยืนยันสลิป / ยกเลิก)
 * ถ้า 'Confirmed' จะสร้าง download_links ให้โดยอัตโนมัติ
 */
export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
  note?: string
): Promise<boolean> {
  const now = new Date().toISOString();

  // อัปเดตใน Runtime Memory & LocalStorage
  const allOrders = getLocalOrders();
  const orderIdx = allOrders.findIndex((o) => o.id === orderId);
  if (orderIdx !== -1) {
    allOrders[orderIdx] = {
      ...allOrders[orderIdx],
      status,
      updated_at: now,
      payment: allOrders[orderIdx].payment
        ? {
            ...allOrders[orderIdx].payment!,
            status: status === "Confirmed" ? "Verified" : status === "Cancelled" ? "Rejected" : "Pending",
            verified_at: status === "Confirmed" ? now : null,
            note: note || (status === "Confirmed" ? "ผู้ดูแลตรวจสอบสลิปแล้ว อนุมัติการดาวน์โหลด" : "ยกเลิกคำสั่งซื้อ"),
          }
        : undefined,
      download_links:
        status === "Confirmed"
          ? allOrders[orderIdx].items.map((it) => ({
              token: `tok_${orderId}_b${it.book_id}_${Math.random().toString(36).substring(2, 8)}`,
              order_id: orderId,
              book_id: it.book_id,
              download_count: 0,
              max_downloads: 5,
              expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }))
          : [],
    };
    saveLocalOrders([...allOrders]);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(`order_${orderId}`, JSON.stringify(allOrders[orderIdx]));
    }
  }

  // อัปเดตใน Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("orders")
        .update({ status, updated_at: now })
        .eq("id", orderId);

      try {
        await supabase
          .from("payments")
          .update({
            status: status === "Confirmed" ? "Verified" : "Rejected",
            verified_at: status === "Confirmed" ? now : null,
            note,
          })
          .eq("order_id", orderId);
      } catch {}

      return true;
    } catch {}
  }

  return true;
}

/**
 * ดึงผู้ใช้งานทั้งหมด (สำหรับแอดมิน)
 */
export async function getUsers(): Promise<User[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          roles (id, name)
        `)
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) return data as User[];
    } catch {}
  }
  return runtimeUsers;
}

/**
 * ปรับเปลี่ยนบทบาทผู้ใช้ (Customer <-> Admin)
 */
export async function updateUserRole(userId: number, roleId: number): Promise<boolean> {
  const user = runtimeUsers.find((u) => u.id === userId);
  if (user) {
    user.role_id = roleId;
    user.role = roleId === 1 ? { id: 1, name: "Admin" } : { id: 2, name: "Customer" };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("users").update({ role_id: roleId }).eq("id", userId);
      return true;
    } catch {}
  }
  return true;
}

/**
 * สลับสถานะเปิด/ปิดการขายหนังสือ (Soft Delete)
 */
export async function toggleBookActive(bookId: number, isActive: boolean): Promise<boolean> {
  const book = runtimeBooks.find((b) => b.id === bookId);
  if (book) {
    book.is_active = isActive;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("books").update({ is_active: isActive }).eq("id", bookId);
      return true;
    } catch {}
  }
  return true;
}

/**
 * เพิ่มหนังสือใหม่
 */
export async function createBook(book: Partial<Book>): Promise<Book> {
  const newId = runtimeBooks.length + 1;
  const newBook: Book = {
    id: newId,
    title: book.title || "หนังสือเล่มใหม่",
    author: book.author || "ไม่ระบุผู้แต่ง",
    author_id: book.author_id || 1,
    price: Number(book.price) || 0,
    cover_color: book.cover_color || "#2F5D50",
    category: book.category || "นวนิยาย",
    category_id: book.category_id || 1,
    description: book.description || "",
    pages: Number(book.pages) || 100,
    language: book.language || "ไทย",
    published_year: Number(book.published_year) || 2026,
    isbn: book.isbn || `978-616-${Math.floor(1000000 + Math.random() * 9000000)}`,
    rating: 5.0,
    featured: Boolean(book.featured),
    is_active: true,
    file_url: book.file_url || `/ebooks/sample-${newId}.pdf`,
  };

  runtimeBooks.unshift(newBook);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("books").insert({
        title: newBook.title,
        author_id: newBook.author_id,
        category_id: newBook.category_id,
        price: newBook.price,
        cover_color: newBook.cover_color,
        description: newBook.description,
        pages: newBook.pages,
        language: newBook.language,
        published_year: newBook.published_year,
        isbn: newBook.isbn,
        featured: newBook.featured,
        is_active: true,
      });
    } catch {}
  }

  return newBook;
}

// ==============================================================================
export async function getSalesReport(): Promise<SalesReportRow[]> {
  const orders = await getOrders();
  const confirmedOrders = orders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const monthsMap = new Map<string, { total: number; count: number }>();
  confirmedOrders.forEach((o) => {
    const dateStr = o.created_at || new Date().toISOString();
    const month = dateStr.slice(0, 7);
    const curr = monthsMap.get(month) || { total: 0, count: 0 };
    curr.total += Number(o.total) || 0;
    curr.count += 1;
    monthsMap.set(month, curr);
  });

  return Array.from(monthsMap.entries())
    .map(([sale_month, val]) => ({
      sale_month,
      total_orders: val.count,
      total_sales: Math.round(val.total * 100) / 100,
      avg_order_value: Math.round((val.total / (val.count || 1)) * 100) / 100,
    }))
    .sort((a, b) => b.sale_month.localeCompare(a.sale_month));
}

export async function getTopBooksReport(): Promise<TopBookReportRow[]> {
  const [orders, allBooks] = await Promise.all([getOrders(), getAllBooksForAdmin()]);
  const confirmedOrders = orders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const bookSales = new Map<number, { copies: number; revenue: number }>();
  confirmedOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const curr = bookSales.get(item.book_id) || { copies: 0, revenue: 0 };
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price_at_time) || 0;
      curr.copies += qty;
      curr.revenue += qty * price;
      bookSales.set(item.book_id, curr);
    });
  });

  return Array.from(bookSales.entries())
    .map(([bookId, stats]) => {
      const book = allBooks.find((b) => b.id === bookId);
      return {
        book_id: bookId,
        title: book?.title || `Book #${bookId}`,
        author_name: book?.author || "ไม่ระบุผู้แต่ง",
        category_name: book?.category || "ทั่วไป",
        total_sold_copies: stats.copies,
        total_revenue: Math.round(stats.revenue * 100) / 100,
      };
    })
    .sort((a, b) => b.total_sold_copies - a.total_sold_copies || b.total_revenue - a.total_revenue)
    .slice(0, 5);
}

export async function getCategorySalesReport(): Promise<CategorySalesReportRow[]> {
  const [orders, allBooks, allCategories] = await Promise.all([
    getOrders(),
    getAllBooksForAdmin(),
    getCategories(),
  ]);

  const confirmedOrders = orders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const categoryMap = new Map<
    string,
    { id: number; ordersSet: Set<number>; copies: number; revenue: number }
  >();

  allCategories.forEach((c) => {
    categoryMap.set(c.name, { id: c.id, ordersSet: new Set(), copies: 0, revenue: 0 });
  });

  confirmedOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const book = allBooks.find((b) => b.id === item.book_id);
      const catName = book?.category || "ทั่วไป";
      let cat = categoryMap.get(catName);
      if (!cat) {
        cat = { id: categoryMap.size + 1, ordersSet: new Set(), copies: 0, revenue: 0 };
        categoryMap.set(catName, cat);
      }
      cat.ordersSet.add(o.id);
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price_at_time) || 0;
      cat.copies += qty;
      cat.revenue += qty * price;
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category_name, data]) => ({
      category_id: data.id,
      category_name,
      total_orders: data.ordersSet.size,
      total_books_sold: data.copies,
      total_category_revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => b.total_category_revenue - a.total_category_revenue);
}

export async function getCustomerReport(): Promise<CustomerReportRow[]> {
  const [orders, allUsers] = await Promise.all([getOrders(), getUsers()]);
  const customers = allUsers.filter((u) => u.role_id === 2);

  return customers
    .map((cust) => {
      const custOrders = orders.filter(
        (o) =>
          (o.user_id && o.user_id === cust.id) ||
          (o.checkout_email && o.checkout_email.toLowerCase() === cust.email.toLowerCase())
      );
      const confirmedOrders = custOrders.filter(
        (o) => o.status === "Confirmed" || o.status === "Completed"
      );
      const pendingOrders = custOrders.filter((o) => o.status === "Pending");
      const cancelledOrders = custOrders.filter((o) => o.status === "Cancelled");
      const totalSpent = confirmedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      return {
        user_id: cust.id,
        full_name: cust.full_name,
        email: cust.email,
        total_orders: custOrders.length,
        total_spent: Math.round(totalSpent * 100) / 100,
        confirmed_orders: confirmedOrders.length,
        pending_orders: pendingOrders.length,
        cancelled_orders: cancelledOrders.length,
      };
    })
    .sort((a, b) => b.total_spent - a.total_spent);
}


// ==============================================================================
// การจัดการหมวดหมู่หนังสือ (Category Management - ใบงานข้อ 3)
// ==============================================================================

export async function createCategory(
  name: string,
  slug: string,
  description: string = ""
): Promise<Category | null> {
  const newId = (runtimeCategories.length > 0 ? Math.max(...runtimeCategories.map((c) => c.id)) : 0) + 1;
  const newCat: Category = {
    id: newId,
    name: name.trim(),
    slug: slug.trim() || `category-${newId}`,
    description: description.trim(),
  };

  runtimeCategories.push(newCat);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCat.name,
          slug: newCat.slug,
          description: newCat.description,
        })
        .select()
        .single();
      if (!error && data) return data as Category;
    } catch (err) {
      console.warn("createCategory supabase error:", err);
    }
  }
  return newCat;
}

export async function updateCategory(
  id: number,
  name: string,
  slug: string,
  description: string = ""
): Promise<boolean> {
  const found = runtimeCategories.find((c) => c.id === id);
  if (found) {
    found.name = name.trim();
    found.slug = slug.trim() || found.slug;
    found.description = description.trim();
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("categories")
        .update({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
        })
        .eq("id", id);
      return true;
    } catch {}
  }
  return true;
}

// ==============================================================================
// Session & Auth Helpers (Supabase Google OAuth, Sign Up, Profile Edit)
// ==============================================================================

/**
 * ดึงสถานะผู้ใช้งานปัจจุบันจาก LocalStorage (คืนค่า null หากยังไม่ได้เข้าสู่ระบบ)
 */
export function getDemoCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("demo_current_user");
    if (saved) {
      try {
        return JSON.parse(saved) as User;
      } catch {}
    }
  }
  return null;
}

/**
 * บันทึกผู้ใช้ปัจจุบันและแจ้งเตือน Event ทั่วทั้งระบบ
 */
export function setDemoCurrentUser(user: User | null): void {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("demo_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("demo_current_user");
    }
    window.dispatchEvent(new Event("user-changed"));
  }
}

/**
 * ออกจากระบบ (Sign Out)
 */
export async function signOutUser(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo_current_user");
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    window.dispatchEvent(new Event("user-changed"));
  }
}

/**
 * สมัครสมาชิกใหม่ (Sign Up) พร้อมบันทึกเข้า Supabase ตาราง users (สิทธิ์ Customer: role_id = 2)
 */
export async function signUpUser(params: {
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  const emailClean = params.email.trim().toLowerCase();
  const nameClean = params.full_name.trim();
  const phoneClean = params.phone?.trim() || "";

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. ตรวจสอบว่ามีอีเมลนี้ในฐานข้อมูลหรือยัง
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", emailClean)
        .maybeSingle();

      if (existingUser) {
        return {
          success: false,
          error: "อีเมลนี้มีบัญชีในระบบแล้ว กรุณาไปที่แท็บเข้าสู่ระบบ",
        };
      }

      // 2. หากมีรหัสผ่าน ให้สร้างบัญชีผ่าน Supabase Auth
      if (params.password) {
        await supabase.auth.signUp({
          email: emailClean,
          password: params.password,
          options: {
            data: {
              full_name: nameClean,
              phone: phoneClean,
            },
          },
        });
      }

      // 3. บันทึกเข้าตาราง public.users ของฐานข้อมูล
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          role_id: 2, // สิทธิ์ลูกค้า
          email: emailClean,
          password_hash: params.password ? "scrypt_cust_pass_hash" : "oauth_google",
          full_name: nameClean,
          phone: phoneClean,
        })
        .select()
        .single();

      if (!insertError && newUser) {
        const userObj: User = {
          id: newUser.id,
          role_id: 2,
          email: newUser.email,
          full_name: newUser.full_name,
          phone: newUser.phone,
          created_at: newUser.created_at,
        };
        runtimeUsers.push(userObj);
        setDemoCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err: any) {
      console.warn("Supabase signUpUser error:", err);
    }
  }

  // Fallback กรณีออฟไลน์/จำลอง
  const newId = (runtimeUsers.length > 0 ? Math.max(...runtimeUsers.map((u) => u.id)) : 10) + 1;
  const userObj: User = {
    id: newId,
    role_id: 2,
    email: emailClean,
    full_name: nameClean,
    phone: phoneClean,
    created_at: new Date().toISOString(),
  };
  runtimeUsers.push(userObj);
  setDemoCurrentUser(userObj);
  return { success: true, user: userObj };
}

/**
 * เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
 */
export async function signInWithEmail(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const emailClean = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      if (password) {
        await supabase.auth.signInWithPassword({
          email: emailClean,
          password,
        });
      }

      const { data: userInDb } = await supabase
        .from("users")
        .select("*, roles(id, name)")
        .eq("email", emailClean)
        .maybeSingle();

      if (userInDb) {
        const userObj: User = {
          id: userInDb.id,
          role_id: userInDb.role_id,
          email: userInDb.email,
          full_name: userInDb.full_name,
          phone: userInDb.phone,
          created_at: userInDb.created_at,
        };
        setDemoCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    } catch (err: any) {
      console.warn("Supabase signInWithEmail error:", err);
    }
  }

  // Fallback
  const found = runtimeUsers.find((u) => u.email.toLowerCase() === emailClean);
  if (found) {
    setDemoCurrentUser(found);
    return { success: true, user: found };
  }

  return {
    success: false,
    error: "ไม่พบข้อมูลผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิกก่อนเข้าใช้งาน",
  };
}

/**
 * เรียกเปิดใช้งาน Google OAuth ผ่าน Supabase
 */
export async function signInWithGoogle(): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: "ระบบ Supabase ยังไม่ได้ตั้งค่า URL หรือ API Key" };
  }

  try {
    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/login`
      : "http://localhost:3000/login";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data?.url) {
      return { url: data.url };
    }
    return {};
  } catch (err: any) {
    return { error: err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ Google OAuth" };
  }
}

/**
 * ตรวจสอบและซิงค์ผู้ใช้จาก Supabase OAuth เข้ากับตาราง public.users
 */
export async function syncSupabaseOAuthUser(authUser: any): Promise<User | null> {
  if (!authUser || !authUser.email || !supabase) return null;

  const email = authUser.email.toLowerCase();
  try {
    // 1. ค้นหาใน users table
    const { data: existing } = await supabase
      .from("users")
      .select("*, roles(id, name)")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      const userObj: User = {
        id: existing.id,
        role_id: existing.role_id,
        email: existing.email,
        full_name: existing.full_name,
        phone: existing.phone,
        created_at: existing.created_at,
      };
      setDemoCurrentUser(userObj);
      return userObj;
    }

    // 2. หากเป็นผู้ใช้ใหม่จาก Google ที่ยังไม่เคยมีในฐานข้อมูล ให้สร้างเป็น Customer (role_id = 2)
    // ยกเว้นกรณีอีเมลแอดมินกลาง
    const roleId = email === "admin@lampara.com" ? 1 : 2;
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      email.split("@")[0] ||
      "สมาชิก Google";

    const { data: createdUser, error } = await supabase
      .from("users")
      .insert({
        role_id: roleId,
        email: email,
        password_hash: "oauth_google",
        full_name: fullName,
        phone: authUser.phone || "",
      })
      .select()
      .single();

    if (!error && createdUser) {
      const userObj: User = {
        id: createdUser.id,
        role_id: createdUser.role_id,
        email: createdUser.email,
        full_name: createdUser.full_name,
        phone: createdUser.phone,
        created_at: createdUser.created_at,
      };
      runtimeUsers.push(userObj);
      setDemoCurrentUser(userObj);
      return userObj;
    }
  } catch (err) {
    console.warn("syncSupabaseOAuthUser error:", err);
  }
  return null;
}

/**
 * แก้ไขข้อมูลพื้นฐานสมาชิก (ชื่อ-นามสกุล, เบอร์โทร, อีเมล, บัญชีธนาคารยืนยันตัวตน) - ตามเกณฑ์ใบงานข้อ 2.1
 */
export async function updateUserProfile(
  userId: number,
  fullName: string,
  phone: string,
  email?: string,
  bankAccountName?: string,
  bankAccountNumber?: string,
  bankName?: string
): Promise<boolean> {
  const nameClean = fullName.trim();
  const phoneClean = phone.trim();
  const emailClean = email?.trim();
  const bankAccountNameClean = bankAccountName?.trim();
  const bankAccountNumberClean = bankAccountNumber?.trim();
  const bankNameClean = bankName?.trim();

  const user = runtimeUsers.find((u) => u.id === userId);
  if (user) {
    user.full_name = nameClean;
    user.phone = phoneClean;
    if (emailClean) user.email = emailClean;
    if (bankAccountNameClean !== undefined) user.bank_account_name = bankAccountNameClean;
    if (bankAccountNumberClean !== undefined) user.bank_account_number = bankAccountNumberClean;
    if (bankNameClean !== undefined) user.bank_name = bankNameClean;
  }

  const currentUser = getDemoCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.full_name = nameClean;
    currentUser.phone = phoneClean;
    if (emailClean) currentUser.email = emailClean;
    if (bankAccountNameClean !== undefined) currentUser.bank_account_name = bankAccountNameClean;
    if (bankAccountNumberClean !== undefined) currentUser.bank_account_number = bankAccountNumberClean;
    if (bankNameClean !== undefined) currentUser.bank_name = bankNameClean;
    setDemoCurrentUser(currentUser);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const updateData: any = {
        full_name: nameClean,
        phone: phoneClean,
        updated_at: new Date().toISOString(),
      };
      if (emailClean) updateData.email = emailClean;

      // พยายามอัปเดตข้อมูลบัญชีธนาคารหากมีคอลัมน์ใน Supabase
      if (bankAccountNameClean !== undefined) updateData.bank_account_name = bankAccountNameClean;
      if (bankAccountNumberClean !== undefined) updateData.bank_account_number = bankAccountNumberClean;
      if (bankNameClean !== undefined) updateData.bank_name = bankNameClean;

      const { error } = await supabase.from("users").update(updateData).eq("id", userId);
      if (error && error.message.includes("column")) {
        // กรณี Supabase schema cache ยังไม่มีคอลัมน์ bank
        await supabase
          .from("users")
          .update({
            full_name: nameClean,
            phone: phoneClean,
            ...(emailClean ? { email: emailClean } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
      }
      return true;
    } catch {}
  }

  return true;
}

export function formatPrice(price: number): string {
  return `฿${(price || 0).toLocaleString("th-TH")}`;
}

