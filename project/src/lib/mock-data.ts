import type {
  Book,
  Role,
  User,
  Author,
  Category,
  Order,
  DownloadLink,
  SalesReportRow,
  TopBookReportRow,
  CategorySalesReportRow,
  CustomerReportRow,
} from "./types";

export const mockRoles: Role[] = [
  { id: 1, name: "Admin", description: "ผู้ดูแลระบบ มีสิทธิ์จัดการหนังสือและดูรายงาน" },
  { id: 2, name: "Customer", description: "ลูกค้าทั่วไป มีสิทธิ์ซื้อหนังสือและดาวน์โหลด" },
];

export const mockUsers: User[] = [
  {
    id: 1,
    role_id: 1,
    email: "admin@lampara.com",
    full_name: "กานต์นิธิ ยะโส (ผู้ดูแลระบบ)",
    phone: "089-123-4567",
    created_at: "2026-05-01T09:00:00Z",
  },
  {
    id: 2,
    role_id: 2,
    email: "firts.zx99@gmail.com",
    full_name: "KANNITI YASO",
    phone: "081-999-8877",
    created_at: "2026-05-15T10:30:00Z",
  },
  {
    id: 3,
    role_id: 2,
    email: "somchai.tech@gmail.com",
    full_name: "สมชาย สายโค้ด",
    phone: "082-111-2233",
    created_at: "2026-06-01T11:15:00Z",
  },
  {
    id: 4,
    role_id: 2,
    email: "wanida.read@hotmail.com",
    full_name: "วนิดา นักอ่านตัวยง",
    phone: "084-333-4455",
    created_at: "2026-06-10T14:20:00Z",
  },
  {
    id: 5,
    role_id: 2,
    email: "tanawat.design@gmail.com",
    full_name: "ธนวัฒน์ ศิลป์สว่าง",
    phone: "086-555-6677",
    created_at: "2026-06-25T16:45:00Z",
  },
  {
    id: 6,
    role_id: 2,
    email: "nichaphat.book@gmail.com",
    full_name: "ณิชาภัทร วงศ์วรรณ",
    phone: "088-777-8899",
    created_at: "2026-07-05T13:10:00Z",
  },
  {
    id: 7,
    role_id: 2,
    email: "peerat.dev@outlook.com",
    full_name: "พีรณัฐ สายซอฟต์แวร์",
    phone: "085-999-0011",
    created_at: "2026-07-20T18:00:00Z",
  },
];

export const mockAuthors: Author[] = [
  { id: 1, name: "วรรณา สุวรรณภาพ", bio: "นักเขียนนวนิยายไทยร่วมสมัย ผู้ถ่ายทอดวิถีชีวิตและสายสัมพันธ์ธรรมชาติ", email: "wanna@authors.org" },
  { id: 2, name: "Daniel Reyes", bio: "Senior Systems Architect with 15+ years experience in algorithmic thinking.", email: "daniel.reyes@techpress.io" },
  { id: 3, name: "อนุชา ตั้งใจ", bio: "คอลัมนิสต์และนักเขียนความเรียงสร้างแรงบันดาลใจ", email: "anucha@lifestyle.co.th" },
  { id: 4, name: "Mira Chen", bio: "Architect and Design Theorist specializing in biomimetic patterns.", email: "mira.chen@designhub.org" },
  { id: 5, name: "ปุณยา อายุ", bio: "นักเขียนรางวัลวรรณกรรมสร้างสรรค์เยาวชน", email: "punya@novels.in.th" },
  { id: 6, name: "James Park", bio: "Engineering Director advocating for sustainable developer workflows.", email: "james.park@calmcode.org" },
  { id: 7, name: "สมหญิง รักษ์สวน", bio: "ผู้เชี่ยวชาญการจัดสวนในพื้นที่ขนาดจำกัดและพฤกษศาสตร์เมือง", email: "somying@botany.in.th" },
  { id: 8, name: "Sofia Bellini", bio: "Creative Director and Design Mentor based in Milan.", email: "sofia@bellinistudio.it" },
  { id: 9, name: "วิทยา สมุทร", bio: "นักเขียนวรรณกรรมชายฝั่งและเรื่องเล่าแห่งผืนทะเล", email: "wittaya@ocean.co.th" },
  { id: 10, name: "Aiko Tanaka", bio: "Chef and Culinary Minimalist exploring joyful everyday dining.", email: "aiko@japankitchen.jp" },
  { id: 11, name: "ณัฐ ดวงดารา", bio: "นักดาราศาสตร์สมัครเล่นและผู้บันทึกความงามท้องฟ้าราตรี", email: "nat@stargazer.in.th" },
  { id: 12, name: "Donella Meadows", bio: "Pioneering environmental scientist and systems theorist.", email: "donella@systemsthinking.org" },
];

