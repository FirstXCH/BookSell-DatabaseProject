-- 13. ข้อมูลเริ่มต้น (Seed Data) สมบูรณ์สำหรับจำลองระบบและการทำรายงานวิเคราะห์
-- ==============================================================================

-- 13.1 นำเข้า Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'ผู้ดูแลระบบ มีสิทธิ์จัดการหนังสือ คำสั่งซื้อ และดูรายงานวิเคราะห์'),
(2, 'Customer', 'ลูกค้าทั่วไป มีสิทธิ์เลือกซื้อหนังสือ แนบหลักฐาน และดาวน์โหลด');
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

-- 13.2 นำเข้า Users
INSERT INTO users (id, role_id, email, password_hash, full_name, phone, created_at) VALUES
(1, 1, 'admin@lampara.com', 'scrypt_admin_pass_hash', 'กานต์นิธิ ยะโส (ผู้ดูแลระบบ)', '089-123-4567', '2026-05-01 09:00:00+07'),
(2, 2, 'firts.zx99@gmail.com', 'scrypt_cust_pass_hash', 'KANNITI YASO', '081-999-8877', '2026-05-15 10:30:00+07'),
(3, 2, 'somchai.tech@gmail.com', 'scrypt_cust_pass_hash', 'สมชาย สายโค้ด', '082-111-2233', '2026-06-01 11:15:00+07'),
(4, 2, 'wanida.read@hotmail.com', 'scrypt_cust_pass_hash', 'วนิดา นักอ่านตัวยง', '084-333-4455', '2026-06-10 14:20:00+07'),
(5, 2, 'tanawat.design@gmail.com', 'scrypt_cust_pass_hash', 'ธนวัฒน์ ศิลป์สว่าง', '086-555-6677', '2026-06-25 16:45:00+07'),
(6, 2, 'nichaphat.book@gmail.com', 'scrypt_cust_pass_hash', 'ณิชาภัทร วงศ์วรรณ', '088-777-8899', '2026-07-05 13:10:00+07'),
(7, 2, 'peerat.dev@outlook.com', 'scrypt_cust_pass_hash', 'พีรณัฐ สายซอฟต์แวร์', '085-999-0011', '2026-07-20 18:00:00+07');
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 13.3 นำเข้า Authors
INSERT INTO authors (id, name, bio, email, avatar_url) VALUES
(1, 'วรรณา สุวรรณภาพ', 'นักเขียนนวนิยายไทยร่วมสมัย ผู้ถ่ายทอดวิถีชีวิตและสายสัมพันธ์ธรรมชาติ', 'wanna@authors.org', '/authors/wanna.jpg'),
(2, 'Daniel Reyes', 'Senior Systems Architect with 15+ years experience in algorithmic thinking.', 'daniel.reyes@techpress.io', '/authors/daniel.jpg'),
(3, 'อนุชา ตั้งใจ', 'คอลัมนิสต์และนักเขียนความเรียงสร้างแรงบันดาลใจ', 'anucha@lifestyle.co.th', '/authors/anucha.jpg'),
(4, 'Mira Chen', 'Architect and Design Theorist specializing in biomimetic patterns.', 'mira.chen@designhub.org', '/authors/mira.jpg'),
(5, 'ปุณยา อายุ', 'นักเขียนรางวัลวรรณกรรมสร้างสรรค์เยาวชน', 'punya@novels.in.th', '/authors/punya.jpg'),
(6, 'James Park', 'Engineering Director advocating for sustainable developer workflows.', 'james.park@calmcode.org', '/authors/james.jpg'),
(7, 'สมหญิง รักษ์สวน', 'ผู้เชี่ยวชาญการจัดสวนในพื้นที่ขนาดจำกัดและพฤกษศาสตร์เมือง', 'somying@botany.in.th', '/authors/somying.jpg'),
(8, 'Sofia Bellini', 'Creative Director and Design Mentor based in Milan.', 'sofia@bellinistudio.it', '/authors/sofia.jpg'),
(9, 'วิทยา สมุทร', 'นักเขียนวรรณกรรมชายฝั่งและเรื่องเล่าแห่งผืนทะเล', 'wittaya@ocean.co.th', '/authors/wittaya.jpg'),
(10, 'Aiko Tanaka', 'Chef and Culinary Minimalist exploring joyful everyday dining.', 'aiko@japankitchen.jp', '/authors/aiko.jpg'),
(11, 'ณัฐ ดวงดารา', 'นักดาราศาสตร์สมัครเล่นและผู้บันทึกความงามท้องฟ้าราตรี', 'nat@stargazer.in.th', '/authors/nat.jpg'),
(12, 'Donella Meadows', 'Pioneering environmental scientist and lead author of The Limits to Growth.', 'donella@systemsthinking.org', '/authors/donella.jpg');
SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors));

