# เล่มรายงานโครงงานระบบฐานข้อมูล (Database Mini Project Report)

## ระบบร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books)

**รายวิชา:** [31-407-102-301] ระบบฐานข้อมูล (Database Systems)  
**หลักสูตร:** วิศวกรรมคอมพิวเตอร์ (ECP) ชั้นปีที่ 3 ห้อง ECP 321  
**คณะ:** วิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (มทร.อีสาน)  
**อาจารย์ผู้สอน:** อาจารย์ประภาส ผ่องสนาม  
**ผู้จัดทำ:** นายกานต์นิธิ ยะโส รหัสนักศึกษา 67332110223-9  
**ภาคเรียนที่:** 1 ปีการศึกษา 2569

---

## 1. ข้อมูลกลุ่มและภาพรวมโครงงาน

| รายการ                            | รายละเอียด                                                                        |
| :-------------------------------- | :-------------------------------------------------------------------------------- |
| **ชื่อโครงงาน**                   | ระบบร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books E-Book Store)                   |
| **ผู้จัดทำ**                      | นายกานต์นิธิ ยะโส (รหัส 67332110223-9)                                            |
| **เครื่องมือที่ใช้พัฒนา**         | **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**   |
| **ระบบจัดการฐานข้อมูล (DBMS)**    | **PostgreSQL (Supabase Cloud Database)**                                          |
| **สถาปัตยกรรม**                   | 3-Tier Web Application (Client UI, Next.js Server/API, PostgreSQL Supabase DB)    |
| **Repository ลิงก์**              | `https://github.com/Firstyaso/BookSell-DatabaseProject`                           |
| **ลิงก์เชื่อมโยงโครงงานวิชา SWE** | เชื่อมโยงกับโครงงาน Inventory System (วิศวกรรมซอฟต์แวร์ อ.ดร.ปิยะนุช ตั้งกิตติพล) |

---

## 2. สถานการณ์โจทย์และขอบเขตงานขั้นต่ำ (ตามใบงานข้อ 1 - 2)

### 2.1 สถานการณ์โจทย์

ร้าน **Lampara Books** ต้องการระบบสำหรับจำหน่ายหนังสือดิจิทัล (E-Book) เพื่อให้ลูกค้าสามารถสมัครสมาชิก เข้าสู่ระบบ ค้นหาหนังสือ คัดกรองตามหมวดหมู่ เพิ่มสินค้าลงตะกร้า ทำการสั่งซื้อ และแนบหลักฐานการชำระเงินจำลอง เมื่อผู้ดูแลระบบตรวจสอบและกดยืนยันคำสั่งซื้อแล้ว ระบบจะสร้างโทเค็นและเปิดสิทธิ์ให้ดาวน์โหลดไฟล์ E-Book ได้ทันที ผู้ดูแลระบบสามารถบริหารจัดการรายการหนังสือ หมวดหมู่ คำสั่งซื้อ สมาชิก และสามารถดึงรายงานวิเคราะห์แนวโน้มการขายจากฐานข้อมูลจริงได้

### 2.2 ขอบเขตส่วนหน้าร้าน (Customer / ผู้ใช้งาน)

1. **ระบบสมาชิก (Membership & Profile)**:
   - สมัครสมาชิกใหม่ (Sign Up) บันทึกลงตาราง `users` สิทธิ์ลูกค้า (`role_id: 2`)
   - เข้าสู่ระบบ (Sign In) ด้วยอีเมลและรหัสผ่าน
   - แก้ไขข้อมูลพื้นฐานของสมาชิก (ชื่อ-นามสกุล, เบอร์โทรศัพท์, อีเมล) ผ่านปุ่มเฟืองการตั้งค่า (⚙️)
   - ระบุข้อมูลบัญชีธนาคารเพื่อยืนยันตัวตน (ชื่อบัญชี, เลขที่บัญชี, ธนาคาร)
   - ดูประวัติคำสั่งซื้อของตนเอง (`/orders`)
2. **รายการ E-Book และการค้นหา**:
   - แสดงรายการหนังสือพร้อมภาพปก ชื่อเรื่อง ผู้แต่ง ราคา หมวดหมู่ คำอธิบาย จำนวนหน้า ปีที่พิมพ์ และสถานะพร้อมขาย (`is_active: true`)
   - ค้นหาด้วยคำสำคัญ (Keyword Search) และตัวกรองหมวดหมู่ (Category Filter)
