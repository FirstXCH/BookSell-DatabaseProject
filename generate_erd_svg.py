# -*- coding: utf-8 -*-
"""
Generate an ultra-crisp, high-definition ERD diagram where connector lines
point EXACTLY from the Primary Key row directly into the Foreign Key row.
"""
import os
import pymupdf

svg_width = 1920
svg_height = 1250

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_width} {svg_height}" width="{svg_width}" height="{svg_height}">
<defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&amp;family=Noto+Sans+Thai:wght@400;500;600;700&amp;display=swap');
    text {{ font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Noto Sans Thai', Roboto, sans-serif; }}
    .code {{ font-family: 'Fira Code', Consolas, Monaco, monospace; }}
  </style>

  <!-- Gradients -->
  <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#070b14"/>
    <stop offset="50%" stop-color="#0b1120"/>
    <stop offset="100%" stop-color="#0d1527"/>
  </linearGradient>

  <linearGradient id="hdr_blue" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/>
  </linearGradient>
  <linearGradient id="hdr_emerald" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#059669"/>
  </linearGradient>
  <linearGradient id="hdr_amber" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#78350f"/><stop offset="100%" stop-color="#d97706"/>
  </linearGradient>
  <linearGradient id="hdr_rose" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#831843"/><stop offset="100%" stop-color="#db2777"/>
  </linearGradient>
  <linearGradient id="hdr_teal" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#134e4a"/><stop offset="100%" stop-color="#0d9488"/>
  </linearGradient>
  <linearGradient id="hdr_indigo" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#312e81"/><stop offset="100%" stop-color="#6366f1"/>
  </linearGradient>
  <linearGradient id="hdr_violet" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#4c1d95"/><stop offset="100%" stop-color="#7c3aed"/>
  </linearGradient>
  <linearGradient id="hdr_orange" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#ea580c"/>
  </linearGradient>

  <!-- Markers -->
  <marker id="arrow_cyan" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#38bdf8"/>
  </marker>
  <marker id="arrow_emerald" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#34d399"/>
  </marker>
  <marker id="arrow_amber" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#fbbf24"/>
  </marker>
  <marker id="arrow_pink" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#f472b6"/>
  </marker>
  <marker id="arrow_teal" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#2dd4bf"/>
  </marker>
  <marker id="arrow_orange" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#fb923c"/>
  </marker>
  <marker id="arrow_indigo" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
    <path d="M1,2 L8,5 L1,8 L3,5 Z" fill="#818cf8"/>
  </marker>

  <marker id="dot_start" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.8"/>
  </marker>
  <marker id="dot_amber" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#fbbf24" stroke="#ffffff" stroke-width="1.8"/>
  </marker>
  <marker id="dot_pink" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#f472b6" stroke="#ffffff" stroke-width="1.8"/>
  </marker>
  <marker id="dot_teal" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#2dd4bf" stroke="#ffffff" stroke-width="1.8"/>
  </marker>
  <marker id="dot_emerald" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#34d399" stroke="#ffffff" stroke-width="1.8"/>
  </marker>
  <marker id="dot_orange" markerWidth="12" markerHeight="12" refX="6" refY="6">
    <circle cx="6" cy="6" r="4.5" fill="#fb923c" stroke="#ffffff" stroke-width="1.8"/>
  </marker>

  <!-- Shadows -->
  <filter id="table_shadow" x="-5%" y="-5%" width="112%" height="112%">
    <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
  </filter>
</defs>

<!-- Solid Canvas Background -->
<rect width="100%" height="100%" fill="url(#bg_grad)"/>

<!-- Grid decoration lines -->
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.6" stroke-opacity="0.4"/>
</pattern>
<rect width="100%" height="100%" fill="url(#grid)"/>

<!-- Title Banner -->
<g transform="translate(925, 45)">
  <rect x="-420" y="-30" width="840" height="60" rx="30" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <text x="0" y="-2" fill="#38bdf8" font-size="18" font-weight="700" text-anchor="middle" letter-spacing="1">
    LAMPARA BOOKS — 3NF PHYSICAL ERD (FIELD-TO-FIELD MAPPING)
  </text>
  <text x="0" y="18" fill="#94a3b8" font-size="12" text-anchor="middle">
    ลูกศรเชื่อมโยงตรงจาก Primary Key (PK) เข้าหา Foreign Key (FK) ระดับคอลัมน์ แม่นยำตาม 3NF ครบทั้ง 9 ตาราง
  </text>
</g>
'''

def draw_table(name, x, y, width, header_grad, columns):
    """
    columns: list of tuples (type, name, badge_type, extra)
    badge_type: 'PK', 'FK', 'UK', ''
    """
    row_h = 26
    hdr_h = 36
    tbl_h = hdr_h + len(columns) * row_h + 6
    
    res = f'''
    <!-- Table: {name} -->
    <g filter="url(#table_shadow)">
      <!-- Card background & border -->
      <rect x="{x}" y="{y}" width="{width}" height="{tbl_h}" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <!-- Header gradient banner -->
      <rect x="{x}" y="{y}" width="{width}" height="{hdr_h}" rx="10" fill="url(#{header_grad})"/>
      <rect x="{x}" y="{y + hdr_h - 8}" width="{width}" height="8" fill="url(#{header_grad})"/>
      
      <!-- Header text -->
      <text x="{x + 16}" y="{y + 23}" fill="#ffffff" font-size="14" font-weight="700" letter-spacing="0.8">{name.upper()}</text>
      <rect x="{x + width - 68}" y="{y + 9}" width="52" height="18" rx="4" fill="#000000" fill-opacity="0.3"/>
      <text x="{x + width - 42}" y="{y + 22}" fill="#e2e8f0" font-size="10" font-weight="700" text-anchor="middle">TABLE</text>
    '''
    
    field_coords = {}
    
    for i, col in enumerate(columns):
        c_type, c_name, badge, extra = col
        ry = y + hdr_h + i * row_h
        row_bg = "#141e33" if i % 2 == 1 else "#0f172a"
        
        # Row strip
        res += f'<rect x="{x + 1}" y="{ry}" width="{width - 2}" height="{row_h}" fill="{row_bg}"/>'
        
        # Type (col 1)
        res += f'<text class="code" x="{x + 14}" y="{ry + 17}" fill="#94a3b8" font-size="10.5">{c_type}</text>'
        
        # Name (col 2)
        name_color = "#38bdf8" if badge == 'PK' else ("#f1f5f9" if badge == 'FK' else "#cbd5e1")
        name_weight = "700" if badge in ['PK', 'FK'] else "500"
        res += f'<text class="code" x="{x + 105}" y="{ry + 17}" fill="{name_color}" font-size="11" font-weight="{name_weight}">{c_name}</text>'
        
        # Extra constraint (col 3)
        if extra:
            res += f'<text class="code" x="{x + 235}" y="{ry + 17}" fill="#64748b" font-size="9.5">{extra}</text>'
            
        # Badge (col 4, far right)
        bx = x + width - 42
        if badge == 'PK':
            res += f'<rect x="{bx}" y="{ry + 5}" width="30" height="16" rx="4" fill="#d97706"/>'
            res += f'<text x="{bx + 15}" y="{ry + 17}" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle">PK</text>'
        elif badge == 'FK':
            res += f'<rect x="{bx}" y="{ry + 5}" width="30" height="16" rx="4" fill="#0284c7"/>'
            res += f'<text x="{bx + 15}" y="{ry + 17}" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle">FK</text>'
        elif badge == 'UK':
            res += f'<rect x="{bx}" y="{ry + 5}" width="30" height="16" rx="4" fill="#475569"/>'
            res += f'<text x="{bx + 15}" y="{ry + 17}" fill="#ffffff" font-size="9" font-weight="700" text-anchor="middle">UK</text>'
            
        # Register coordinates
        field_coords[c_name] = {
            'left': (x, ry + row_h / 2),
            'right': (x + width, ry + row_h / 2),
            'y': ry + row_h / 2
        }
        
    res += '</g>\n'
    return res, field_coords

# Define Tables
roles_cols = [
    ('int', 'id', 'PK', ''),
    ('varchar', 'name', 'UK', 'Admin|Cust'),
    ('text', 'description', '', ''),
    ('timestamptz', 'created_at', '', '')
]

users_cols = [
    ('int', 'id', 'PK', ''),
    ('int', 'role_id', 'FK', '-> roles.id'),
    ('varchar', 'email', 'UK', ''),
    ('varchar', 'password_hash', '', ''),
    ('varchar', 'full_name', '', ''),
    ('varchar', 'phone', '', ''),
    ('varchar', 'bank_account_name', '', ''),
    ('varchar', 'bank_account_no', '', ''),
    ('varchar', 'bank_name', '', ''),
    ('timestamptz', 'created_at', '', '')
]

orders_cols = [
    ('int', 'id', 'PK', ''),
    ('int', 'user_id', 'FK', '-> users.id'),
    ('varchar', 'checkout_email', '', ''),
    ('varchar', 'checkout_name', '', ''),
    ('decimal', 'total', '', '>= 0'),
    ('varchar', 'status', '', 'Pending|Conf'),
    ('boolean', 'email_sent', '', ''),
    ('timestamptz', 'created_at', '', '')
]

payments_cols = [
    ('int', 'id', 'PK', ''),
    ('int', 'order_id', 'FK', '-> orders.id (1:1)'),
    ('varchar', 'payment_method', '', 'PromptPay'),
    ('varchar', 'slip_url', '', ''),
    ('decimal', 'amount', '', '>= 0'),
    ('varchar', 'status', '', 'Verified'),
    ('timestamptz', 'paid_at', '', '')
]

authors_cols = [
    ('int', 'id', 'PK', ''),
    ('varchar', 'name', '', ''),
    ('text', 'bio', '', ''),
    ('varchar', 'email', '', ''),
    ('timestamptz', 'created_at', '', '')
]

categories_cols = [
    ('int', 'id', 'PK', ''),
    ('varchar', 'name', 'UK', ''),
    ('varchar', 'slug', 'UK', ''),
    ('text', 'description', '', ''),
    ('timestamptz', 'created_at', '', '')
]

books_cols = [
    ('int', 'id', 'PK', ''),
    ('varchar', 'title', '', ''),
    ('int', 'author_id', 'FK', '-> authors.id'),
    ('int', 'category_id', 'FK', '-> categories.id'),
    ('decimal', 'price', '', '>= 0'),
    ('varchar', 'cover_color', '', ''),
    ('int', 'pages', '', '>= 0'),
    ('varchar', 'isbn', 'UK', ''),
    ('boolean', 'is_active', '', 'DEFAULT true'),
    ('varchar', 'file_url', '', ''),
    ('timestamptz', 'created_at', '', '')
]

order_items_cols = [
    ('int', 'id', 'PK', ''),
    ('int', 'order_id', 'FK', '-> orders.id'),
    ('int', 'book_id', 'FK', '-> books.id'),
    ('varchar', 'title', '', ''),
    ('int', 'quantity', '', '> 0'),
    ('decimal', 'price_at_time', '', '>= 0')
]

download_links_cols = [
    ('int', 'id', 'PK', ''),
    ('varchar', 'token', 'UK', 'UUID'),
    ('int', 'order_id', 'FK', '-> orders.id'),
    ('int', 'book_id', 'FK', '-> books.id'),
    ('int', 'download_count', '', '>= 0'),
    ('int', 'max_downloads', '', 'DEF 5'),
    ('timestamptz', 'expires_at', '', '')
]

# Table placements
svg_content = svg

# Col 1 (Left: x = 70, width = 380)
c_roles, f_roles = draw_table("roles", 70, 110, 380, "hdr_blue", roles_cols)
c_users, f_users = draw_table("users", 70, 270, 380, "hdr_indigo", users_cols)
c_orders, f_orders = draw_table("orders", 70, 600, 380, "hdr_emerald", orders_cols)
c_payments, f_payments = draw_table("payments", 70, 880, 380, "hdr_amber", payments_cols)

# Col 2 (Center: x = 570, width = 380)
c_authors, f_authors = draw_table("authors", 570, 110, 380, "hdr_rose", authors_cols)
c_categories, f_categories = draw_table("categories", 570, 320, 380, "hdr_teal", categories_cols)
c_order_items, f_order_items = draw_table("order_items", 570, 600, 380, "hdr_violet", order_items_cols)

# Col 3 (Right: x = 1070, width = 390)
c_books, f_books = draw_table("books", 1070, 110, 390, "hdr_orange", books_cols)
c_downloads, f_downloads = draw_table("download_links", 1070, 600, 390, "hdr_indigo", download_links_cols)

svg_content += c_roles + c_users + c_orders + c_payments + c_authors + c_categories + c_order_items + c_books + c_downloads

# Helper to draw connector
def draw_link(sx, sy, ex, ey, stroke, marker_dot, marker_arr, label="", c1x=None, c1y=None, c2x=None, c2y=None):
    if c1x is None:
        dx = abs(ex - sx)
        c1x = sx + dx * 0.5 if ex > sx else sx - dx * 0.5
        c1y = sy
        c2x = ex - dx * 0.5 if ex > sx else ex + dx * 0.5
        c2y = ey
        
    path = f'''
    <path d="M {sx} {sy} C {c1x} {c1y}, {c2x} {c2y}, {ex} {ey}" 
          fill="none" stroke="{stroke}" stroke-width="2.4" stroke-linecap="round" 
          marker-start="url(#{marker_dot})" marker-end="url(#{marker_arr})"/>
    '''
    if label:
        # compute midpoint of bezier roughly
        mx = (sx + 3*c1x + 3*c2x + ex) / 8
        my = (sy + 3*c1y + 3*c2y + ey) / 8
        w = len(label) * 7.5 + 20
        path += f'''
        <g transform="translate({mx}, {my})">
          <rect x="{-w/2}" y="-11" width="{w}" height="22" rx="6" fill="#070b14" stroke="{stroke}" stroke-width="1.2"/>
          <text class="code" x="0" y="4" fill="{stroke}" font-size="10.5" font-weight="700" text-anchor="middle">{label}</text>
        </g>
        '''
    return path

# 1. roles.id -> users.role_id (Curving along right margin of Left column)
p1 = draw_link(
    f_roles['id']['right'][0], f_roles['id']['right'][1],
    f_users['role_id']['right'][0], f_users['role_id']['right'][1],
    stroke="#38bdf8", marker_dot="dot_start", marker_arr="arrow_cyan",
    label="1 : N",
    c1x=510, c1y=f_roles['id']['right'][1],
    c2x=510, c2y=f_users['role_id']['right'][1]
)

# 2. users.id -> orders.user_id (Curving down right margin of Left column)
p2 = draw_link(
    f_users['id']['right'][0], f_users['id']['right'][1],
    f_orders['user_id']['right'][0], f_orders['user_id']['right'][1],
    stroke="#38bdf8", marker_dot="dot_start", marker_arr="arrow_cyan",
    label="1 : N",
    c1x=525, c1y=f_users['id']['right'][1],
    c2x=525, c2y=f_orders['user_id']['right'][1]
)

# 3. orders.id -> payments.order_id (Curving on left margin of Left column)
p3 = draw_link(
    f_orders['id']['left'][0], f_orders['id']['left'][1],
    f_payments['order_id']['left'][0], f_payments['order_id']['left'][1],
    stroke="#fbbf24", marker_dot="dot_amber", marker_arr="arrow_amber",
    label="1 : 1",
    c1x=15, c1y=f_orders['id']['left'][1],
    c2x=15, c2y=f_payments['order_id']['left'][1]
)

# 4. authors.id -> books.author_id (Direct S-curve Center -> Right)
p4 = draw_link(
    f_authors['id']['right'][0], f_authors['id']['right'][1],
    f_books['author_id']['left'][0], f_books['author_id']['left'][1],
    stroke="#f472b6", marker_dot="dot_pink", marker_arr="arrow_pink",
    label="1 : N",
    c1x=1010, c1y=f_authors['id']['right'][1],
    c2x=1010, c2y=f_books['author_id']['left'][1]
)

# 5. categories.id -> books.category_id (Direct S-curve Center -> Right)
p5 = draw_link(
    f_categories['id']['right'][0], f_categories['id']['right'][1],
    f_books['category_id']['left'][0], f_books['category_id']['left'][1],
    stroke="#2dd4bf", marker_dot="dot_teal", marker_arr="arrow_teal",
    label="1 : N",
    c1x=1010, c1y=f_categories['id']['right'][1],
    c2x=1010, c2y=f_books['category_id']['left'][1]
)

# 6. orders.id -> order_items.order_id (Direct Left -> Center)
p6 = draw_link(
    f_orders['id']['right'][0], f_orders['id']['right'][1],
    f_order_items['order_id']['left'][0], f_order_items['order_id']['left'][1],
    stroke="#34d399", marker_dot="dot_emerald", marker_arr="arrow_emerald",
    label="1 : N",
    c1x=510, c1y=f_orders['id']['right'][1],
    c2x=510, c2y=f_order_items['order_id']['left'][1]
)

# 7. books.id -> order_items.book_id (Route down corridor between Center & Right)
p7 = draw_link(
    f_books['id']['left'][0], f_books['id']['left'][1],
    f_order_items['book_id']['right'][0], f_order_items['book_id']['right'][1],
    stroke="#fb923c", marker_dot="dot_orange", marker_arr="arrow_orange",
    label="1 : N",
    c1x=1010, c1y=f_books['id']['left'][1],
    c2x=1010, c2y=f_order_items['book_id']['right'][1]
)

# 8. orders.id -> download_links.order_id (Route along bottom corridor below order_items)
p8 = draw_link(
    f_orders['id']['right'][0], f_orders['id']['right'][1] + 10,
    f_downloads['order_id']['left'][0], f_downloads['order_id']['left'][1],
    stroke="#38bdf8", marker_dot="dot_start", marker_arr="arrow_cyan",
    label="1 : N",
    c1x=510, c1y=890,
    c2x=1030, c2y=890
)

# 9. books.id -> download_links.book_id (Route along right margin between table and legend)
p9 = draw_link(
    f_books['id']['right'][0], f_books['id']['right'][1],
    f_downloads['book_id']['right'][0], f_downloads['book_id']['right'][1],
    stroke="#fb923c", marker_dot="dot_orange", marker_arr="arrow_orange",
    label="1 : N",
    c1x=1500, c1y=f_books['id']['right'][1],
    c2x=1500, c2y=f_downloads['book_id']['right'][1]
)

svg_content += p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9

# Legend box at top right
legend = '''
<!-- ERD Legend -->
<g filter="url(#table_shadow)">
  <rect x="1560" y="110" width="310" height="340" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
  <rect x="1560" y="110" width="310" height="38" rx="10" fill="#1e293b"/>
  <rect x="1560" y="140" width="310" height="8" fill="#1e293b"/>
  <text x="1580" y="135" fill="#f8fafc" font-size="13.5" font-weight="700">คำอธิบายสัญลักษณ์ (ERD Legend)</text>
  
  <!-- PK -->
  <rect x="1580" y="165" width="32" height="18" rx="4" fill="#d97706"/>
  <text x="1596" y="178" fill="#ffffff" font-size="9.5" font-weight="800" text-anchor="middle">PK</text>
  <text x="1625" y="179" fill="#f1f5f9" font-size="12" font-weight="600">Primary Key (คีย์หลัก)</text>
  <text x="1625" y="195" fill="#94a3b8" font-size="10.5">ระบุแถวข้อมูลเอกลักษณ์ ไม่ซ้ำ ไม่ว่าง</text>
  
  <!-- FK -->
  <rect x="1580" y="215" width="32" height="18" rx="4" fill="#0284c7"/>
  <text x="1596" y="228" fill="#ffffff" font-size="9.5" font-weight="800" text-anchor="middle">FK</text>
  <text x="1625" y="229" fill="#f1f5f9" font-size="12" font-weight="600">Foreign Key (คีย์นอก)</text>
  <text x="1625" y="245" fill="#94a3b8" font-size="10.5">คอลัมน์ที่อ้างอิงกลับไปยัง PK ตารางอื่น</text>
  
  <!-- UK -->
  <rect x="1580" y="265" width="32" height="18" rx="4" fill="#475569"/>
  <text x="1596" y="278" fill="#ffffff" font-size="9.5" font-weight="700" text-anchor="middle">UK</text>
  <text x="1625" y="279" fill="#f1f5f9" font-size="12" font-weight="600">Unique Key (ห้ามซ้ำ)</text>
  <text x="1625" y="295" fill="#94a3b8" font-size="10.5">ค่าข้อมูลต้องไม่ซ้ำกันในระบบ</text>
  
  <!-- Arrow meaning -->
  <line x1="1580" y1="315" x2="1830" y2="315" stroke="#1e293b" stroke-width="1.5"/>
  <circle cx="1590" cy="335" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
  <text x="1605" y="339" fill="#cbd5e1" font-size="11">● หัวกลม = จุดเริ่มต้นจาก Primary Key</text>
  <path d="M 1585 360 L 1595 365 L 1585 370 Z" fill="#38bdf8"/>
  <text x="1605" y="369" fill="#cbd5e1" font-size="11">▶ หัวลูกศร = ชี้เจาะจงเข้าหา Foreign Key</text>
  <text x="1580" y="410" fill="#34d399" font-size="11" font-weight="600">✓ ถูกต้องตามกฎ 3NF ครบทั้ง 9 ตาราง</text>
  <text x="1580" y="430" fill="#64748b" font-size="10.5">Lampara Books Architecture 2026</text>
</g>
'''

svg_content += legend
svg_content += '</svg>'

svg_path = r"d:\learnCode\BookSell-DatabaseProject\docs\images\erd_column_mapped.svg"
png_path = r"d:\learnCode\BookSell-DatabaseProject\docs\images\erd_column_mapped.png"

os.makedirs(os.path.dirname(svg_path), exist_ok=True)

with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)
print("Saved SVG:", svg_path)

# Convert to high-resolution PNG using PyMuPDF (DPI 150)
doc = pymupdf.open("svg", svg_content.encode("utf-8"))
pix = doc[0].get_pixmap(dpi=150)
pix.save(png_path)
print(f"Generated High-Def PNG: {png_path} ({pix.width}x{pix.height})")