export const mockCategories: Category[] = [
  { id: 1, name: "นวนิยาย", slug: "fiction", description: "วรรณกรรม เรื่องเล่า และเรื่องแต่ง" },
  { id: 2, name: "เทคโนโลยี", slug: "technology", description: "การเขียนโปรแกรม คอมพิวเตอร์ และนวัตกรรม" },
  { id: 3, name: "เรียงความ", slug: "essay", description: "บทความสั้น เรื่องราวพักผ่อนใจ และการใช้ชีวิต" },
  { id: 4, name: "ออกแบบ", slug: "design", description: "สถาปัตยกรรม ศิลปะ และการออกแบบกราฟิก" },
  { id: 5, name: "ไลฟ์สไตล์", slug: "lifestyle", description: "การทำอาหาร การจัดสวน และวิถีชีวิต" },
];

export const categories = ["ทั้งหมด", "นวนิยาย", "เทคโนโลยี", "เรียงความ", "ออกแบบ", "ไลฟ์สไตล์"];

export const mockBooks: Book[] = [
  {
    id: 1,
    title: "แสงจันทร์บนป่าไผ่",
    author: "วรรณา สุวรรณภาพ",
    author_id: 1,
    price: 259,
    cover_color: "#2F5D50",
    category: "นวนิยาย",
    category_id: 1,
    description: "เรื่องราวของหญิงสาวที่เดินทางกลับภูมิลำเนาเพื่อค้นหาคำตอบของความทรงจำที่สูญหาย ท่ามกลางป่าไผ่ที่ยังคงกระซิบเรื่องราวของอดีต",
    pages: 312,
    language: "ไทย",
    published_year: 2024,
    isbn: "978-616-123-456-7",
    rating: 4.5,
    featured: true,
    is_active: true,
    file_url: "/ebooks/sample-1.pdf",
  },
  {
    id: 2,
    title: "The Quiet Algorithm",
    author: "Daniel Reyes",
    author_id: 2,
    price: 389,
    cover_color: "#B8863B",
    category: "เทคโนโลยี",
    category_id: 2,
    description: "A gentle introduction to algorithms for everyday programmers. No heavy math, just clear thinking and practical examples you can apply tomorrow.",
    pages: 280,
    language: "English",
    published_year: 2023,
    isbn: "978-1-23456-789-0",
    rating: 4.8,
    featured: true,
    is_active: true,
    file_url: "/ebooks/sample-2.pdf",
  },
  {
    id: 3,
    title: "สมุดบันทึกลมหนาว",
    author: "อนุชา ตั้งใจ",
    author_id: 3,
    price: 199,
    cover_color: "#1C1A17",
    category: "เรียงความ",
    category_id: 3,
    description: "บันทึกเรื่องเล็กๆ ในชีวิตประจำวันที่ถูกเก็บไว้ในช่วงเวลาที่อากาศเย็นที่สุดของปี เป็นอ่านเพื่อพักใจและหากำลังใจในวันธรรมดา",
    pages: 180,
    language: "ไทย",
    published_year: 2024,
    isbn: "978-616-987-654-3",
    rating: 4.2,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-3.pdf",
  },
  {
    id: 4,
    title: "Garden of Patterns",
    author: "Mira Chen",
    author_id: 4,
    price: 329,
    cover_color: "#3F7D5E",
    category: "ออกแบบ",
    category_id: 4,
    description: "Explore how patterns shape everything from architecture to software. A visual journey through the repeating structures that make design feel alive.",
    pages: 240,
    language: "English",
    published_year: 2023,
    isbn: "978-0-98765-432-1",
    rating: 4.6,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-4.pdf",
  },
  {
    id: 5,
    title: "เสียงฝนในคืนวัยเด็ก",
    author: "ปุณยา อายุ",
    author_id: 5,
    price: 219,
    cover_color: "#6B675F",
    category: "นวนิยาย",
    category_id: 1,
    description: "นวนิยายเยาว์วัยที่พากลับไปยังคืนฝนตกในบ้านย่า เสียงฝนและกลิ่นดินชื้นจุดประกายความทรงจำที่อบอุ่นและเจ็บปวดในเวลาเดียวกัน",
    pages: 256,
    language: "ไทย",
    published_year: 2022,
    isbn: "978-616-555-123-4",
    rating: 4.3,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-5.pdf",
  },
  {
    id: 6,
    title: "Building Calm Software",
    author: "James Park",
    author_id: 6,
    price: 449,
    cover_color: "#244a3f",
    category: "เทคโนโลยี",
    category_id: 2,
    description: "A guide to building software that doesn't burn teams out. Principles, practices, and real stories from teams that chose sustainability over speed.",
    pages: 320,
    language: "English",
    published_year: 2024,
    isbn: "978-1-11111-222-3",
    rating: 4.7,
    featured: true,
    is_active: true,
    file_url: "/ebooks/sample-6.pdf",
  },
  {
    id: 7,
    title: "ต้นไม้ในกระถางระเบียง",
    author: "สมหญิง รักษ์สวน",
    author_id: 7,
    price: 179,
    cover_color: "#3F7D5E",
    category: "ไลฟ์สไตล์",
    category_id: 5,
    description: "คู่มือปลูกต้นไม้ในกระถางระเบียงสำหรับคนเมือง เน้นพืชที่ดูแลง่าย เหมาะกับสภาพอากาศร้อนชื้น พร้อมเคล็ดลับจัดสวนเล็กในพื้นที่จำกัด",
    pages: 160,
    language: "ไทย",
    published_year: 2023,
    isbn: "978-616-333-222-1",
    rating: 4.1,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-7.pdf",
  },
  {
    id: 8,
    title: "Letters to a Young Designer",
    author: "Sofia Bellini",
    author_id: 8,
    price: 299,
    cover_color: "#B8863B",
    category: "ออกแบบ",
    category_id: 4,
    description: "Twelve letters from a seasoned designer to someone just starting out. Honest, warm, and practical advice on craft, clients, and creative life.",
    pages: 200,
    language: "English",
    published_year: 2022,
    isbn: "978-0-44444-555-6",
    rating: 4.4,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-8.pdf",
  },
  {
    id: 9,
    title: "ทะเลในเปล่า",
    author: "วิทยา สมุทร",
    author_id: 9,
    price: 239,
    cover_color: "#2F5D50",
    category: "นวนิยาย",
    category_id: 1,
    description: "ชายประมงที่หันหลังให้ทะเลเพื่อมาเปิดร้านกาแฟเล็กๆ ในต่างจังหวัด แต่อดีตในทะเลยังคงตามมาหาเขาในรูปแบบที่เขาไม่คาดฝัน",
    pages: 296,
    language: "ไทย",
    published_year: 2024,
    isbn: "978-616-777-888-9",
    rating: 4.5,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-9.pdf",
  },
  {
    id: 10,
    title: "The Minimal Kitchen",
    author: "Aiko Tanaka",
    author_id: 10,
    price: 349,
    cover_color: "#6B675F",
    category: "ไลฟ์สไตล์",
    category_id: 5,
    description: "Simple recipes, fewer tools, more joy. A philosophy of cooking that strips away the unnecessary and leaves room for what matters on the plate.",
    pages: 220,
    language: "English",
    published_year: 2023,
    isbn: "978-1-66666-777-8",
    rating: 4.6,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-10.pdf",
  },
  {
    id: 11,
    title: "ดาวพระศุกร์ก่อนรุ่งสาง",
    author: "ณัฐ ดวงดารา",
    author_id: 11,
    price: 269,
    cover_color: "#1C1A17",
    category: "เรียงความ",
    category_id: 3,
    description: "ชุดบทความสังเกตการณ์ท้องฟ้าและดวงดาวในชนบทไทย เล่าเรื่องดาวด้วยภาษาง่ายๆ ให้คนทั่วไปมองขึ้นฟ้าและเห็นความงามในยามค่ำคืน",
    pages: 190,
    language: "ไทย",
    published_year: 2022,
    isbn: "978-616-222-333-4",
    rating: 4.0,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-11.pdf",
  },
  {
    id: 12,
    title: "Thinking in Systems",
    author: "Donella Meadows",
    author_id: 12,
    price: 399,
    cover_color: "#244a3f",
    category: "เทคโนโลยี",
    category_id: 2,
    description: "A primer for thinking about systems from social to ecological to organizational. Clear, profound, and essential for anyone who wants to change how things work.",
    pages: 240,
    language: "English",
    published_year: 2008,
    isbn: "978-0-12345-678-9",
    rating: 4.9,
    featured: false,
    is_active: true,
    file_url: "/ebooks/sample-12.pdf",
  },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 259.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-02T10:14:00Z",
    items: [{ book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0, file_url: "/ebooks/sample-1.pdf" }],
    payment: { order_id: 1, payment_method: "PromptPay", slip_url: "/slips/slip-01.jpg", amount: 259.0, status: "Verified" },
    download_links: [{ token: "tok_01_b1_abc123", order_id: 1, book_id: 1, download_count: 1, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" }],
  },
  {
    id: 2,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 838.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-05T14:22:00Z",
    items: [
      { book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0, file_url: "/ebooks/sample-2.pdf" },
      { book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0, file_url: "/ebooks/sample-6.pdf" },
    ],
    payment: { order_id: 2, payment_method: "PromptPay", slip_url: "/slips/slip-02.jpg", amount: 838.0, status: "Verified" },
    download_links: [
      { token: "tok_02_b2_def456", order_id: 2, book_id: 2, download_count: 2, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
      { token: "tok_02_b6_ghi789", order_id: 2, book_id: 6, download_count: 1, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
    ],
  },
  {
    id: 3,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 458.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-08T09:12:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0 },
      { book_id: 3, title: "สมุดบันทึกลมหนาว", quantity: 1, price_at_time: 199.0 },
    ],
    payment: { order_id: 3, payment_method: "BankTransfer", slip_url: "/slips/slip-03.jpg", amount: 458.0, status: "Verified" },
  },
  {
    id: 4,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 628.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-12T16:05:00Z",
    items: [
      { book_id: 4, title: "Garden of Patterns", quantity: 1, price_at_time: 329.0 },
      { book_id: 8, title: "Letters to a Young Designer", quantity: 1, price_at_time: 299.0 },
    ],
    payment: { order_id: 4, payment_method: "PromptPay", slip_url: "/slips/slip-04.jpg", amount: 628.0, status: "Verified" },
  },
  {
    id: 5,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 179.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-15T11:40:00Z",
    items: [{ book_id: 7, title: "ต้นไม้ในกระถางระเบียง", quantity: 1, price_at_time: 179.0 }],
    payment: { order_id: 5, payment_method: "PromptPay", slip_url: "/slips/slip-05.jpg", amount: 179.0, status: "Verified" },
  },
  {
    id: 6,
    user_id: 7,
    checkout_email: "peerat.dev@outlook.com",
    checkout_name: "พีรณัฐ สายซอฟต์แวร์",
    total: 449.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-18T20:10:00Z",
    items: [{ book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0 }],
    payment: { order_id: 6, payment_method: "PromptPay", slip_url: "/slips/slip-06.jpg", amount: 449.0, status: "Verified" },
  },
  {
    id: 7,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 389.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-22T13:15:00Z",
    items: [{ book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0, file_url: "/ebooks/sample-2.pdf" }],
    payment: { order_id: 7, payment_method: "PromptPay", slip_url: "/slips/slip-07.jpg", amount: 389.0, status: "Verified" },
    download_links: [{ token: "tok_07_b2_jkl012", order_id: 7, book_id: 2, download_count: 1, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" }],
  },
  {
    id: 8,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 399.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-06-26T15:30:00Z",
    items: [{ book_id: 12, title: "Thinking in Systems", quantity: 1, price_at_time: 399.0 }],
    payment: { order_id: 8, payment_method: "BankTransfer", slip_url: "/slips/slip-08.jpg", amount: 399.0, status: "Verified" },
  },
  {
    id: 9,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 219.0,
    status: "Cancelled",
    email_sent: false,
    created_at: "2026-06-28T18:50:00Z",
    items: [{ book_id: 5, title: "เสียงฝนในคืนวัยเด็ก", quantity: 1, price_at_time: 219.0 }],
    payment: { order_id: 9, payment_method: "PromptPay", slip_url: null, amount: 219.0, status: "Rejected" },
  },
  {
    id: 10,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 299.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-01T10:00:00Z",
    items: [{ book_id: 8, title: "Letters to a Young Designer", quantity: 1, price_at_time: 299.0 }],
    payment: { order_id: 10, payment_method: "PromptPay", slip_url: "/slips/slip-10.jpg", amount: 299.0, status: "Verified" },
  },
  {
    id: 11,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 528.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-03T14:15:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0 },
      { book_id: 11, title: "ดาวพระศุกร์ก่อนรุ่งสาง", quantity: 1, price_at_time: 269.0 },
    ],
    payment: { order_id: 11, payment_method: "PromptPay", slip_url: "/slips/slip-11.jpg", amount: 528.0, status: "Verified" },
  },
  {
    id: 12,
    user_id: 7,
    checkout_email: "peerat.dev@outlook.com",
    checkout_name: "พีรณัฐ สายซอฟต์แวร์",
    total: 838.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-06T17:45:00Z",
    items: [
      { book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0 },
      { book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0 },
    ],
    payment: { order_id: 12, payment_method: "PromptPay", slip_url: "/slips/slip-12.jpg", amount: 838.0, status: "Verified" },
  },
  {
    id: 13,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 748.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-10T11:20:00Z",
    items: [
      { book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0, file_url: "/ebooks/sample-2.pdf" },
      { book_id: 10, title: "The Minimal Kitchen", quantity: 1, price_at_time: 349.0, file_url: "/ebooks/sample-10.pdf" },
    ],
    payment: { order_id: 13, payment_method: "PromptPay", slip_url: "/slips/slip-13.jpg", amount: 748.0, status: "Verified" },
    download_links: [
      { token: "tok_13_b2_mno345", order_id: 13, book_id: 2, download_count: 0, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
      { token: "tok_13_b10_pqr678", order_id: 13, book_id: 10, download_count: 1, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
    ],
  },
  {
    id: 14,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 449.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-14T12:00:00Z",
    items: [{ book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0 }],
    payment: { order_id: 14, payment_method: "BankTransfer", slip_url: "/slips/slip-14.jpg", amount: 449.0, status: "Verified" },
  },
  {
    id: 15,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 269.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-18T19:30:00Z",
    items: [{ book_id: 11, title: "ดาวพระศุกร์ก่อนรุ่งสาง", quantity: 1, price_at_time: 269.0 }],
    payment: { order_id: 15, payment_method: "PromptPay", slip_url: "/slips/slip-15.jpg", amount: 269.0, status: "Verified" },
  },
  {
    id: 16,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 329.0,
    status: "Cancelled",
    email_sent: false,
    created_at: "2026-07-21T16:10:00Z",
    items: [{ book_id: 4, title: "Garden of Patterns", quantity: 1, price_at_time: 329.0 }],
    payment: { order_id: 16, payment_method: "PromptPay", slip_url: null, amount: 329.0, status: "Rejected" },
  },
  {
    id: 17,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 239.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-25T15:40:00Z",
    items: [{ book_id: 9, title: "ทะเลในเปล่า", quantity: 1, price_at_time: 239.0 }],
    payment: { order_id: 17, payment_method: "PromptPay", slip_url: "/slips/slip-17.jpg", amount: 239.0, status: "Verified" },
  },
  {
    id: 18,
    user_id: 7,
    checkout_email: "peerat.dev@outlook.com",
    checkout_name: "พีรณัฐ สายซอฟต์แวร์",
    total: 389.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-07-29T21:05:00Z",
    items: [{ book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0 }],
    payment: { order_id: 18, payment_method: "PromptPay", slip_url: "/slips/slip-18.jpg", amount: 389.0, status: "Verified" },
  },
  {
    id: 19,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 458.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-02T08:30:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0, file_url: "/ebooks/sample-1.pdf" },
      { book_id: 3, title: "สมุดบันทึกลมหนาว", quantity: 1, price_at_time: 199.0, file_url: "/ebooks/sample-3.pdf" },
    ],
    payment: { order_id: 19, payment_method: "PromptPay", slip_url: "/slips/slip-19.jpg", amount: 458.0, status: "Verified" },
    download_links: [
      { token: "tok_19_b1_stu901", order_id: 19, book_id: 1, download_count: 2, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
      { token: "tok_19_b3_vwx234", order_id: 19, book_id: 3, download_count: 0, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
    ],
  },
  {
    id: 20,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 349.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-05T13:25:00Z",
    items: [{ book_id: 10, title: "The Minimal Kitchen", quantity: 1, price_at_time: 349.0 }],
    payment: { order_id: 20, payment_method: "BankTransfer", slip_url: "/slips/slip-20.jpg", amount: 349.0, status: "Verified" },
  },
  {
    id: 21,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 508.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-09T10:10:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0 },
      { book_id: 11, title: "ดาวพระศุกร์ก่อนรุ่งสาง", quantity: 1, price_at_time: 249.0 },
    ],
    payment: { order_id: 21, payment_method: "PromptPay", slip_url: "/slips/slip-21.jpg", amount: 508.0, status: "Verified" },
  },
  {
    id: 22,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 628.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-12T17:15:00Z",
    items: [
      { book_id: 4, title: "Garden of Patterns", quantity: 1, price_at_time: 329.0 },
      { book_id: 8, title: "Letters to a Young Designer", quantity: 1, price_at_time: 299.0 },
    ],
    payment: { order_id: 22, payment_method: "PromptPay", slip_url: "/slips/slip-22.jpg", amount: 628.0, status: "Verified" },
  },
  {
    id: 23,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 349.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-16T11:50:00Z",
    items: [{ book_id: 10, title: "The Minimal Kitchen", quantity: 1, price_at_time: 349.0 }],
    payment: { order_id: 23, payment_method: "PromptPay", slip_url: "/slips/slip-23.jpg", amount: 349.0, status: "Verified" },
  },
  {
    id: 24,
    user_id: 7,
    checkout_email: "peerat.dev@outlook.com",
    checkout_name: "พีรณัฐ สายซอฟต์แวร์",
    total: 399.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-20T18:20:00Z",
    items: [{ book_id: 12, title: "Thinking in Systems", quantity: 1, price_at_time: 399.0 }],
    payment: { order_id: 24, payment_method: "PromptPay", slip_url: "/slips/slip-24.jpg", amount: 399.0, status: "Verified" },
  },
  {
    id: 25,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 648.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-23T14:00:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0, file_url: "/ebooks/sample-1.pdf" },
      { book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0, file_url: "/ebooks/sample-2.pdf" },
    ],
    payment: { order_id: 25, payment_method: "PromptPay", slip_url: "/slips/slip-25.jpg", amount: 648.0, status: "Verified" },
    download_links: [
      { token: "tok_25_b1_yz5678", order_id: 25, book_id: 1, download_count: 1, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
      { token: "tok_25_b2_aa9012", order_id: 25, book_id: 2, download_count: 0, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
    ],
  },
  {
    id: 26,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 179.0,
    status: "Cancelled",
    email_sent: false,
    created_at: "2026-08-26T16:40:00Z",
    items: [{ book_id: 7, title: "ต้นไม้ในกระถางระเบียง", quantity: 1, price_at_time: 179.0 }],
    payment: { order_id: 26, payment_method: "PromptPay", slip_url: null, amount: 179.0, status: "Rejected" },
  },
  {
    id: 27,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 399.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-08-29T09:30:00Z",
    items: [{ book_id: 12, title: "Thinking in Systems", quantity: 1, price_at_time: 399.0 }],
    payment: { order_id: 27, payment_method: "BankTransfer", slip_url: "/slips/slip-27.jpg", amount: 399.0, status: "Verified" },
  },
  {
    id: 28,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 389.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-09-01T11:10:00Z",
    items: [{ book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0 }],
    payment: { order_id: 28, payment_method: "PromptPay", slip_url: "/slips/slip-28.jpg", amount: 389.0, status: "Verified" },
  },
  {
    id: 29,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 259.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-09-03T15:20:00Z",
    items: [{ book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0 }],
    payment: { order_id: 29, payment_method: "PromptPay", slip_url: "/slips/slip-29.jpg", amount: 259.0, status: "Verified" },
  },
  {
    id: 30,
    user_id: 7,
    checkout_email: "peerat.dev@outlook.com",
    checkout_name: "พีรณัฐ สายซอฟต์แวร์",
    total: 449.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-09-05T20:30:00Z",
    items: [{ book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0 }],
    payment: { order_id: 30, payment_method: "PromptPay", slip_url: "/slips/slip-30.jpg", amount: 449.0, status: "Verified" },
  },
  {
    id: 31,
    user_id: 2,
    checkout_email: "firts.zx99@gmail.com",
    checkout_name: "KANNITI YASO",
    total: 528.0,
    status: "Confirmed",
    email_sent: true,
    created_at: "2026-09-07T10:45:00Z",
    items: [
      { book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0, file_url: "/ebooks/sample-1.pdf" },
      { book_id: 11, title: "ดาวพระศุกร์ก่อนรุ่งสาง", quantity: 1, price_at_time: 269.0, file_url: "/ebooks/sample-11.pdf" },
    ],
    payment: { order_id: 31, payment_method: "PromptPay", slip_url: "/slips/slip-31.jpg", amount: 528.0, status: "Verified" },
    download_links: [
      { token: "tok_31_b1_bb3456", order_id: 31, book_id: 1, download_count: 0, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
      { token: "tok_31_b11_cc7890", order_id: 31, book_id: 11, download_count: 0, max_downloads: 5, expires_at: "2026-12-31T23:59:59Z" },
    ],
  },
  {
    id: 32,
    user_id: 3,
    checkout_email: "somchai.tech@gmail.com",
    checkout_name: "สมชาย สายโค้ด",
    total: 628.0,
    status: "Pending",
    email_sent: false,
    created_at: "2026-09-09T13:10:00Z",
    items: [
      { book_id: 4, title: "Garden of Patterns", quantity: 1, price_at_time: 329.0 },
      { book_id: 8, title: "Letters to a Young Designer", quantity: 1, price_at_time: 299.0 },
    ],
    payment: { order_id: 32, payment_method: "PromptPay", slip_url: "/slips/slip-32-mock.jpg", amount: 628.0, status: "Pending" },
  },
  {
    id: 33,
    user_id: 4,
    checkout_email: "wanida.read@hotmail.com",
    checkout_name: "วนิดา นักอ่านตัวยง",
    total: 259.0,
    status: "Pending",
    email_sent: false,
    created_at: "2026-09-10T09:20:00Z",
    items: [{ book_id: 1, title: "แสงจันทร์บนป่าไผ่", quantity: 1, price_at_time: 259.0 }],
    payment: { order_id: 33, payment_method: "PromptPay", slip_url: "/slips/slip-33-mock.jpg", amount: 259.0, status: "Pending" },
  },
  {
    id: 34,
    user_id: 5,
    checkout_email: "tanawat.design@gmail.com",
    checkout_name: "ธนวัฒน์ ศิลป์สว่าง",
    total: 449.0,
    status: "Pending",
    email_sent: false,
    created_at: "2026-09-10T14:15:00Z",
    items: [{ book_id: 6, title: "Building Calm Software", quantity: 1, price_at_time: 449.0 }],
    payment: { order_id: 34, payment_method: "BankTransfer", slip_url: "/slips/slip-34-mock.jpg", amount: 449.0, status: "Pending" },
  },
  {
    id: 35,
    user_id: 6,
    checkout_email: "nichaphat.book@gmail.com",
    checkout_name: "ณิชาภัทร วงศ์วรรณ",
    total: 389.0,
    status: "Pending",
    email_sent: false,
    created_at: "2026-09-10T16:30:00Z",
    items: [{ book_id: 2, title: "The Quiet Algorithm", quantity: 1, price_at_time: 389.0 }],
    payment: { order_id: 35, payment_method: "PromptPay", slip_url: "/slips/slip-35-mock.jpg", amount: 389.0, status: "Pending" },
  },
];

// ==============================================================================
// ฟังก์ชันจำลองคำนวณผลลัพธ์ 4 รายงานจาก Mock Data (ตรงตามผลลัพธ์ SQL ทุกประการ)
// ==============================================================================

export function calculateMockSalesReport(): SalesReportRow[] {
  const confirmedOrders = mockOrders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const monthsMap = new Map<string, { total: number; count: number }>();
  confirmedOrders.forEach((o) => {
    const month = o.created_at.slice(0, 7);
    const curr = monthsMap.get(month) || { total: 0, count: 0 };
    curr.total += o.total;
    curr.count += 1;
    monthsMap.set(month, curr);
  });

  return Array.from(monthsMap.entries())
    .map(([sale_month, val]) => ({
      sale_month,
      total_orders: val.count,
      total_sales: val.total,
      avg_order_value: Math.round((val.total / val.count) * 100) / 100,
    }))
    .sort((a, b) => b.sale_month.localeCompare(a.sale_month));
}

export function calculateMockTopBooksReport(): TopBookReportRow[] {
  const confirmedOrders = mockOrders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const bookSales = new Map<number, { copies: number; revenue: number }>();
  confirmedOrders.forEach((o) => {
    o.items.forEach((item) => {
      const curr = bookSales.get(item.book_id) || { copies: 0, revenue: 0 };
      curr.copies += item.quantity;
      curr.revenue += item.quantity * item.price_at_time;
      bookSales.set(item.book_id, curr);
    });
  });

  return Array.from(bookSales.entries())
    .map(([bookId, stats]) => {
      const book = mockBooks.find((b) => b.id === bookId);
      return {
        book_id: bookId,
        title: book?.title || `Book #${bookId}`,
        author_name: book?.author || "ไม่ระบุ",
        category_name: book?.category || "ทั่วไป",
        total_sold_copies: stats.copies,
        total_revenue: stats.revenue,
      };
    })
    .sort((a, b) => b.total_sold_copies - a.total_sold_copies || b.total_revenue - a.total_revenue)
    .slice(0, 5);
}

export function calculateMockCategorySalesReport(): CategorySalesReportRow[] {
  const confirmedOrders = mockOrders.filter((o) =>
    ["Confirmed", "Completed", "Paid"].includes(o.status)
  );

  const categoryMap = new Map<
    string,
    { id: number; ordersSet: Set<number>; copies: number; revenue: number }
  >();

  mockCategories.forEach((c) => {
    categoryMap.set(c.name, { id: c.id, ordersSet: new Set(), copies: 0, revenue: 0 });
  });

  confirmedOrders.forEach((o) => {
    o.items.forEach((item) => {
      const book = mockBooks.find((b) => b.id === item.book_id);
      const catName = book?.category || "ทั่วไป";
      const cat = categoryMap.get(catName);
      if (cat) {
        cat.ordersSet.add(o.id);
        cat.copies += item.quantity;
        cat.revenue += item.quantity * item.price_at_time;
      }
    });
  });

  return Array.from(categoryMap.entries())
    .map(([category_name, data]) => ({
      category_id: data.id,
      category_name,
      total_orders: data.ordersSet.size,
      total_books_sold: data.copies,
      total_category_revenue: data.revenue,
    }))
    .sort((a, b) => b.total_category_revenue - a.total_category_revenue);
}

export function calculateMockCustomerReport(): CustomerReportRow[] {
  return mockUsers
    .filter((u) => u.role_id === 2)
    .map((u) => {
      const userOrders = mockOrders.filter((o) => o.user_id === u.id);
      const total_orders = userOrders.length;
      let total_spent = 0;
      let confirmed_orders = 0;
      let pending_orders = 0;
      let cancelled_orders = 0;

      userOrders.forEach((o) => {
        if (["Confirmed", "Completed", "Paid"].includes(o.status)) {
          total_spent += o.total;
          confirmed_orders += 1;
        } else if (o.status === "Pending") {
          pending_orders += 1;
        } else if (o.status === "Cancelled") {
          cancelled_orders += 1;
        }
      });

      return {
        user_id: u.id,
        full_name: u.full_name,
        email: u.email,
        total_orders,
        total_spent,
        confirmed_orders,
        pending_orders,
        cancelled_orders,
      };
    })
    .filter((r) => r.total_orders > 0)
    .sort((a, b) => b.total_spent - a.total_spent);
}
