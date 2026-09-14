-- ==============================================================================
-- 📚 Lampara Books - Master Database Setup & Seeding Script (PostgreSQL / Supabase)
-- โครงงาน: ระบบร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books)
-- รายวิชา: [31-407-102-301] ระบบฐานข้อมูล (Database Systems)
-- กลุ่ม: ECP3N | ห้อง: ECP 321 | อาจารย์ผู้สอน: อาจารย์ประกาศ ผ่องสยาม
-- ผู้จัดทำ: นายกานต์นิธิ ยะโส รหัสนักศึกษา 67332110223-9
-- ==============================================================================
-- วิธีใช้: คัดลอกโค้ดทั้งหมดนี้ไปวางในเมนู "SQL Editor" บน Supabase แล้วกด "Run"
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ลบตารางเดิมออกตามลำดับ Foreign Key (Clean up)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS download_links CASCADE;
DROP TABLE IF EXISTS download_tokens CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ------------------------------------------------------------------------------
-- 2. สร้างตาราง Roles (ตารางที่ 1: บทบาทผู้ใช้งานในระบบ)
-- ------------------------------------------------------------------------------
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 3. สร้างตาราง Users (ตารางที่ 2: ข้อมูลผู้ใช้งาน สมาชิก และผู้ดูแลระบบ)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. สร้างตาราง Authors (ตารางที่ 3: ข้อมูลนักเขียน/ผู้แต่ง - แยกตามหลัก 3NF)
-- ------------------------------------------------------------------------------
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. สร้างตาราง Categories (ตารางที่ 4: หมวดหมู่หนังสือ - 3NF)
-- ------------------------------------------------------------------------------
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 6. สร้างตาราง Books (ตารางที่ 5: ข้อมูลหนังสือดิจิทัล E-Book)
-- ------------------------------------------------------------------------------
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES authors(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cover_color VARCHAR(20) DEFAULT '#2F5D50',
    cover_image VARCHAR(500),
    description TEXT,
    pages INT DEFAULT 0 CHECK (pages >= 0),
    language VARCHAR(50) DEFAULT 'ไทย',
    published_year INT CHECK (published_year >= 1800),
    isbn VARCHAR(30) UNIQUE,
    rating DECIMAL(2, 1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5.0),
    featured BOOLEAN DEFAULT FALSE,
    file_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 7. สร้างตาราง Orders (ตารางที่ 6: คำสั่งซื้อหลัก)
-- ------------------------------------------------------------------------------
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    checkout_email VARCHAR(255) NOT NULL,
    checkout_name VARCHAR(150) NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Confirmed', 'Cancelled', 'Refunded')),
    email_sent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 8. สร้างตาราง Order Items (ตารางที่ 7: รายการสินค้าในคำสั่งซื้อ - 3NF)
-- ------------------------------------------------------------------------------
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_time DECIMAL(10, 2) NOT NULL CHECK (price_at_time >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 9. สร้างตาราง Payments (ตารางที่ 8: การชำระเงินและหลักฐานการโอนจำลอง)
-- ------------------------------------------------------------------------------
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'PromptPay' CHECK (payment_method IN ('PromptPay', 'BankTransfer', 'CreditCard')),
    slip_url VARCHAR(500),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    paid_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMPTZ,
    note TEXT
);

-- ------------------------------------------------------------------------------
-- 10. สร้างตาราง Download Links (ตารางที่ 9: โทเค็นและลิงก์ดาวน์โหลดที่มีเงื่อนไขความปลอดภัย)
-- ------------------------------------------------------------------------------
CREATE TABLE download_links (
    id SERIAL PRIMARY KEY,
    token VARCHAR(64) UNIQUE NOT NULL,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    download_count INT DEFAULT 0 CHECK (download_count >= 0),
    max_downloads INT DEFAULT 5 CHECK (max_downloads > 0),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 11. ดัชนีเพิ่มความเร็วในการสืบค้น (Indexes)
-- ------------------------------------------------------------------------------
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_active ON books(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_download_token ON download_links(token);

-- ------------------------------------------------------------------------------
-- 12. กำหนดนโยบายความปลอดภัย Row Level Security (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_links ENABLE ROW LEVEL SECURITY;

-- Public Read Policies สำหรับส่วนแคตตาล็อก
CREATE POLICY "Public Read Roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Public Read Authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (is_active = true);

-- Policies สำหรับการสั่งซื้อและการชำระเงิน
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Update Orders" ON orders FOR UPDATE USING (true);

CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Order Items" ON order_items FOR SELECT USING (true);

CREATE POLICY "Public Insert Payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select Payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Public Update Payments" ON payments FOR UPDATE USING (true);

CREATE POLICY "Public Select Download Links" ON download_links FOR SELECT USING (true);
CREATE POLICY "Public Insert Download Links" ON download_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Download Links" ON download_links FOR UPDATE USING (true);

CREATE POLICY "Public Access Users" ON users FOR ALL USING (true);

-- ==============================================================================