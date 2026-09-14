-- 14. คำสั่ง SQL สำหรับสร้างรายงานวิเคราะห์ 4 หัวข้อ (Analytical Reports Queries)
-- ==============================================================================

-- [รายงานที่ 1: ยอดขายตามช่วงเวลา (Sales Over Time)]
-- ค้นหายอดขายรวม จำนวนคำสั่งซื้อ และค่าเฉลี่ยต่อคำสั่งซื้อ จำแนกตามเดือน
SELECT 
    TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month,
    COUNT(o.id) AS total_orders,
    SUM(o.total) AS total_sales,
    ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY sale_month DESC;

-- [รายงานที่ 2: E-Book ขายดีที่สุด (Top-Selling Books)]
-- จัดอันดับหนังสือที่มียอดจำหน่ายสูงสุด 5 อันดับแรก
SELECT 
    b.id AS book_id,
    b.title,
    a.name AS author_name,
    c.name AS category_name,
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

-- [รายงานที่ 3: ยอดขายตามหมวดหมู่ (Sales by Category)]
-- สรุปยอดขายรวมและจำนวนเล่มที่ขายได้แยกตามแต่ละหมวดหมู่
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

-- [รายงานที่ 4: พฤติกรรมลูกค้าและสถานะคำสั่งซื้อ (Customer Lifetime Value & Status)]
-- สรุปยอดซื้อสะสมของลูกค้าแต่ละราย พร้อมแจกแจงจำนวนคำสั่งซื้อในแต่ละสถานะ
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