3. **ตะกร้าสินค้า (Shopping Cart)**:
   - เพิ่มหนังสือเข้าตะกร้า ปรับจำนวน ลบรายการ คำนวณราคารวมและส่วนลดแบบ Real-time
4. **การสั่งซื้อและการชำระเงินจำลอง (Checkout & Mock Payment)**:
   - บันทึกคำสั่งซื้อหลัก (`orders`) และรายการย่อย (`order_items`)
   - แนบสลิปการโอนเงินจำลอง และเลือกช่องทางชำระเงิน (พร้อมเพย์ / โอนผ่านธนาคาร)
   - ตรวจสอบความถูกต้องระหว่างชื่อผู้สั่งซื้อและชื่อบัญชียืนยันตัวตน
5. **การดาวน์โหลด E-Book (Secure Download)**:
   - ระบบจะเปิดลิงก์ดาวน์โหลด (`download_links`) **เฉพาะเมื่อคำสั่งซื้อมีสถานะเป็น Confirmed (อนุมัติแล้ว) เท่านั้น**
   - มีระบบนับจำนวนครั้งที่ดาวน์โหลด (`download_count`) กำหนดเพดานดาวน์โหลดสูงสุด 5 ครั้ง (`max_downloads: 5`) และมีวันหมดอายุ (`expires_at`)
   - คำสั่งซื้อที่ยังไม่ยืนยัน (`Pending`) หรือถูกยกเลิก (`Cancelled`) จะไม่สามารถเข้าถึงไฟล์ได้เด็ดขาด

### 2.3 ขอบเขตส่วนหลังบ้าน (Admin / ผู้ดูแลระบบ)

1. **การป้องกันสิทธิ์เข้าถึง (Role-Based Access Control - 403 Forbidden)**:
   - บุคคลทั่วไปหรือลูกค้าไม่สามารถเห็นปุ่มหลังบ้านบน Navbar ได้
   - มี Route Guard บล็อก URL `/admin/*` ด้วยหน้า **403 Forbidden Access Denied**
2. **จัดการ E-Book (`/admin/books`)**:
   - เพิ่มหนังสือใหม่, แก้ไขข้อมูลหนังสือ, สลับสถานะเปิด/ปิดการขาย (Soft Delete)
3. **จัดการหมวดหมู่ (`/admin/books` - Categories Modal)**:
   - เพิ่มหมวดหมู่ใหม่ กำหนด slug และคำอธิบาย, แก้ไขชื่อหมวดหมู่
4. **จัดการคำสั่งซื้อ (`/admin/orders`)**:
   - ค้นหาคำสั่งซื้อ กรองตามสถานะ ดูหลักฐานสลิปโอนเงิน
   - กดยืนยันคำสั่งซื้อ (`Confirmed`) เพื่อปลดล็อกลิงก์ดาวน์โหลดให้ลูกค้า หรือกดยกเลิก (`Cancelled`)
5. **จัดการผู้ใช้งาน (`/admin/users`)**:
   - ดูรายชื่อสมาชิกทั้งหมด และปรับเปลี่ยนบทบาทผู้ใช้ (Customer <-> Admin)
6. **รายงานวิเคราะห์ข้อมูลเชิงลึก (`/admin/reports`)**:
   - แสดงผลรายงานวิเคราะห์ 4 ด้าน รัน SQL Query เชื่อมโยงหลายตาราง และส่งออกไฟล์ CSV (UTF-8 BOM) ได้

---

## 3. การออกแบบฐานข้อมูล (Database Design & Normalization)

### 3.1 การจัดระดับ Normalization (3NF)

ฐานข้อมูลได้รับการออกแบบตามหลักการ Normalization ระดับ 3NF อย่างเคร่งครัด:

