export type Role = {
  id: number;
  name: "Admin" | "Customer";
  description?: string;
  created_at?: string;
};

export type User = {
  id: number;
  role_id: number;
  role?: Role;
  email: string;
  password_hash?: string;
  full_name: string;
  phone?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type Author = {
  id: number;
  name: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  author_id?: number;
  authors?: Author;
  price: number;
  cover_color: string;
  cover_image?: string;
  category: string;
  category_id?: number;
  categories?: Category;
  description: string;
  pages: number;
  language: string;
  published_year: number;
  isbn: string;
  rating: number;
  featured?: boolean;
  file_url?: string;
  is_active?: boolean;
  created_at?: string;
};

export type CartItem = {
  book: Book;
  quantity: number;
};

export type PaymentMethod = "PromptPay" | "BankTransfer" | "CreditCard";
export type PaymentStatus = "Pending" | "Verified" | "Rejected";

export type Payment = {
  id?: number;
  order_id: number;
  payment_method: PaymentMethod;
  slip_url?: string | null;
  amount: number;
  status: PaymentStatus;
  paid_at?: string;
  verified_at?: string | null;
  note?: string | null;
};

export type DownloadLink = {
  id?: number;
  token: string;
  order_id: number;
  book_id: number;
  download_count: number;
  max_downloads: number;
  expires_at: string;
};

export type OrderStatus = "Pending" | "Paid" | "Confirmed" | "Completed" | "Cancelled" | "Refunded";

export type OrderItem = {
  id?: number;
  order_id?: number;
  book_id: number;
  title: string;
  quantity: number;
  price_at_time: number;
  file_url?: string;
};

export type Order = {
  id: number;
  user_id?: number | null;
  status: OrderStatus;
  checkout_email: string;
  checkout_name: string;
  total: number;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
  email_sent: boolean;
  payment?: Payment | null;
  download_links?: DownloadLink[];
};

export type CheckoutPayload = {
  user_id?: number | null;
  checkout_email: string;
  checkout_name: string;
  items: { book_id: number; quantity: number; price_at_time: number }[];
  total: number;
  payment_method?: PaymentMethod;
  slip_url?: string | null;
};

// ==========================================
// รายงานวิเคราะห์ 4 ด้าน (Analytical Reports)
// ==========================================

export type SalesReportRow = {
  sale_month: string;
  total_orders: number;
  total_sales: number;
  avg_order_value: number;
};

export type TopBookReportRow = {
  book_id: number;
  title: string;
  author_name: string;
  category_name: string;
  total_sold_copies: number;
  total_revenue: number;
};

export type CategorySalesReportRow = {
  category_id: number;
  category_name: string;
  total_orders: number;
  total_books_sold: number;
  total_category_revenue: number;
};

export type CustomerReportRow = {
  user_id: number;
  full_name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  confirmed_orders: number;
  pending_orders: number;
  cancelled_orders: number;
};
