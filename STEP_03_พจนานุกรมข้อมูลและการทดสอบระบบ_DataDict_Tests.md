# 📖 STEP 03: พจนานุกรมข้อมูล (Data Dictionary) และแผนการทดสอบระบบ (Test Cases)

เอกสารฉบับนี้รวบรวมคำอธิบายรายละเอียดโครงสร้างทั้ง 9 ตาราง (Data Dictionary) และกรณีทดสอบเพื่อประกันคุณภาพข้อมูล (8 Integrity Test Cases) สำหรับเตรียมตอบคำถามอาจารย์

---

# พจนานุกรมข้อมูล (Data Dictionary)
## ระบบร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books)

**วิชา:** [31-407-102-301] ระบบฐานข้อมูล (Database Systems)  
**อาจารย์ผู้สอน:** อาจารย์ประภาส ผ่องสนาม  
**ผู้จัดทำ:** นายกานต์นิธิ ยะโส (รหัส 67332110223-9)  

---

### ตารางที่ 1: `roles` (บทบาทผู้ใช้งานในระบบ)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสบทบาท (1 = Admin, 2 = Customer) |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อบทบาท |
| `description` | TEXT | NULL | คำอธิบายหน้าที่ความรับผิดชอบ |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างบทบาท |

### ตารางที่ 2: `users` (ข้อมูลผู้ใช้งาน สมาชิก และผู้ดูแลระบบ)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสผู้ใช้งาน |
| `role_id` | INT | FK -> roles(id) ON DELETE RESTRICT | รหัสบทบาทผู้ใช้ |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | อีเมล (ใช้สำหรับเข้าสู่ระบบและรับใบเสร็จ) |
| `password_hash`| VARCHAR(255) | NOT NULL | รหัสผ่านแบบแฮช |
| `full_name` | VARCHAR(150) | NOT NULL | ชื่อและนามสกุลจริง |
| `phone` | VARCHAR(30) | NULL | เบอร์โทรศัพท์ติดต่อ |
| `bank_account_name` | VARCHAR(150) | NULL | ชื่อบัญชีธนาคารสำหรับยืนยันตัวตนการสั่งซื้อ |
| `bank_account_number`| VARCHAR(50) | NULL | เลขที่บัญชีธนาคารของผู้ใช้ |
| `bank_name` | VARCHAR(100) | NULL | ธนาคารหรือผู้ให้บริการชำระเงิน |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่ลงทะเบียนสมาชิก |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่อัปเดตข้อมูลล่าสุด |

### ตารางที่ 3: `authors` (ข้อมูลผู้แต่ง / นักเขียน - 3NF)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสผู้แต่ง |
| `name` | VARCHAR(150) | NOT NULL | ชื่อ-นามสกุล หรือนามปากกาผู้แต่ง |
| `bio` | TEXT | NULL | ประวัติผลงานโดยย่อ |
| `email` | VARCHAR(255) | NULL | อีเมลติดต่อผู้แต่ง |
| `avatar_url` | VARCHAR(500) | NULL | ลิงก์รูปภาพประจำตัวผู้แต่ง |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่บันทึกข้อมูล |

### ตารางที่ 4: `categories` (หมวดหมู่หนังสือ - 3NF)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสหมวดหมู่ |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | ชื่อหมวดหมู่หนังสือ |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | คีย์อ้างอิง URL Slug ภาษาอังกฤษ |
| `description` | TEXT | NULL | คำอธิบายเกี่ยวกับหมวดหมู่นี้ |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างหมวดหมู่ |

### ตารางที่ 5: `books` (ข้อมูลหนังสือดิจิทัล E-Book)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสหนังสือ |
| `title` | VARCHAR(255) | NOT NULL | ชื่อเรื่องหนังสือ |
| `author_id` | INT | FK -> authors(id) ON DELETE SET NULL | รหัสผู้แต่ง |
| `category_id` | INT | FK -> categories(id) ON DELETE SET NULL | รหัสหมวดหมู่ |
| `price` | DECIMAL(10, 2)| NOT NULL, CHECK (price >= 0) | ราคาขายสุทธิต่อเล่ม (บาท) |
| `cover_color` | VARCHAR(20) | DEFAULT '#2F5D50' | โทนสีปกจำลองของระบบ |
| `cover_image` | VARCHAR(500) | NULL | ที่อยู่ไฟล์ภาพปก |
| `description` | TEXT | NULL | เนื้อหาและเรื่องย่อ |
| `pages` | INT | DEFAULT 0, CHECK (pages >= 0) | จำนวนหน้าทั้งหมด |
| `language` | VARCHAR(50) | DEFAULT 'ไทย' | ภาษาของหนังสือ |
| `published_year`| INT | CHECK (published_year >= 1800) | ปีคริสต์ศักราชที่จัดพิมพ์ |
| `isbn` | VARCHAR(30) | UNIQUE, NULL | เลขมาตรฐานสากลประจำหนังสือ (ISBN) |
| `rating` | DECIMAL(2, 1)| DEFAULT 5.0, CHECK (rating >= 0 AND rating <= 5.0) | คะแนนความนิยมเฉลี่ย |
| `featured` | BOOLEAN | DEFAULT FALSE | แสดงในหมวดสินค้าแนะนำหน้าแรก |
| `file_url` | VARCHAR(500) | NULL | เส้นทางไฟล์ PDF/EPUB ตัวอย่าง |
| `is_active` | BOOLEAN | DEFAULT TRUE | สถานะพร้อมขาย (true = เปิดขาย, false = ปิดการขาย) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันที่เพิ่มหนังสือเข้าระบบ |