- **1NF**: ทุกคอลัมน์เป็น Atomic Value ไม่มี Repeating Groups
- **2NF**: ตารางที่มี Composite Key หรืออ้างอิงตารางอื่น ไม่มี Partial Dependency ข้อมูลทุกฟิลด์ขึ้นตรงกับ Primary Key ทั้งหมด (แยก `authors`, `categories` ออกจาก `books`)
- **3NF**: ขจัด Transitive Dependency โดยแยกข้อมูลบทบาท (`roles`), การชำระเงิน (`payments`), รายการสั่งซื้อย่อย (`order_items`), และโทเค็นดาวน์โหลด (`download_links`) ออกเป็นตารางเฉพาะ ไม่เก็บข้อมูลคำนวณซ้ำซ้อน

### 3.2 ตารางข้อมูลในระบบ (Data Dictionary - 9 ตาราง)

#### ตารางที่ 1: `roles` (บทบาทผู้ใช้งาน)

| ชื่อฟิลด์     | ชนิดข้อมูล  | Constraints               | ความหมาย                        |
| :------------ | :---------- | :------------------------ | :------------------------------ |
| `id`          | SERIAL      | PRIMARY KEY               | รหัสบทบาท (1=Admin, 2=Customer) |
| `name`        | VARCHAR(50) | UNIQUE, NOT NULL          | ชื่อบทบาท                       |
| `description` | TEXT        | NULL                      | คำอธิบายสิทธิ์                  |
| `created_at`  | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันที่สร้าง                     |

#### ตารางที่ 2: `users` (ข้อมูลสมาชิกและผู้ดูแลระบบ)

| ชื่อฟิลด์             | ชนิดข้อมูล   | Constraints               | ความหมาย                         |
| :-------------------- | :----------- | :------------------------ | :------------------------------- |
| `id`                  | SERIAL       | PRIMARY KEY               | รหัสผู้ใช้งาน                    |
| `role_id`             | INT          | FK -> roles(id), NOT NULL | รหัสบทบาท                        |
| `email`               | VARCHAR(255) | UNIQUE, NOT NULL          | อีเมลผู้ใช้งาน                   |
| `password_hash`       | VARCHAR(255) | NOT NULL                  | รหัสผ่านแฮช                      |
| `full_name`           | VARCHAR(150) | NOT NULL                  | ชื่อ-นามสกุล                     |
| `phone`               | VARCHAR(30)  | NULL                      | เบอร์โทรศัพท์                    |
| `bank_account_name`   | VARCHAR(150) | NULL                      | ชื่อบัญชีธนาคารสำหรับยืนยันตัวตน |
| `bank_account_number` | VARCHAR(50)  | NULL                      | เลขที่บัญชีธนาคาร                |
| `bank_name`           | VARCHAR(100) | NULL                      | ธนาคาร/ผู้ให้บริการ              |
| `created_at`          | TIMESTAMPTZ  | DEFAULT CURRENT_TIMESTAMP | วันที่สมัคร                      |
| `updated_at`          | TIMESTAMPTZ  | DEFAULT CURRENT_TIMESTAMP | วันที่แก้ไขล่าสุด                |

#### ตารางที่ 3: `authors` (ผู้แต่ง / นักเขียน)

| ชื่อฟิลด์    | ชนิดข้อมูล   | Constraints               | ความหมาย            |
| :----------- | :----------- | :------------------------ | :------------------ |
| `id`         | SERIAL       | PRIMARY KEY               | รหัสผู้แต่ง         |
| `name`       | VARCHAR(150) | NOT NULL                  | ชื่อ-นามสกุลผู้แต่ง |
| `bio`        | TEXT         | NULL                      | ประวัติโดยย่อ       |
| `email`      | VARCHAR(255) | NULL                      | อีเมลติดต่อผู้แต่ง  |
| `avatar_url` | VARCHAR(500) | NULL                      | ลิงก์รูปภาพประจำตัว |
| `created_at` | TIMESTAMPTZ  | DEFAULT CURRENT_TIMESTAMP | วันที่บันทึก        |

#### ตารางที่ 4: `categories` (หมวดหมู่หนังสือ)

| ชื่อฟิลด์     | ชนิดข้อมูล   | Constraints               | ความหมาย             |
| :------------ | :----------- | :------------------------ | :------------------- |
| `id`          | SERIAL       | PRIMARY KEY               | รหัสหมวดหมู่         |
| `name`        | VARCHAR(100) | UNIQUE, NOT NULL          | ชื่อหมวดหมู่         |
| `slug`        | VARCHAR(100) | UNIQUE, NOT NULL          | คีย์อ้างอิง URL Slug |
| `description` | TEXT         | NULL                      | คำอธิบายหมวดหมู่     |
| `created_at`  | TIMESTAMPTZ  | DEFAULT CURRENT_TIMESTAMP | วันที่สร้าง          |