-- 13.4 นำเข้า Categories
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'นวนิยาย', 'fiction', 'วรรณกรรม เรื่องเล่า และเรื่องแต่ง'),
(2, 'เทคโนโลยี', 'technology', 'การเขียนโปรแกรม คอมพิวเตอร์ และนวัตกรรม'),
(3, 'เรียงความ', 'essay', 'บทความสั้น เรื่องราวพักผ่อนใจ และการใช้ชีวิต'),
(4, 'ออกแบบ', 'design', 'สถาปัตยกรรม ศิลปะ และการออกแบบกราฟิก'),
(5, 'ไลฟ์สไตล์', 'lifestyle', 'การทำอาหาร การจัดสวน และวิถีชีวิต');
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 13.5 นำเข้า Books (12 เล่ม)
INSERT INTO books (id, title, author_id, category_id, price, cover_color, cover_image, description, pages, language, published_year, isbn, rating, featured, file_url, is_active) VALUES
(1, 'แสงจันทร์บนป่าไผ่', 1, 1, 259.00, '#2F5D50', '/covers/book-1.jpg', 'เรื่องราวของหญิงสาวที่เดินทางกลับภูมิลำเนาเพื่อค้นหาคำตอบของความทรงจำที่สูญหาย ท่ามกลางป่าไผ่ที่ยังคงกระซิบเรื่องราวของอดีต', 312, 'ไทย', 2024, '978-616-123-456-7', 4.5, true, '/ebooks/sample-1.pdf', true),
(2, 'The Quiet Algorithm', 2, 2, 389.00, '#B8863B', '/covers/book-2.jpg', 'A gentle introduction to algorithms for everyday programmers. No heavy math, just clear thinking and practical examples you can apply tomorrow.', 280, 'English', 2023, '978-1-23456-789-0', 4.8, true, '/ebooks/sample-2.pdf', true),
(3, 'สมุดบันทึกลมหนาว', 3, 3, 199.00, '#1C1A17', '/covers/book-3.jpg', 'บันทึกเรื่องเล็กๆ ในชีวิตประจำวันที่ถูกเก็บไว้ในช่วงเวลาที่อากาศเย็นที่สุดของปี เป็นอ่านเพื่อพักใจและหากำลังใจในวันธรรมดา', 180, 'ไทย', 2024, '978-616-987-654-3', 4.2, false, '/ebooks/sample-3.pdf', true),
(4, 'Garden of Patterns', 4, 4, 329.00, '#3F7D5E', '/covers/book-4.jpg', 'Explore how patterns shape everything from architecture to software. A visual journey through the repeating structures that make design feel alive.', 240, 'English', 2023, '978-0-98765-432-1', 4.6, false, '/ebooks/sample-4.pdf', true),
(5, 'เสียงฝนในคืนวัยเด็ก', 5, 1, 219.00, '#6B675F', '/covers/book-5.jpg', 'นวนิยายเยาว์วัยที่พากลับไปยังคืนฝนตกในบ้านย่า เสียงฝนและกลิ่นดินชื้นจุดประกายความทรงจำที่อบอุ่นและเจ็บปวดในเวลาเดียวกัน', 256, 'ไทย', 2022, '978-616-555-123-4', 4.3, false, '/ebooks/sample-5.pdf', true),
(6, 'Building Calm Software', 6, 2, 449.00, '#244a3f', '/covers/book-6.jpg', 'A guide to building software that doesn''t burn teams out. Principles, practices, and real stories from teams that chose sustainability over speed.', 320, 'English', 2024, '978-1-11111-222-3', 4.7, true, '/ebooks/sample-6.pdf', true),
(7, 'ต้นไม้ในกระถางระเบียง', 7, 5, 179.00, '#3F7D5E', '/covers/book-7.jpg', 'คู่มือปลูกต้นไม้ในกระถางระเบียงสำหรับคนเมือง เน้นพืชที่ดูแลง่าย เหมาะกับสภาพอากาศร้อนชื้น พร้อมเคล็ดลับจัดสวนเล็กในพื้นที่จำกัด', 160, 'ไทย', 2023, '978-616-333-222-1', 4.1, false, '/ebooks/sample-7.pdf', true),
(8, 'Letters to a Young Designer', 8, 4, 299.00, '#B8863B', '/covers/book-8.jpg', 'Twelve letters from a seasoned designer to someone just starting out. Honest, warm, and practical advice on craft, clients, and creative life.', 200, 'English', 2022, '978-0-44444-555-6', 4.4, false, '/ebooks/sample-8.pdf', true),
(9, 'ทะเลในเปล่า', 9, 1, 239.00, '#2F5D50', '/covers/book-9.jpg', 'ชายประมงที่หันหลังให้ทะเลเพื่อมาเปิดร้านกาแฟเล็กๆ ในต่างจังหวัด แต่อดีตในทะเลยังคงตามมาหาเขาในรูปแบบที่เขาไม่คาดฝัน', 296, 'ไทย', 2024, '978-616-777-888-9', 4.5, false, '/ebooks/sample-9.pdf', true),
(10, 'The Minimal Kitchen', 10, 5, 349.00, '#6B675F', '/covers/book-10.jpg', 'Simple recipes, fewer tools, more joy. A philosophy of cooking that strips away the unnecessary and leaves room for what matters on the plate.', 220, 'English', 2023, '978-1-66666-777-8', 4.6, false, '/ebooks/sample-10.pdf', true),
(11, 'ดาวพระศุกร์ก่อนรุ่งสาง', 11, 3, 269.00, '#1C1A17', '/covers/book-11.jpg', 'ชุดบทความสังเกตการณ์ท้องฟ้าและดวงดาวในชนบทไทย เล่าเรื่องดาวด้วยภาษาง่ายๆ ให้คนทั่วไปมองขึ้นฟ้าและเห็นความงามในยามค่ำคืน', 190, 'ไทย', 2022, '978-616-222-333-4', 4.0, false, '/ebooks/sample-11.pdf', true),
(12, 'Thinking in Systems', 12, 2, 399.00, '#244a3f', '/covers/book-12.jpg', 'A primer for thinking about systems from social to ecological to organizational. Clear, profound, and essential for anyone who wants to change how things work.', 240, 'English', 2008, '978-0-12345-678-9', 4.9, false, '/ebooks/sample-12.pdf', true);
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- 13.6 นำเข้า Orders จำลอง 35 รายการ (ครอบคลุมสถานะ Confirmed, Pending, Cancelled ตลอดช่วง มิ.ย. - ก.ย. 2026)
INSERT INTO orders (id, user_id, checkout_email, checkout_name, total, status, email_sent, created_at, updated_at) VALUES
(1, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 259.00, 'Confirmed', true, '2026-06-02 10:14:00+07', '2026-06-02 10:30:00+07'),
(2, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 838.00, 'Confirmed', true, '2026-06-05 14:22:00+07', '2026-06-05 14:45:00+07'),
(3, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 458.00, 'Confirmed', true, '2026-06-08 09:12:00+07', '2026-06-08 09:30:00+07'),
(4, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 628.00, 'Confirmed', true, '2026-06-12 16:05:00+07', '2026-06-12 16:20:00+07'),
(5, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 179.00, 'Confirmed', true, '2026-06-15 11:40:00+07', '2026-06-15 11:55:00+07'),
(6, 7, 'peerat.dev@outlook.com', 'พีรณัฐ สายซอฟต์แวร์', 449.00, 'Confirmed', true, '2026-06-18 20:10:00+07', '2026-06-18 20:25:00+07'),
(7, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 389.00, 'Confirmed', true, '2026-06-22 13:15:00+07', '2026-06-22 13:40:00+07'),
(8, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 399.00, 'Confirmed', true, '2026-06-26 15:30:00+07', '2026-06-26 16:00:00+07'),
(9, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 219.00, 'Cancelled', false, '2026-06-28 18:50:00+07', '2026-06-28 19:10:00+07'),
(10, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 299.00, 'Confirmed', true, '2026-07-01 10:00:00+07', '2026-07-01 10:20:00+07'),
(11, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 528.00, 'Confirmed', true, '2026-07-03 14:15:00+07', '2026-07-03 14:35:00+07'),
(12, 7, 'peerat.dev@outlook.com', 'พีรณัฐ สายซอฟต์แวร์', 838.00, 'Confirmed', true, '2026-07-06 17:45:00+07', '2026-07-06 18:00:00+07'),
(13, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 748.00, 'Confirmed', true, '2026-07-10 11:20:00+07', '2026-07-10 11:50:00+07'),
(14, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 449.00, 'Confirmed', true, '2026-07-14 12:00:00+07', '2026-07-14 12:15:00+07'),
(15, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 269.00, 'Confirmed', true, '2026-07-18 19:30:00+07', '2026-07-18 20:00:00+07'),
(16, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 329.00, 'Cancelled', false, '2026-07-21 16:10:00+07', '2026-07-21 16:30:00+07'),
(17, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 239.00, 'Confirmed', true, '2026-07-25 15:40:00+07', '2026-07-25 16:00:00+07'),
(18, 7, 'peerat.dev@outlook.com', 'พีรณัฐ สายซอฟต์แวร์', 389.00, 'Confirmed', true, '2026-07-29 21:05:00+07', '2026-07-29 21:20:00+07'),
(19, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 458.00, 'Confirmed', true, '2026-08-02 08:30:00+07', '2026-08-02 08:50:00+07'),
(20, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 349.00, 'Confirmed', true, '2026-08-05 13:25:00+07', '2026-08-05 13:50:00+07'),
(21, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 508.00, 'Confirmed', true, '2026-08-09 10:10:00+07', '2026-08-09 10:35:00+07'),
(22, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 628.00, 'Confirmed', true, '2026-08-12 17:15:00+07', '2026-08-12 17:40:00+07'),
(23, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 349.00, 'Confirmed', true, '2026-08-16 11:50:00+07', '2026-08-16 12:10:00+07'),
(24, 7, 'peerat.dev@outlook.com', 'พีรณัฐ สายซอฟต์แวร์', 399.00, 'Confirmed', true, '2026-08-20 18:20:00+07', '2026-08-20 18:45:00+07'),
(25, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 648.00, 'Confirmed', true, '2026-08-23 14:00:00+07', '2026-08-23 14:30:00+07'),
(26, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 179.00, 'Cancelled', false, '2026-08-26 16:40:00+07', '2026-08-26 17:00:00+07'),
(27, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 399.00, 'Confirmed', true, '2026-08-29 09:30:00+07', '2026-08-29 10:00:00+07'),
(28, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 389.00, 'Confirmed', true, '2026-09-01 11:10:00+07', '2026-09-01 11:30:00+07'),
(29, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 259.00, 'Confirmed', true, '2026-09-03 15:20:00+07', '2026-09-03 15:45:00+07'),
(30, 7, 'peerat.dev@outlook.com', 'พีรณัฐ สายซอฟต์แวร์', 449.00, 'Confirmed', true, '2026-09-05 20:30:00+07', '2026-09-05 20:50:00+07'),
(31, 2, 'firts.zx99@gmail.com', 'KANNITI YASO', 528.00, 'Confirmed', true, '2026-09-07 10:45:00+07', '2026-09-07 11:15:00+07'),
(32, 3, 'somchai.tech@gmail.com', 'สมชาย สายโค้ด', 628.00, 'Pending', false, '2026-09-09 13:10:00+07', '2026-09-09 13:10:00+07'),
(33, 4, 'wanida.read@hotmail.com', 'วนิดา นักอ่านตัวยง', 259.00, 'Pending', false, '2026-09-10 09:20:00+07', '2026-09-10 09:20:00+07'),
(34, 5, 'tanawat.design@gmail.com', 'ธนวัฒน์ ศิลป์สว่าง', 449.00, 'Pending', false, '2026-09-10 14:15:00+07', '2026-09-10 14:15:00+07'),
(35, 6, 'nichaphat.book@gmail.com', 'ณิชาภัทร วงศ์วรรณ', 389.00, 'Pending', false, '2026-09-10 16:30:00+07', '2026-09-10 16:30:00+07');
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