### ตารางที่ 6: `orders` (ข้อมูลคำสั่งซื้อหลัก)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสคำสั่งซื้อ (Order ID) |
| `user_id` | INT | FK -> users(id) ON DELETE SET NULL | รหัสสมาชิกผู้สั่งซื้อ (NULL หากสั่งแบบ Guest) |
| `checkout_email`| VARCHAR(255) | NOT NULL | อีเมลผู้รับลิงก์ดาวน์โหลดและใบเสร็จ |
| `checkout_name` | VARCHAR(150) | NOT NULL | ชื่อผู้สั่งซื้อ |
| `total` | DECIMAL(10, 2)| NOT NULL, CHECK (total >= 0) | ยอดรวมสุทธิที่ต้องชำระ (บาท) |
| `status` | VARCHAR(30) | DEFAULT 'Pending', CHECK IN ('Pending','Paid','Confirmed','Cancelled','Refunded') | สถานะของคำสั่งซื้อ |
| `email_sent` | BOOLEAN | DEFAULT TRUE | สถานะการจัดส่งอีเมลแจ้งลูกค้า |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สั่งซื้อ |
| `updated_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่อัปเดตสถานะล่าสุด |

### ตารางที่ 7: `order_items` (รายการสินค้าในคำสั่งซื้อ - 3NF)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสรายการสินค้าในออเดอร์ |
| `order_id` | INT | FK -> orders(id) ON DELETE CASCADE | รหัสคำสั่งซื้อหลัก |
| `book_id` | INT | FK -> books(id) ON DELETE RESTRICT | รหัสหนังสือที่สั่งซื้อ |
| `title` | VARCHAR(255) | NOT NULL | ชื่อหนังสือ ณ เวลาสั่งซื้อ |
| `quantity` | INT | NOT NULL DEFAULT 1, CHECK (quantity > 0) | จำนวนเล่มที่สั่ง |
| `price_at_time`| DECIMAL(10, 2)| NOT NULL, CHECK (price_at_time >= 0) | ราคาขายต่อเล่ม ณ เวลาสั่งซื้อ |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่บันทึก |

### ตารางที่ 8: `payments` (ข้อมูลการชำระเงินและสลิปหลักฐาน)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสการชำระเงิน |
| `order_id` | INT | FK -> orders(id) ON DELETE CASCADE, UNIQUE | รหัสคำสั่งซื้อที่ชำระ |
| `payment_method`| VARCHAR(50)| DEFAULT 'PromptPay', CHECK IN ('PromptPay','BankTransfer','CreditCard') | วิธีการชำระเงินจำลอง |
| `slip_url` | VARCHAR(500) | NULL | ลิงก์ไฟล์ภาพสลิปการโอนเงิน |
| `amount` | DECIMAL(10, 2)| NOT NULL, CHECK (amount >= 0) | ยอดเงินที่แจ้งโอน |
| `status` | VARCHAR(30) | DEFAULT 'Pending', CHECK IN ('Pending','Verified','Rejected') | สถานะการตรวจสอบหลักฐาน |
| `paid_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่ผู้ซื้อแจ้งชำระเงิน |
| `verified_at` | TIMESTAMPTZ | NULL | วันและเวลาที่ผู้ดูแลระบบอนุมัติสลิป |
| `note` | TEXT | NULL | บันทึกช่วยจำของผู้ดูแลระบบ |

### ตารางที่ 9: `download_links` (โทเค็นและสิทธิ์ดาวน์โหลด E-Book ปลอดภัย)
| ชื่อฟิลด์ | ชนิดข้อมูล | Constraints | ความหมาย |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | รหัสสิทธิ์ดาวน์โหลด |
| `token` | VARCHAR(64) | UNIQUE, NOT NULL | รหัสโทเค็นลับ (Token) สุ่มเฉพาะออเดอร์ |
| `order_id` | INT | FK -> orders(id) ON DELETE CASCADE | รหัสคำสั่งซื้อ |
| `book_id` | INT | FK -> books(id) ON DELETE CASCADE | รหัสหนังสือที่ได้รับสิทธิ์ดาวน์โหลด |
| `download_count`| INT | DEFAULT 0, CHECK (download_count >= 0) | จำนวนครั้งที่ลูกค้ากดดาวน์โหลดไปแล้ว |
| `max_downloads` | INT | DEFAULT 5, CHECK (max_downloads > 0) | จำนวนครั้งที่อนุญาตให้ดาวน์โหลดสูงสุด (5 ครั้ง) |
| `expires_at` | TIMESTAMPTZ | NOT NULL | วันและเวลาหมดอายุของลิงก์ดาวน์โหลด (30 วัน) |
| `created_at` | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้างสิทธิ์ดาวน์โหลด |