#### ตารางที่ 5: `books` (ข้อมูล E-Book)

| ชื่อฟิลด์        | ชนิดข้อมูล    | Constraints                    | ความหมาย                  |
| :--------------- | :------------ | :----------------------------- | :------------------------ |
| `id`             | SERIAL        | PRIMARY KEY                    | รหัสหนังสือ               |
| `title`          | VARCHAR(255)  | NOT NULL                       | ชื่อหนังสือ               |
| `author_id`      | INT           | FK -> authors(id)              | รหัสผู้แต่ง               |
| `category_id`    | INT           | FK -> categories(id)           | รหัสหมวดหมู่              |
| `price`          | DECIMAL(10,2) | NOT NULL, CHECK (price >= 0)   | ราคาขาย (บาท)             |
| `cover_color`    | VARCHAR(20)   | DEFAULT '#2F5D50'              | โทนสีปกจำลอง              |
| `cover_image`    | VARCHAR(500)  | NULL                           | ลิงก์รูปภาพปก             |
| `description`    | TEXT          | NULL                           | เรื่องย่อ/คำอธิบาย        |
| `pages`          | INT           | DEFAULT 0, CHECK (pages >= 0)  | จำนวนหน้า                 |
| `language`       | VARCHAR(50)   | DEFAULT 'ไทย'                  | ภาษา                      |
| `published_year` | INT           | CHECK (published_year >= 1800) | ปีที่พิมพ์                |
| `isbn`           | VARCHAR(30)   | UNIQUE, NULL                   | รหัส ISBN                 |
| `rating`         | DECIMAL(2,1)  | DEFAULT 5.0, CHECK (0-5.0)     | คะแนนรีวิว                |
| `featured`       | BOOLEAN       | DEFAULT FALSE                  | สินค้าแนะนำ               |
| `file_url`       | VARCHAR(500)  | NULL                           | ลิงก์ไฟล์ E-Book ตัวอย่าง |
| `is_active`      | BOOLEAN       | DEFAULT TRUE                   | สถานะเปิด/ปิดการขาย       |
| `created_at`     | TIMESTAMPTZ   | DEFAULT CURRENT_TIMESTAMP      | วันที่เพิ่มหนังสือ        |

#### ตารางที่ 6: `orders` (คำสั่งซื้อหลัก)

| ชื่อฟิลด์        | ชนิดข้อมูล    | Constraints                                                                       | ความหมาย               |
| :--------------- | :------------ | :-------------------------------------------------------------------------------- | :--------------------- |
| `id`             | SERIAL        | PRIMARY KEY                                                                       | รหัสคำสั่งซื้อ         |
| `user_id`        | INT           | FK -> users(id) ON DELETE SET NULL                                                | รหัสลูกค้าที่สั่งซื้อ  |
| `checkout_email` | VARCHAR(255)  | NOT NULL                                                                          | อีเมลรับใบเสร็จและไฟล์ |
| `checkout_name`  | VARCHAR(150)  | NOT NULL                                                                          | ชื่อผู้สั่งซื้อ        |
| `total`          | DECIMAL(10,2) | NOT NULL, CHECK (total >= 0)                                                      | ยอดชำระสุทธิ           |
| `status`         | VARCHAR(30)   | DEFAULT 'Pending', CHECK IN ('Pending','Paid','Confirmed','Cancelled','Refunded') | สถานะคำสั่งซื้อ        |
| `email_sent`     | BOOLEAN       | DEFAULT TRUE                                                                      | สถานะการส่งอีเมลยืนยัน |
| `created_at`     | TIMESTAMPTZ   | DEFAULT CURRENT_TIMESTAMP                                                         | วันที่สั่งซื้อ         |
| `updated_at`     | TIMESTAMPTZ   | DEFAULT CURRENT_TIMESTAMP                                                         | วันที่อัปเดตสถานะ      |

#### ตารางที่ 7: `order_items` (รายการหนังสือในคำสั่งซื้อ)