-- 13.7 นำเข้า Order Items
INSERT INTO order_items (order_id, book_id, title, quantity, price_at_time) VALUES
(1, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(2, 2, 'The Quiet Algorithm', 1, 389.00),
(2, 6, 'Building Calm Software', 1, 449.00),
(3, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(3, 3, 'สมุดบันทึกลมหนาว', 1, 199.00),
(4, 4, 'Garden of Patterns', 1, 329.00),
(4, 8, 'Letters to a Young Designer', 1, 299.00),
(5, 7, 'ต้นไม้ในกระถางระเบียง', 1, 179.00),
(6, 6, 'Building Calm Software', 1, 449.00),
(7, 2, 'The Quiet Algorithm', 1, 389.00),
(8, 12, 'Thinking in Systems', 1, 399.00),
(9, 5, 'เสียงฝนในคืนวัยเด็ก', 1, 219.00),
(10, 8, 'Letters to a Young Designer', 1, 299.00),
(11, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(11, 11, 'ดาวพระศุกร์ก่อนรุ่งสาง', 1, 269.00),
(12, 2, 'The Quiet Algorithm', 1, 389.00),
(12, 6, 'Building Calm Software', 1, 449.00),
(13, 2, 'The Quiet Algorithm', 1, 389.00),
(13, 10, 'The Minimal Kitchen', 1, 349.00),
(14, 6, 'Building Calm Software', 1, 449.00),
(15, 11, 'ดาวพระศุกร์ก่อนรุ่งสาง', 1, 269.00),
(16, 4, 'Garden of Patterns', 1, 329.00),
(17, 9, 'ทะเลในเปล่า', 1, 239.00),
(18, 2, 'The Quiet Algorithm', 1, 389.00),
(19, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(19, 3, 'สมุดบันทึกลมหนาว', 1, 199.00),
(20, 10, 'The Minimal Kitchen', 1, 349.00),
(21, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(21, 11, 'ดาวพระศุกร์ก่อนรุ่งสาง', 1, 249.00),
(22, 4, 'Garden of Patterns', 1, 329.00),
(22, 8, 'Letters to a Young Designer', 1, 299.00),
(23, 10, 'The Minimal Kitchen', 1, 349.00),
(24, 12, 'Thinking in Systems', 1, 399.00),
(25, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(25, 2, 'The Quiet Algorithm', 1, 389.00),
(26, 7, 'ต้นไม้ในกระถางระเบียง', 1, 179.00),
(27, 12, 'Thinking in Systems', 1, 399.00),
(28, 2, 'The Quiet Algorithm', 1, 389.00),
(29, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(30, 6, 'Building Calm Software', 1, 449.00),
(31, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(31, 11, 'ดาวพระศุกร์ก่อนรุ่งสาง', 1, 269.00),
(32, 4, 'Garden of Patterns', 1, 329.00),
(32, 8, 'Letters to a Young Designer', 1, 299.00),
(33, 1, 'แสงจันทร์บนป่าไผ่', 1, 259.00),
(34, 6, 'Building Calm Software', 1, 449.00),
(35, 2, 'The Quiet Algorithm', 1, 389.00);

-- 13.8 นำเข้า Payments
INSERT INTO payments (order_id, payment_method, slip_url, amount, status, paid_at, verified_at, note) VALUES
(1, 'PromptPay', '/slips/slip-01.jpg', 259.00, 'Verified', '2026-06-02 10:18:00+07', '2026-06-02 10:30:00+07', 'ตรวจสอบสลิปแล้ว ยอดเงินเข้าถูกต้อง'),
(2, 'PromptPay', '/slips/slip-02.jpg', 838.00, 'Verified', '2026-06-05 14:30:00+07', '2026-06-05 14:45:00+07', 'ตรวจสอบสลิปแล้ว'),
(3, 'BankTransfer', '/slips/slip-03.jpg', 458.00, 'Verified', '2026-06-08 09:20:00+07', '2026-06-08 09:30:00+07', 'โอนผ่าน SCB'),
(4, 'PromptPay', '/slips/slip-04.jpg', 628.00, 'Verified', '2026-06-12 16:12:00+07', '2026-06-12 16:20:00+07', 'ยอดเงินตรง'),
(5, 'PromptPay', '/slips/slip-05.jpg', 179.00, 'Verified', '2026-06-15 11:45:00+07', '2026-06-15 11:55:00+07', 'ตรวจสอบแล้ว'),
(6, 'PromptPay', '/slips/slip-06.jpg', 449.00, 'Verified', '2026-06-18 20:15:00+07', '2026-06-18 20:25:00+07', 'ตรวจสอบเรียบร้อย'),
(7, 'PromptPay', '/slips/slip-07.jpg', 389.00, 'Verified', '2026-06-22 13:25:00+07', '2026-06-22 13:40:00+07', 'สลิปถูกต้อง'),
(8, 'BankTransfer', '/slips/slip-08.jpg', 399.00, 'Verified', '2026-06-26 15:40:00+07', '2026-06-26 16:00:00+07', 'โอนผ่าน KBank'),
(9, 'PromptPay', NULL, 219.00, 'Rejected', '2026-06-28 18:50:00+07', '2026-06-28 19:10:00+07', 'ไม่พบหลักฐานการโอนเงิน ยกเลิกคำสั่งซื้อ'),
(10, 'PromptPay', '/slips/slip-10.jpg', 299.00, 'Verified', '2026-07-01 10:10:00+07', '2026-07-01 10:20:00+07', 'ตรวจสอบเรียบร้อย'),
(11, 'PromptPay', '/slips/slip-11.jpg', 528.00, 'Verified', '2026-07-03 14:20:00+07', '2026-07-03 14:35:00+07', 'ตรวจสอบแล้ว'),
(12, 'PromptPay', '/slips/slip-12.jpg', 838.00, 'Verified', '2026-07-06 17:50:00+07', '2026-07-06 18:00:00+07', 'ยอดเงินตรง'),
(13, 'PromptPay', '/slips/slip-13.jpg', 748.00, 'Verified', '2026-07-10 11:30:00+07', '2026-07-10 11:50:00+07', 'ตรวจสอบเรียบร้อย'),
(14, 'BankTransfer', '/slips/slip-14.jpg', 449.00, 'Verified', '2026-07-14 12:05:00+07', '2026-07-14 12:15:00+07', 'โอนผ่าน BBL'),
(15, 'PromptPay', '/slips/slip-15.jpg', 269.00, 'Verified', '2026-07-18 19:40:00+07', '2026-07-18 20:00:00+07', 'ตรวจสอบแล้ว'),
(16, 'PromptPay', NULL, 329.00, 'Rejected', '2026-07-21 16:10:00+07', '2026-07-21 16:30:00+07', 'หมดเวลาชำระเงิน'),
(17, 'PromptPay', '/slips/slip-17.jpg', 239.00, 'Verified', '2026-07-25 15:45:00+07', '2026-07-25 16:00:00+07', 'ตรวจสอบแล้ว'),
(18, 'PromptPay', '/slips/slip-18.jpg', 389.00, 'Verified', '2026-07-29 21:10:00+07', '2026-07-29 21:20:00+07', 'สลิปถูกต้อง'),
(19, 'PromptPay', '/slips/slip-19.jpg', 458.00, 'Verified', '2026-08-02 08:35:00+07', '2026-08-02 08:50:00+07', 'ตรวจสอบเรียบร้อย'),
(20, 'BankTransfer', '/slips/slip-20.jpg', 349.00, 'Verified', '2026-08-05 13:35:00+07', '2026-08-05 13:50:00+07', 'โอนผ่าน KBank'),
(21, 'PromptPay', '/slips/slip-21.jpg', 508.00, 'Verified', '2026-08-09 10:20:00+07', '2026-08-09 10:35:00+07', 'ตรวจสอบแล้ว'),
(22, 'PromptPay', '/slips/slip-22.jpg', 628.00, 'Verified', '2026-08-12 17:25:00+07', '2026-08-12 17:40:00+07', 'ตรวจสอบเรียบร้อย'),
(23, 'PromptPay', '/slips/slip-23.jpg', 349.00, 'Verified', '2026-08-16 12:00:00+07', '2026-08-16 12:10:00+07', 'ตรวจสอบแล้ว'),
(24, 'PromptPay', '/slips/slip-24.jpg', 399.00, 'Verified', '2026-08-20 18:30:00+07', '2026-08-20 18:45:00+07', 'ตรวจสอบแล้ว'),
(25, 'PromptPay', '/slips/slip-25.jpg', 648.00, 'Verified', '2026-08-23 14:10:00+07', '2026-08-23 14:30:00+07', 'สลิปถูกต้อง'),
(26, 'PromptPay', NULL, 179.00, 'Rejected', '2026-08-26 16:40:00+07', '2026-08-26 17:00:00+07', 'ลูกค้ายกเลิกคำสั่งซื้อ'),
(27, 'BankTransfer', '/slips/slip-27.jpg', 399.00, 'Verified', '2026-08-29 09:40:00+07', '2026-08-29 10:00:00+07', 'โอนผ่าน SCB'),
(28, 'PromptPay', '/slips/slip-28.jpg', 389.00, 'Verified', '2026-09-01 11:15:00+07', '2026-09-01 11:30:00+07', 'ตรวจสอบเรียบร้อย'),
(29, 'PromptPay', '/slips/slip-29.jpg', 259.00, 'Verified', '2026-09-03 15:30:00+07', '2026-09-03 15:45:00+07', 'ตรวจสอบแล้ว'),
(30, 'PromptPay', '/slips/slip-30.jpg', 449.00, 'Verified', '2026-09-05 20:35:00+07', '2026-09-05 20:50:00+07', 'ตรวจสอบเรียบร้อย'),
(31, 'PromptPay', '/slips/slip-31.jpg', 528.00, 'Verified', '2026-09-07 10:55:00+07', '2026-09-07 11:15:00+07', 'สลิปถูกต้อง'),
(32, 'PromptPay', '/slips/slip-32-mock.jpg', 628.00, 'Pending', '2026-09-09 13:10:00+07', NULL, 'รอผู้ดูแลตรวจสอบสลิป'),
(33, 'PromptPay', '/slips/slip-33-mock.jpg', 259.00, 'Pending', '2026-09-10 09:20:00+07', NULL, 'รอผู้ดูแลตรวจสอบสลิป'),
(34, 'BankTransfer', '/slips/slip-34-mock.jpg', 449.00, 'Pending', '2026-09-10 14:15:00+07', NULL, 'รอผู้ดูแลตรวจสอบสลิป'),
(35, 'PromptPay', '/slips/slip-35-mock.jpg', 389.00, 'Pending', '2026-09-10 16:30:00+07', NULL, 'รอผู้ดูแลตรวจสอบสลิป');

-- 13.9 นำเข้า Download Links (เฉพาะออเดอร์ที่ได้รับการยืนยันแล้ว - Confirmed)
INSERT INTO download_links (token, order_id, book_id, download_count, max_downloads, expires_at) VALUES
('tok_01_b1_abc123', 1, 1, 1, 5, '2026-12-31 23:59:59+07'),
('tok_02_b2_def456', 2, 2, 2, 5, '2026-12-31 23:59:59+07'),
('tok_02_b6_ghi789', 2, 6, 1, 5, '2026-12-31 23:59:59+07'),
('tok_07_b2_jkl012', 7, 2, 1, 5, '2026-12-31 23:59:59+07'),
('tok_13_b2_mno345', 13, 2, 0, 5, '2026-12-31 23:59:59+07'),
('tok_13_b10_pqr678', 13, 10, 1, 5, '2026-12-31 23:59:59+07'),
('tok_19_b1_stu901', 19, 1, 2, 5, '2026-12-31 23:59:59+07'),
('tok_19_b3_vwx234', 19, 3, 0, 5, '2026-12-31 23:59:59+07'),
('tok_25_b1_yz5678', 25, 1, 1, 5, '2026-12-31 23:59:59+07'),
('tok_25_b2_aa9012', 25, 2, 0, 5, '2026-12-31 23:59:59+07'),
('tok_31_b1_bb3456', 31, 1, 0, 5, '2026-12-31 23:59:59+07'),
('tok_31_b11_cc7890', 31, 11, 0, 5, '2026-12-31 23:59:59+07');

-- ==============================================================================