---

# ตารางกรณีทดสอบคุณภาพข้อมูล (Test Cases)
## โครงงานระบบร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books)

**วิชา:** [31-407-102-301] ระบบฐานข้อมูล (Database Systems)  
**อาจารย์ผู้สอน:** อาจารย์ประภาส ผ่องสนาม  
**ผู้จัดทำ:** นายกานต์นิธิ ยะโส (รหัส 67332110223-9)  

---

### รายการกรณีทดสอบ (Test Cases - 8 กรณีตามเกณฑ์ใบงานข้อ 6)

| กรณีที่ | ฟังก์ชัน / เงื่อนไขที่ทดสอบ | ข้อมูลนำเข้า (Input Data) | ผลที่คาดหวัง (Expected Result) | ผลการทดสอบจริง (Actual Result) | สถานะ |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | สมัครสมาชิกด้วยอีเมลซ้ำ (Unique Constraint) | อีเมล `firts.zx99@gmail.com` ที่มีอยู่แล้วในระบบ | ระบบแจ้งเตือนปฏิเสธการสมัครว่าอีเมลนี้มีผู้ใช้งานแล้ว | ระบบแสดงข้อความ *"อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น"* | **ผ่าน** |
| **TC-02** | สมัครสมาชิกด้วยรหัสผ่านสั้นเกินไป | รหัสผ่าน `"123"` (น้อยกว่า 6 ตัวอักษร) | ระบบแจ้งเตือนรหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร | ระบบแสดง Alert และไม่ส่งคำขอไปยังฐานข้อมูล | **ผ่าน** |
| **TC-03** | กรองหนังสือที่ปิดการขาย (Soft Delete) | แอดมินสลับปิดการขายหนังสือ ID #4 (`is_active = false`) | หน้าร้าน (`/books`, `/`) ต้องไม่แสดงหนังสือเล่มนี้ | หนังสือ ID #4 หายไปจากแคตตาล็อกหน้าร้านทันที | **ผ่าน** |
| **TC-04** | ดาวน์โหลด E-Book ก่อนคำสั่งซื้ออนุมัติ (Security Condition) | คำสั่งซื้อสถานะ `Pending` ผู้ใช้คลิกลิงก์ดาวน์โหลด | ไม่อนุญาตให้ดาวน์โหลด ขึ้นสถานะรอแอดมินยืนยัน | ปุ่มดาวน์โหลดถูก Disable และแจ้งเตือนรอการอนุมัติ | **ผ่าน** |
| **TC-05** | ปลดล็อกดาวน์โหลดหลังแอดมินอนุมัติสลิป | แอดมินกด "อนุมัติ" ในหน้า `/admin/orders` | สถานะเปลี่ยนเป็น `Confirmed` และสร้างโทเค็นดาวน์โหลด | ลูกค้าได้รับปุ่มดาวน์โหลดไฟล์ทันที | **ผ่าน** |
| **TC-06** | บันทึกราคาหนังสือติดลบ (CHECK Constraint) | Insert หนังสือด้วยราคา `-150.00` | DBMS ปฏิเสธการบันทึกด้วยข้อผิดพลาด CHECK constraint violation | PostgreSQL บน Supabase ปฏิเสธการบันทึกข้อมูล | **ผ่าน** |
| **TC-07** | ลูกค้าพยายามเข้าถึงหลังบ้านโดยตรง (Route Guard) | ลูกค้าพิมพ์ URL `http://localhost:3000/admin` | ระบบบล็อกและแสดงหน้า **403 Forbidden Access Denied** | แสดงหน้า 403 ทันที ไม่อนุญาตให้เห็นหรือแก้ไขข้อมูล | **ผ่าน** |
| **TC-08** | ส่งออกรายงานเป็นไฟล์ CSV ภาษาไทย (Export CSV) | กดปุ่ม "Export CSV" ในหน้ารายงานที่ 1 | ได้ไฟล์ CSV ที่เปิดใน Microsoft Excel แล้วภาษาไทยไม่เพี้ยน | ได้ไฟล์ `sales_over_time_report_2026-09-14.csv` มี UTF-8 BOM อ่านภาษาไทยได้สมบูรณ์ | **ผ่าน** |