| ชื่อฟิลด์       | ชนิดข้อมูล    | Constraints                              | ความหมาย                  |
| :-------------- | :------------ | :--------------------------------------- | :------------------------ |
| `id`            | SERIAL        | PRIMARY KEY                              | รหัสรายการย่อย            |
| `order_id`      | INT           | FK -> orders(id) ON DELETE CASCADE       | รหัสคำสั่งซื้อหลัก        |
| `book_id`       | INT           | FK -> books(id) ON DELETE RESTRICT       | รหัสหนังสือที่ซื้อ        |
| `title`         | VARCHAR(255)  | NOT NULL                                 | ชื่อหนังสือ ณ เวลาที่ซื้อ |
| `quantity`      | INT           | NOT NULL DEFAULT 1, CHECK (quantity > 0) | จำนวนเล่ม                 |
| `price_at_time` | DECIMAL(10,2) | NOT NULL, CHECK (price_at_time >= 0)     | ราคาต่อเล่ม ณ เวลาซื้อ    |
| `created_at`    | TIMESTAMPTZ   | DEFAULT CURRENT_TIMESTAMP                | วันที่บันทึก              |

#### ตารางที่ 8: `payments` (หลักฐานและการชำระเงินจำลอง)

| ชื่อฟิลด์        | ชนิดข้อมูล    | Constraints                                                             | ความหมาย                |
| :--------------- | :------------ | :---------------------------------------------------------------------- | :---------------------- |
| `id`             | SERIAL        | PRIMARY KEY                                                             | รหัสการชำระเงิน         |
| `order_id`       | INT           | FK -> orders(id) ON DELETE CASCADE, UNIQUE                              | รหัสคำสั่งซื้อ          |
| `payment_method` | VARCHAR(50)   | DEFAULT 'PromptPay', CHECK IN ('PromptPay','BankTransfer','CreditCard') | ช่องทางชำระเงิน         |
| `slip_url`       | VARCHAR(500)  | NULL                                                                    | ลิงก์ไฟล์สลิปหลักฐานโอน |
| `amount`         | DECIMAL(10,2) | NOT NULL, CHECK (amount >= 0)                                           | ยอดเงินที่แจ้งโอน       |
| `status`         | VARCHAR(30)   | DEFAULT 'Pending', CHECK IN ('Pending','Verified','Rejected')           | สถานะตรวจสอบสลิป        |
| `paid_at`        | TIMESTAMPTZ   | DEFAULT CURRENT_TIMESTAMP                                               | วันที่แจ้งโอน           |
| `verified_at`    | TIMESTAMPTZ   | NULL                                                                    | วันที่แอดมินยืนยันสลิป  |
| `note`           | TEXT          | NULL                                                                    | บันทึกของแอดมิน         |

#### ตารางที่ 9: `download_links` (โทเค็นและสิทธิ์การดาวน์โหลดปลอดภัย)

| ชื่อฟิลด์        | ชนิดข้อมูล  | Constraints                            | ความหมาย                       |
| :--------------- | :---------- | :------------------------------------- | :----------------------------- |
| `id`             | SERIAL      | PRIMARY KEY                            | รหัสสิทธิ์ดาวน์โหลด            |
| `token`          | VARCHAR(64) | UNIQUE, NOT NULL                       | โทเค็นความปลอดภัย (UUID/Hash)  |
| `order_id`       | INT         | FK -> orders(id) ON DELETE CASCADE     | รหัสคำสั่งซื้อ                 |
| `book_id`        | INT         | FK -> books(id) ON DELETE CASCADE      | รหัสหนังสือที่ดาวน์โหลด        |
| `download_count` | INT         | DEFAULT 0, CHECK (download_count >= 0) | จำนวนครั้งที่ดาวน์โหลดไปแล้ว   |
| `max_downloads`  | INT         | DEFAULT 5, CHECK (max_downloads > 0)   | โควตาดาวน์โหลดสูงสุด (5 ครั้ง) |
| `expires_at`     | TIMESTAMPTZ | NOT NULL                               | วันหมดอายุสิทธิ์ (30 วัน)      |
| `created_at`     | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP              | วันที่สร้างสิทธิ์              |

---

## 4. 4 รายงานวิเคราะห์จากข้อมูลจริง (ตามใบงานข้อ 5)

ทุกรายงานทำงานผ่าน SQL Query ที่เขียนตามมาตรฐาน PostgreSQL เชื่อมโยงหลายตาราง และแสดงผลสดบนหน้าจอ `/admin/reports` พร้อมปุ่ม Export CSV

### รายงานที่ 1: ยอดขายตามช่วงเวลา (Sales Over Time by Month)

- **คำถาม:** ยอดขาย จำนวนคำสั่งซื้อ และค่าเฉลี่ยต่อคำสั่งซื้อ (AOV) เปลี่ยนไปอย่างไรตามเดือน?
- **SQL Query:**

```sql
SELECT
    TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month,
    COUNT(o.id) AS total_orders,
    SUM(o.total) AS total_sales,
    ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY sale_month DESC;
```

- **การนำไปใช้ประโยชน์:** ช่วยให้ผู้บริหารร้านทราบว่าเดือนใดมียอดขายเติบโต และพฤติกรรมการใช้จ่ายเฉลี่ยต่อตะกร้า (AOV) เพื่อวางแผนงบโฆษณาและการส่งเสริมการขาย

### รายงานที่ 2: E-Book ขายดีที่สุด (Top-Selling Books)

- **คำถาม:** E-Book ใดขายได้มากที่สุด 5 อันดับแรกตามจำนวนเล่มและยอดขายรวม?
- **SQL Query:**

```sql
SELECT
    b.id AS book_id,
    b.title,
    COALESCE(a.name, 'ไม่ระบุผู้แต่ง') AS author_name,
    COALESCE(c.name, 'ทั่วไป') AS category_name,
    SUM(oi.quantity) AS total_sold_copies,
    SUM(oi.quantity * oi.price_at_time) AS total_revenue
FROM order_items oi
JOIN books b ON oi.book_id = b.id
LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN categories c ON b.category_id = c.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY b.id, b.title, a.name, c.name
ORDER BY total_sold_copies DESC, total_revenue DESC
LIMIT 5;
```

- **การนำไปใช้ประโยชน์:** ทราบว่าหนังสือและผู้แต่งคนใดเป็นแม่เหล็กดึงดูดลูกค้า เพื่อนำมาจัดวางบนพื้นที่หน้าแรก (Featured Books) หรือจัดแคมเปญ Bundle คู่กับเล่มอื่น

### รายงานที่ 3: ยอดขายตามหมวดหมู่ (Sales by Category)

- **คำถาม:** หมวดหมู่ใดสร้างยอดขายและจำนวนเล่มที่จำหน่ายได้สูงสุด?
- **SQL Query:**

```sql
SELECT
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.quantity) AS total_books_sold,
    SUM(oi.quantity * oi.price_at_time) AS total_category_revenue
FROM categories c
JOIN books b ON c.id = b.category_id
JOIN order_items oi ON b.id = oi.book_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY c.id, c.name
ORDER BY total_category_revenue DESC;
```

- **การนำไปใช้ประโยชน์:** วิเคราะห์แนวโน้มความนิยมของผู้อ่าน เช่น หมวดเทคโนโลยีและหมวดธุรกิจสร้างรายได้สูงสุด ช่วยให้ร้านเน้นคัดสรรหนังสือใหม่ในหมวดนั้นๆ เข้ามาจำหน่ายเพิ่ม

### รายงานที่ 4: พฤติกรรมลูกค้าและสถานะคำสั่งซื้อ (Customer Lifetime Value)

- **คำถาม:** ลูกค้ารายใดซื้อบ่อยหรือมียอดซื้อสะสมสูง และแต่ละสถานะมีจำนวนเท่าใด?
- **SQL Query:**

```sql
SELECT
    u.id AS user_id,
    u.full_name,
    u.email,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.status IN ('Confirmed', 'Completed', 'Paid') THEN o.total ELSE 0 END) AS total_spent,
    COUNT(CASE WHEN o.status IN ('Confirmed', 'Completed', 'Paid') THEN 1 END) AS confirmed_orders,
    COUNT(CASE WHEN o.status = 'Pending' THEN 1 END) AS pending_orders,
    COUNT(CASE WHEN o.status = 'Cancelled' THEN 1 END) AS cancelled_orders
FROM users u
JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.full_name, u.email
HAVING COUNT(o.id) >= 1
ORDER BY total_spent DESC;
```

- **การนำไปใช้ประโยชน์:** แยกกลุ่มลูกค้าชั้นดี (VIP Customers) เพื่อมอบสิทธิพิเศษหรือคูปองส่วนลด และติดตามออเดอร์ที่ค้างสถานะ Pending เพื่อเร่งรัดการตรวจสอบสลิป

---

## 5. ตารางกรณีทดสอบคุณภาพข้อมูล (Test Cases - ตามใบงานข้อ 6)

|  กรณีที่  | ฟังก์ชัน / เงื่อนไขที่ทดสอบ                     | ข้อมูลนำเข้า (Input Data)                          | ผลที่คาดหวัง (Expected Result)                             | ผลการทดสอบจริง (Actual Result)                                      | การแก้ไข / จัดการปัญหา                                  |
| :-------: | :---------------------------------------------- | :------------------------------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------------ | :------------------------------------------------------ |
| **TC-01** | สมัครสมาชิกด้วยอีเมลซ้ำ (Unique Constraint)     | อีเมล `firts.zx99@gmail.com` ที่มีอยู่แล้วในระบบ   | ระบบแจ้งเตือนปฏิเสธการสมัครว่าอีเมลนี้มีผู้ใช้งานแล้ว      | ระบบแสดงข้อความ _"อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น"_         | ผ่าน (Unique Constraint & Validation ตรวจจับได้ถูกต้อง) |
| **TC-02** | สมัครสมาชิกด้วยรหัสผ่านสั้นเกินไป               | รหัสผ่าน `"123"` (น้อยกว่า 6 ตัวอักษร)             | ระบบแจ้งเตือนรหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร            | ระบบขึ้น Alert แจ้งเตือนและไม่อนุญาตให้ Submit                      | ผ่าน (Client-side validation ทำงานสมบูรณ์)              |
| **TC-03** | กรองหนังสือที่ปิดการขาย (Soft Delete)           | แอดมินปิดการขายหนังสือ ID #4 (`is_active = false`) | หน้าร้าน (`/books`, `/`) ต้องไม่แสดงหนังสือเล่มนี้         | หนังสือ ID #4 หายไปจากแคตตาล็อกหน้าร้านทันที                        | ผ่าน (Query กรอง `WHERE is_active = true`)              |
| **TC-04** | ดาวน์โหลด E-Book ก่อนคำสั่งซื้ออนุมัติ          | คำสั่งซื้อสถานะ `Pending` กดคลิกลิงก์ดาวน์โหลด     | ไม่อนุญาตให้ดาวน์โหลด ขึ้นสถานะรอแอดมินยืนยัน              | ปุ่มดาวน์โหลดถูก Disable และมีข้อความแจ้งเตือน                      | ผ่าน (เงื่อนไขความปลอดภัยข้อ 2.2 ทำงานถูกต้อง)          |
| **TC-05** | ปลดล็อกดาวน์โหลดหลังแอดมินอนุมัติสลิป           | แอดมินกด "อนุมัติ" ในหน้า `/admin/orders`          | สถานะเปลี่ยนเป็น `Confirmed` และสร้างโทเค็นดาวน์โหลด       | ลูกค้าได้รับปุ่มดาวน์โหลดไฟล์ทันที                                  | ผ่าน (ระบบสร้าง token ใน `download_links` อัตโนมัติ)    |
| **TC-06** | บันทึกราคาหนังสือติดลบ (CHECK Constraint)       | Insert หนังสือด้วยราคา `-150.00`                   | DBMS ปฏิเสธการบันทึกด้วย CHECK Constraint Violation        | Database ปฏิเสธการ Insert และระบบแสดงข้อผิดพลาด                     | ผ่าน (CHECK `price >= 0` ป้องกันข้อมูลผิดรูป)           |
| **TC-07** | ลูกค้าพยายามเข้าถึงหลังบ้านโดยตรง (Route Guard) | ลูกค้าพิมพ์ URL `http://localhost:3000/admin`      | ระบบบล็อกและแสดงหน้า **403 Forbidden Access Denied**       | ระบบแสดงหน้า 403 สีแดงทันที ไม่อนุญาตให้เห็นข้อมูล                  | ผ่าน (Layout Guard ตรวจสอบ `role_id === 1` เท่านั้น)    |
| **TC-08** | ส่งออกรายงานเป็นไฟล์ CSV ภาษาไทย (Export CSV)   | กดปุ่ม "Export CSV" ในหน้ารายงานที่ 1              | ได้ไฟล์ CSV ที่เปิดใน Microsoft Excel แล้วภาษาไทยไม่เพี้ยน | ได้ไฟล์ `sales_over_time_report_2026-09-14.csv` อ่านภาษาไทยได้ 100% | ผ่าน (เพิ่ม UTF-8 BOM `\uFEFF` นำหน้าข้อมูล CSV)        |

---

## 6. บันทึกการใช้ AI อย่างรับผิดชอบ (Responsible AI Usage - ตามใบงานข้อ 12)

|    วันที่    |    เครื่องมือ AI     | คำสั่ง Prompt โดยสรุป                                                                                          | สิ่งที่นำมาใช้                                                | การตรวจสอบและตรวจทานโดยนักศึกษา                                                             |
| :----------: | :------------------: | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------ |
| 10 ก.ย. 2569 | Claude / Antigravity | "ช่วยออกแบบ ERD และโครงสร้าง 9 ตารางสำหรับร้านขาย e-Book ให้ตรงหลัก 3NF และมี Foreign Key ครบถ้วน"             | นำโครงร่าง Schema ตาราง DDL มาใช้เป็นจุดเริ่มต้น              | ตรวจสอบ Data Type, เพิ่ม CHECK constraints และทดสอบรันบน PostgreSQL บน Supabase จริง        |
| 12 ก.ย. 2569 | Claude / Antigravity | "ช่วยเขียน SQL Query รายงาน 4 ด้านที่ใช้ JOIN, GROUP BY, HAVING, SUM, COUNT, AVG, LIMIT"                       | นำคำสั่ง SQL ทั้ง 4 ข้อมาปรับแต่ง                             | รัน Query ใน SQL Editor บน Supabase เทียบกับข้อมูลตัวอย่าง 32 ออเดอร์ ตรวจสอบผลรวมให้ตรงกัน |
| 14 ก.ย. 2569 | Claude / Antigravity | "ช่วยปรับเปลี่ยนฟอนต์ทั้งเว็บให้เป็น Minimal (Plus Jakarta Sans และ IBM Plex Sans Thai) และทำ Route Guard 403" | ได้โค้ด CSS font variables และโค้ดตรวจสอบ Role Guard ใน React | ตรวจสอบการแสดงผลบนหน้าจอคอมพิวเตอร์และมือถือ ยืนยันว่าปุ่มหลังบ้านถูกซ่อนจากลูกค้าจริง      |

---

## 7. รายการตรวจสอบความพร้อมก่อนส่งงาน (Checklist)

- [x] สมาชิกในกลุ่มเข้าใจและสามารถอธิบายโครงสร้าง ERD ความสัมพันธ์ 1:N, N:M และคำสั่ง SQL ทั้งหมดได้
- [x] คำสั่งซื้อที่ยังไม่อนุมัติ (`Pending`) ไม่สามารถเปิดดาวน์โหลด E-Book ได้ (ตรงตามข้อ 2.2)
- [x] มีข้อมูลตัวอย่างในระบบมากกว่า 30 คำสั่งซื้อ และครอบคลุมยอดขายหลายเดือน (มิ.ย. - ก.ย. 2569)
- [x] มีไฟล์ `schema.sql`, `seed.sql`, `reports.sql` รันได้สมบูรณ์ใน Supabase SQL Editor
- [x] รายงานวิเคราะห์ 4 ด้าน รันจากข้อมูลจริงในระบบและสามารถ Export เป็นไฟล์ CSV ได้อย่างถูกต้อง
- [x] ไม่มีการใช้ข้อมูลส่วนบุคคลจริง รหัสผ่านจริง หรือไฟล์ที่มีลิขสิทธิ์
- [x] มีบัญชีทดสอบด่วนบนหน้าจอสำหรับให้อาจารย์ผู้สอนคลิกสลับสิทธิ์ Admin / Customer เพื่อตรวจข้อสอบได้สะดวก
