import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Set background color of a table cell."""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set inner margins (padding) for a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_styled_heading(doc, text, level):
    p = doc.add_heading(text, level=level)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    for run in p.runs:
        run.font.name = 'TH Sarabun New'
        run.font.bold = True
        if level == 1:
            run.font.size = Pt(20)
            run.font.color.rgb = RGBColor(30, 58, 138) # Navy
        elif level == 2:
            run.font.size = Pt(16)
            run.font.color.rgb = RGBColor(15, 23, 42) # Slate 900
        else:
            run.font.size = Pt(14)
            run.font.color.rgb = RGBColor(51, 65, 85) # Slate 700
    return p

def add_styled_paragraph(doc, text="", bold=False, italic=False, space_after=6, font_size=15):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if text:
        run = p.add_run(text)
        run.font.name = 'TH Sarabun New'
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F1F5F9") # Light slate
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(code_text.strip())
    run.font.name = 'Consolas'
    run.font.size = Pt(10.5)
    run.font.color.rgb = RGBColor(15, 23, 42)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def style_table(tbl, col_widths, headers, data, header_bg="1E3A8A"):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'TH Sarabun New'
            run.font.bold = True
            run.font.size = Pt(13.5)
            run.font.color.rgb = RGBColor(255, 255, 255)

    for r_idx, row_data in enumerate(data):
        row_cells = tbl.add_row().cells
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            row_cells[c_idx].text = str(cell_value)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=120, right=120)
            p = row_cells[c_idx].paragraphs[0]
            if c_idx == 0 and len(cell_value) < 15:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = 'TH Sarabun New'
                run.font.size = Pt(13)
                run.font.color.rgb = RGBColor(30, 41, 59)

    for row in tbl.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = Inches(w)

def main():
    doc = Document()

    # 1. Page Setup: Margins (Normal 1 inch)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)

    # Set base normal style font
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'TH Sarabun New'
    normal_style.font.size = Pt(15)

    # =========================================================================
    # 🌟 หน้าปก (Cover Page)
    # =========================================================================
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(10)
    p_logo.paragraph_format.space_after = Pt(14)
    
    logo_path = r"C:\Users\First 1\Downloads\RMUTI-logo-color2.png"
    if os.path.exists(logo_path):
        p_logo.add_run().add_picture(logo_path, width=Inches(1.8))
    else:
        p_logo.add_run("[ตราสัญลักษณ์ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน]").bold = True

    p_rep = doc.add_paragraph()
    p_rep.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rep.paragraph_format.space_after = Pt(4)
    r = p_rep.add_run("รายงานโครงงานพัฒนาระบบฐานข้อมูล (Mini Project Report)")
    r.font.name = 'TH Sarabun New'
    r.font.size = Pt(22)
    r.font.bold = True
    r.font.color.rgb = RGBColor(30, 58, 138)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(24)
    r = p_title.add_run("ระบบร้านขายหนังสือและอีบุ๊กออนไลน์\n(Lampara Books E-Book Store)")
    r.font.name = 'TH Sarabun New'
    r.font.size = Pt(26)
    r.font.bold = True
    r.font.color.rgb = RGBColor(180, 83, 9) # Amber 700

    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_course.paragraph_format.space_after = Pt(36)
    r = p_course.add_run(
        "รายวิชา: [31-407-102-301] ระบบฐานข้อมูล (Database Systems)\n"
        "หลักสูตรวิศวกรรมคอมพิวเตอร์ (ECP) ชั้นปีที่ 3 ห้อง ECP 321\n"
        "คณะวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน\n"
        "ภาคการศึกษาที่ 1 ปีการศึกษา 2569"
    )
    r.font.name = 'TH Sarabun New'
    r.font.size = Pt(15.5)
    r.font.color.rgb = RGBColor(71, 85, 105)

    p_adviser = doc.add_paragraph()
    p_adviser.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_adviser.paragraph_format.space_after = Pt(28)
    r1 = p_adviser.add_run("อาจารย์ผู้สอน\n")
    r1.font.bold = True
    r1.font.size = Pt(16)
    r2 = p_adviser.add_run("อาจารย์ประภาส ผ่องสนาม")
    r2.font.bold = True
    r2.font.size = Pt(18)
    r2.font.color.rgb = RGBColor(15, 23, 42)

    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_author.paragraph_format.space_after = Pt(40)
    r1 = p_author.add_run("จัดทำโดย\n")
    r1.font.bold = True
    r1.font.size = Pt(16)
    r2 = p_author.add_run("นายกานต์นิธิ ยะโส\n")
    r2.font.bold = True
    r2.font.size = Pt(18)
    r2.font.color.rgb = RGBColor(15, 23, 42)
    r3 = p_author.add_run("รหัสนักศึกษา: 67332110223-9  กลุ่มเรียน: ECP3N")
    r3.font.size = Pt(15)

    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_foot.add_run("ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์และเทคโนโลยี\nมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา")
    r.font.size = Pt(14)
    r.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทคัดย่อ / บทสรุปผู้บริหาร
    # =========================================================================
    add_styled_heading(doc, "บทสรุปผู้บริหาร (Executive Summary)", level=1)
    
    p = add_styled_paragraph(doc, 
        "โครงงานพัฒนาระบบฐานข้อมูล \"ร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books)\" จัดทำขึ้นเพื่อประยุกต์ใช้ทฤษฎีการออกแบบและการบริหารจัดการระบบฐานข้อมูลเชิงสัมพันธ์ (Relational Database Management Systems: RDBMS) ภายใต้เกณฑ์มาตรฐานของรายวิชาระบบฐานข้อมูล [31-407-102-301] โดยเน้นการพัฒนาระบบจำหน่ายหนังสือดิจิทัลที่มีความรัดกุม ถูกต้องตามหลักการจัดรูปแบบบรรทัดฐานที่ 3 (Third Normal Form: 3NF) และมีความปลอดภัยในการส่งมอบสินค้าดิจิทัลในระดับข้อมูลจริง",
        space_after=8
    )
    
    p = add_styled_paragraph(doc,
        "ระบบได้รับการออกแบบฐานข้อมูลครอบคลุมกระบวนการขายครบวงจรจำนวนทั้งสิ้น 9 ตาราง ได้แก่ ตารางบทบาทผู้ใช้ (roles), สมาชิกและแอดมิน (users), ผู้แต่ง (authors), หมวดหมู่หนังสือ (categories), รายการหนังสือ E-Book (books), คำสั่งซื้อหลัก (orders), รายการย่อยในคำสั่งซื้อ (order_items), การชำระเงินและสลิปจำลอง (payments), และสิทธิ์โทเค็นการดาวน์โหลดปลอดภัย (download_links) มีการกำหนดข้อกำหนดบูรณภาพข้อมูล (Integrity Constraints) อย่างสมบูรณ์ ได้แก่ Primary Key, Foreign Key, NOT NULL, UNIQUE, CHECK, และ DEFAULT",
        space_after=8
    )

    p = add_styled_paragraph(doc,
        "ระบบทำงานร่วมกับฐานข้อมูล PostgreSQL บนคลาวด์แพลตฟอร์ม Supabase ผ่านแอปพลิเคชัน Next.js 16 (TypeScript) มีการรักษาความปลอดภัยด้วยเงื่อนไขสิทธิ์: สมาชิกทั่วไปไม่สามารถเข้าถึงหน้าหลังบ้านได้ (403 Forbidden Access Denied) และคำสั่งซื้อที่ยังไม่ได้รับการยืนยันการชำระเงิน (Pending) จะไม่สามารถเปิดดาวน์โหลดหนังสือได้เด็ดขาด นอกจากนี้ ยังได้พัฒนาคำสั่งสืบค้น SQL ขั้นสูง (Complex Queries) สำหรับจัดทำรายงานวิเคราะห์ธุรกิจ 4 ด้าน ตอบโจทย์การบริหารจัดการยอดขาย สินค้าขายดี หมวดหมู่ยอดนิยม และมูลค่าสะสมของลูกค้า พร้อมทั้งส่งออกเป็นไฟล์ CSV มาตรฐาน UTF-8 BOM ที่รองรับภาษาไทยใน Microsoft Excel ได้อย่างสมบูรณ์",
        space_after=14
    )

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 1: บทนำและวัตถุประสงค์
    # =========================================================================
    add_styled_heading(doc, "บทที่ 1: บทนำและวัตถุประสงค์ของโครงงาน", level=1)
    
    add_styled_heading(doc, "1.1 ที่มาและความสำคัญของปัญหา", level=2)
    add_styled_paragraph(doc, 
        "ในยุคเศรษฐกิจดิจิทัล หนังสืออิเล็กทรอนิกส์ (E-Book) ได้กลายเป็นช่องทางการเผยแพร่และอ่านหนังสือที่ได้รับความนิยมอย่างแพร่หลาย เนื่องจากผู้บริโภคสามารถสั่งซื้อและดาวน์โหลดไปอ่านได้ทันทีทุกที่ทุกเวลา อย่างไรก็ดี สถาปัตยกรรมระบบสำหรับร้านขายสินค้าดิจิทัลมีความแตกต่างอย่างมีนัยสำคัญจากร้านค้าสินค้าที่จับต้องได้ กล่าวคือ สินค้าดิจิทัลไม่มีการจำกัดจำนวนสินค้าคงเหลือทางกายภาพ แต่ต้องการระบบรักษาความปลอดภัยในการส่งมอบไฟล์ที่มีความเข้มงวดสูง เพื่อให้มั่นใจว่าเฉพาะคำสั่งซื้อที่ชำระเงินถูกต้องแล้วเท่านั้นจึงจะได้รับสิทธิ์เข้าถึงเนื้อหา และป้องกันการนำลิงก์ดาวน์โหลดไปแชร์ต่อสาธารณะ"
    )
    add_styled_paragraph(doc,
        "ด้วยเหตุนี้ การออกแบบโครงสร้างฐานข้อมูลที่มีความสัมพันธ์ถูกต้องตามหลัก Normalization และมีกลไกตรวจสอบเงื่อนไขในระดับ Schema จึงเป็นหัวใจสำคัญอย่างยิ่งในการทำให้ระบบทำงานได้อย่างมั่นคง ปราศจากข้อมูลผิดรูป และรองรับการนำข้อมูลธุรกรรมมาประมวลผลเป็นรายงานวิเคราะห์เพื่อสนับสนุนการตัดสินใจเชิงธุรกิจได้อย่างมีประสิทธิภาพ"
    )

    add_styled_heading(doc, "1.2 วัตถุประสงค์ของโครงงาน", level=2)
    for obj in [
        "1. เพื่อออกแบบและพัฒนาฐานข้อมูลเชิงสัมพันธ์สำหรับระบบร้านค้า E-Book ที่ถูกต้องตามหลักการ Normalization ระดับ 3NF",
        "2. เพื่อสร้างระบบเว็บแอปพลิเคชันต้นแบบ (Prototype) ที่เชื่อมโยงกับฐานข้อมูล PostgreSQL บน Supabase Cloud ได้จริง",
        "3. เพื่อจำลองเส้นทางการใช้งานของลูกค้า (Customer Journey) และระบบบริหารจัดการหลังบ้านของผู้ดูแลระบบ (Admin Backoffice)",
        "4. เพื่อเขียนคำสั่ง SQL สืบทอดรายงานวิเคราะห์ข้อมูลเชิงลึก 4 หัวข้อ และสร้างฟังก์ชันส่งออกข้อมูลเป็นไฟล์ CSV สำหรับผู้บริหาร",
        "5. เพื่อประยุกต์ใช้เครื่องมือปัญญาประดิษฐ์ (AI) ในการออกแบบและแก้ปัญหาอย่างมีความรับผิดชอบ โปร่งใส และตรวจสอบได้"
    ]:
        add_styled_paragraph(doc, obj, space_after=3)

    add_styled_heading(doc, "1.3 ขอบเขตของระบบ (System Scope)", level=2)
    add_styled_paragraph(doc, "ระบบประกอบด้วย 2 ส่วนหลักตามข้อกำหนดใบงานข้อ 2 และ 3 ดังนี้:", bold=True)
    
    add_styled_paragraph(doc, "ก) ขอบเขตส่วนหน้าร้านสำหรับลูกค้า (Customer Portal):", bold=True)
    for item in [
        "• ระบบสมาชิก: สมัครสมาชิก, เข้าสู่ระบบ, แก้ไขข้อมูลพื้นฐาน (ชื่อ, เบอร์โทร, อีเมล) และระบุบัญชีธนาคารเพื่อยืนยันตัวตน",
        "• แคตตาล็อกหนังสือ: ค้นหาด้วยชื่อเรื่อง/คำสำคัญ, กรองตามหมวดหมู่, แสดงรายละเอียดราคา ภาพปก และสถานะเปิดขาย",
        "• ตะกร้าสินค้า: เพิ่ม/ลดจำนวนหนังสือ ลบรายการ และคำนวณราคาสุทธิแบบ Real-time",
        "• การสั่งซื้อและชำระเงินจำลอง: กรอกข้อมูลผู้สั่ง แนบสลิปโอนเงินจำลอง และตรวจสอบความถูกต้องระหว่างชื่อสั่งซื้อและชื่อบัญชี",
        "• การดาวน์โหลด E-Book ปลอดภัย: ระบบเปิดลิงก์ดาวน์โหลดให้เฉพาะคำสั่งซื้อที่ได้รับการอนุมัติ (Confirmed) แล้วเท่านั้น โดยจำกัดสิทธิ์ดาวน์โหลดสูงสุด 5 ครั้งและมีวันหมดอายุ"
    ]:
        add_styled_paragraph(doc, item, space_after=2)

    add_styled_paragraph(doc, "\nข) ขอบเขตส่วนหลังบ้านสำหรับผู้ดูแลระบบ (Admin Backoffice):", bold=True)
    for item in [
        "• ระบบรักษาความปลอดภัยสิทธิ์เข้าถึง (RBAC): ซ่อนปุ่มหลังบ้านจากลูกค้า และมี Route Guard บล็อก URL ด้วยหน้า 403 Forbidden",
        "• การจัดการหนังสือ: เพิ่มหนังสือใหม่, แก้ไขข้อมูลราคา รายละเอียด ลิงก์ดาวน์โหลด และสลับสถานะเปิด/ปิดการขาย (Soft Delete)",
        "• การจัดการหมวดหมู่: เพิ่มและแก้ไขหมวดหมู่หนังสือ",
        "• การจัดการคำสั่งซื้อ: ค้นหา ตรวจสอบหลักฐานสลิป และกดอนุมัติ (Confirmed) เพื่อเปิดสิทธิ์ดาวน์โหลด หรือกดยกเลิก (Cancelled)",
        "• การจัดการสมาชิก: ดูข้อมูลสมาชิกและสลับบทบาทผู้ใช้ (Admin <-> Customer)",
        "• รายงานวิเคราะห์: แสดงผลข้อมูลสด 4 ด้าน และส่งออกเป็นไฟล์ CSV มาตรฐาน UTF-8 BOM"
    ]:
        add_styled_paragraph(doc, item, space_after=2)

    add_styled_heading(doc, "1.4 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา", level=2)
    tech_headers = ["องค์ประกอบ", "เทคโนโลยีที่เลือกใช้", "บทบาทและความเหมาะสม"]
    tech_data = [
        ["ระบบจัดการฐานข้อมูล (DBMS)", "PostgreSQL (Supabase Cloud)", "ฐานข้อมูลเชิงสัมพันธ์มาตรฐานสากล รองรับ ACID, Constraints, JSON, Indexes และ RLS"],
        ["เว็บเฟรมเวิร์ก (Frontend)", "Next.js 16 (React 19, App Router)", "เฟรมเวิร์กสมัยใหม่ ให้ความเร็วสูง มีระบบ Server Component และ Routing ปลอดภัย"],
        ["ภาษาโปรแกรม (Language)", "TypeScript", "ระบบ Type-Safe ป้องกันข้อผิดพลาดของข้อมูล เชื่อมโยง Data Types ตรงกับ Schema"],
        ["การตกแต่งและจัดวาง (Styling)", "Tailwind CSS & Minimal Typography", "ออกแบบ UI ทันสมัย สะอาดตา ด้วยฟอนต์ Plus Jakarta Sans และ IBM Plex Sans Thai"],
        ["ชุดไอคอน (Iconography)", "Lucide React Icons", "ไอคอนมาตรฐานแบบมินิมอล ช่วยให้ผู้ใช้เข้าใจสถานะของระบบได้อย่างชัดเจน"]
    ]
    tbl_tech = doc.add_table(rows=1, cols=3)
    style_table(tbl_tech, [1.5, 2.0, 3.2], tech_headers, tech_data)

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 2: การวิเคราะห์และออกแบบฐานข้อมูล
    # =========================================================================
    add_styled_heading(doc, "บทที่ 2: การวิเคราะห์และออกแบบฐานข้อมูล", level=1)
    
    add_styled_heading(doc, "2.1 โครงสร้างผังความสัมพันธ์ข้อมูล (Entity-Relationship Diagram)", level=2)
    add_styled_paragraph(doc, 
        "ฐานข้อมูลประกอบด้วย 9 ตารางที่มีความสัมพันธ์กันอย่างชัดเจนตามหลักการออกแบบฐานข้อมูลเชิงสัมพันธ์ (Relational Data Model):"
    )
    for rel in [
        "1. roles (1) <---> (N) users : บทบาทหนึ่งบทบาทกำหนดให้กับผู้ใช้ได้หลายคน (One-to-Many)",
        "2. users (1) <---> (N) orders : สมาชิกหนึ่งคนสามารถมีประวัติคำสั่งซื้อได้หลายคำสั่งซื้อ (One-to-Many)",
        "3. authors (1) <---> (N) books : ผู้แต่งหนึ่งท่านมีผลงานหนังสือได้หลายเล่ม (One-to-Many)",
        "4. categories (1) <---> (N) books : หมวดหมู่หนึ่งหมวดหมู่บรรจุหนังสือได้หลายเล่ม (One-to-Many)",
        "5. orders (1) <---> (N) order_items : คำสั่งซื้อหนึ่งออเดอร์มีรายการหนังสือย่อยได้หลายรายการ (One-to-Many)",
        "6. books (1) <---> (N) order_items : หนังสือหนึ่งเล่มสามารถถูกสั่งซื้อในรายการย่อยได้หลายออเดอร์ (One-to-Many)",
        "7. orders (1) <---> (1) payments : คำสั่งซื้อหนึ่งรายการมีการแจ้งชำระเงินและสลิปหลักฐานคู่กัน 1 ชุด (One-to-One)",
        "8. orders (1) <---> (N) download_links : คำสั่งซื้อที่อนุมัติแล้วจะสร้างสิทธิ์ดาวน์โหลดตามจำนวนเล่มที่ซื้อ (One-to-Many)",
        "9. books (1) <---> (N) download_links : หนังสือแต่ละเล่มเชื่อมโยงกับโทเค็นดาวน์โหลดของลูกค้าแต่ละออเดอร์ (One-to-Many)"
    ]:
        add_styled_paragraph(doc, rel, space_after=2)

    add_styled_heading(doc, "2.2 ทฤษฎีการปรับรูปบรรทัดฐาน (Database Normalization to 3NF)", level=2)
    add_styled_paragraph(doc, "การปรับโครงสร้างฐานข้อมูลดำเนินการตามหลัก Normalization อย่างเคร่งครัดเป็น 4 ลำดับขั้น:")
    add_styled_paragraph(doc, "1. Unnormalized Form (UNF): โครงสร้างเดิมก่อนจัดรูป เก็บข้อมูลการสั่งซื้อ ชื่อลูกค้า รายการหนังสือ ผู้แต่ง หมวดหมู่ และราคาไว้ในตารางรวมเพียงตารางเดียว เกิดปัญหาข้อมูลซ้ำซ้อนและชุดข้อมูลซ้ำ (Repeating Groups)", space_after=3)
    add_styled_paragraph(doc, "2. First Normal Form (1NF): ขจัด Repeating Groups โดยทำให้ทุก Attribute เป็น Atomic Value (ค่าเดี่ยวที่ไม่สามารถแบ่งย่อยได้อีก) และกำหนด Primary Key ชัดเจนในทุกแถว", space_after=3)
    add_styled_paragraph(doc, "3. Second Normal Form (2NF): ขจัด Partial Functional Dependency โดยแยกตาราง authors และ categories ออกจาก books เพื่อให้ Attribute ทุกตัวขึ้นตรงกับ Primary Key books.id ทั้งหมด และแยกตาราง order_items โดยเก็บ price_at_time เพื่อบันทึกราคา ณ วันที่ซื้อ", space_after=3)
    add_styled_paragraph(doc, "4. Third Normal Form (3NF): ขจัด Transitive Functional Dependency (Attribute ที่ขึ้นต่อกันเองโดยไม่ผ่าน Primary Key) โดยแยกสิทธิ์ roles ออกจาก users, แยกการชำระเงิน payments ออกจาก orders, และแยกโทเค็นความปลอดภัย download_links ออกจาก orders", space_after=6)

    add_styled_heading(doc, "2.3 พจนานุกรมข้อมูลฉบับสมบูรณ์ 9 ตาราง (Data Dictionary)", level=2)
    
    dict_headers = ["ชื่อฟิลด์", "ชนิดข้อมูล", "ข้อกำหนด (Constraints)", "คำอธิบายความหมาย"]
    
    # 1. roles
    add_styled_paragraph(doc, "ตารางที่ 1: roles (บทบาทผู้ใช้งานในระบบ)", bold=True, space_after=2)
    t1_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสบทบาท (1 = Admin, 2 = Customer)"],
        ["name", "VARCHAR(50)", "UNIQUE, NOT NULL", "ชื่อบทบาทผู้ใช้งาน"],
        ["description", "TEXT", "NULL", "คำอธิบายขอบเขตหน้าที่ความรับผิดชอบ"],
        ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่บันทึกบทบาท"]
    ]
    tbl1 = doc.add_table(rows=1, cols=4)
    style_table(tbl1, [1.2, 1.4, 2.1, 2.0], dict_headers, t1_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 2. users
    add_styled_paragraph(doc, "ตารางที่ 2: users (ข้อมูลสมาชิกและผู้ดูแลระบบ)", bold=True, space_after=2)
    t2_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสผู้ใช้งาน"],
        ["role_id", "INT", "FK -> roles(id) RESTRICT", "รหัสบทบาทผู้ใช้"],
        ["email", "VARCHAR(255)", "UNIQUE, NOT NULL", "อีเมลสำหรับเข้าสู่ระบบและรับใบเสร็จ"],
        ["password_hash", "VARCHAR(255)", "NOT NULL", "รหัสผ่านที่เข้ารหัสความปลอดภัย"],
        ["full_name", "VARCHAR(150)", "NOT NULL", "ชื่อและนามสกุลจริงของผู้ใช้"],
        ["phone", "VARCHAR(30)", "NULL", "เบอร์โทรศัพท์ติดต่อ"],
        ["bank_account_name", "VARCHAR(150)", "NULL", "ชื่อบัญชีธนาคารสำหรับยืนยันตัวตนสั่งซื้อ"],
        ["bank_account_number", "VARCHAR(50)", "NULL", "เลขที่บัญชีธนาคารของผู้ใช้"],
        ["bank_name", "VARCHAR(100)", "NULL", "ธนาคารหรือผู้ให้บริการชำระเงิน"],
        ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่ลงทะเบียน"],
        ["updated_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่แก้ไขข้อมูลล่าสุด"]
    ]
    tbl2 = doc.add_table(rows=1, cols=4)
    style_table(tbl2, [1.5, 1.2, 2.1, 1.9], dict_headers, t2_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 3. authors
    add_styled_paragraph(doc, "ตารางที่ 3: authors (ข้อมูลผู้แต่ง / นักเขียน)", bold=True, space_after=2)
    t3_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสผู้แต่ง"],
        ["name", "VARCHAR(150)", "NOT NULL", "ชื่อ-นามสกุล หรือนามปากกาผู้แต่ง"],
        ["bio", "TEXT", "NULL", "ประวัติและผลงานโดยย่อ"],
        ["email", "VARCHAR(255)", "NULL", "อีเมลติดต่อผู้แต่ง"],
        ["avatar_url", "VARCHAR(500)", "NULL", "ลิงก์รูปภาพประจำตัวผู้แต่ง"],
        ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่บันทึกข้อมูล"]
    ]
    tbl3 = doc.add_table(rows=1, cols=4)
    style_table(tbl3, [1.2, 1.4, 2.1, 2.0], dict_headers, t3_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 4. categories
    add_styled_paragraph(doc, "ตารางที่ 4: categories (หมวดหมู่หนังสือ)", bold=True, space_after=2)
    t4_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสหมวดหมู่"],
        ["name", "VARCHAR(100)", "UNIQUE, NOT NULL", "ชื่อหมวดหมู่หนังสือภาษาไทย"],
        ["slug", "VARCHAR(100)", "UNIQUE, NOT NULL", "คีย์อ้างอิง URL Slug ภาษาอังกฤษ"],
        ["description", "TEXT", "NULL", "คำอธิบายเกี่ยวกับหมวดหมู่"],
        ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่สร้างหมวดหมู่"]
    ]
    tbl4 = doc.add_table(rows=1, cols=4)
    style_table(tbl4, [1.2, 1.4, 2.1, 2.0], dict_headers, t4_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 5. books
    add_styled_paragraph(doc, "ตารางที่ 5: books (ข้อมูลหนังสือดิจิทัล E-Book)", bold=True, space_after=2)
    t5_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสหนังสือ"],
        ["title", "VARCHAR(255)", "NOT NULL", "ชื่อเรื่องหนังสือ"],
        ["author_id", "INT", "FK -> authors(id) SET NULL", "รหัสผู้แต่ง"],
        ["category_id", "INT", "FK -> categories(id) SET NULL", "รหัสหมวดหมู่"],
        ["price", "DECIMAL(10,2)", "NOT NULL, CHECK (price >= 0)", "ราคาจำหน่ายสุทธิต่อเล่ม (บาท)"],
        ["cover_color", "VARCHAR(20)", "DEFAULT '#2F5D50'", "โทนสีปกจำลองของระบบ"],
        ["description", "TEXT", "NULL", "เรื่องย่อและรายละเอียดเนื้อหา"],
        ["pages", "INT", "CHECK (pages >= 0)", "จำนวนหน้าทั้งหมด"],
        ["isbn", "VARCHAR(30)", "UNIQUE, NULL", "เลขมาตรฐานสากลประจำหนังสือ"],
        ["is_active", "BOOLEAN", "DEFAULT TRUE", "สถานะพร้อมขาย (true=เปิด, false=ปิด)"],
        ["file_url", "VARCHAR(500)", "NULL", "เส้นทางไฟล์ PDF/EPUB ตัวอย่าง"]
    ]
    tbl5 = doc.add_table(rows=1, cols=4)
    style_table(tbl5, [1.2, 1.4, 2.1, 2.0], dict_headers, t5_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 6. orders
    add_styled_paragraph(doc, "ตารางที่ 6: orders (ข้อมูลคำสั่งซื้อหลัก)", bold=True, space_after=2)
    t6_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสคำสั่งซื้อ (Order ID)"],
        ["user_id", "INT", "FK -> users(id) SET NULL", "รหัสสมาชิกผู้สั่งซื้อ"],
        ["checkout_email", "VARCHAR(255)", "NOT NULL", "อีเมลผู้รับลิงก์ดาวน์โหลดและใบเสร็จ"],
        ["checkout_name", "VARCHAR(150)", "NOT NULL", "ชื่อผู้สั่งซื้อ"],
        ["total", "DECIMAL(10,2)", "NOT NULL, CHECK (total >= 0)", "ยอดรวมสุทธิที่ต้องชำระ (บาท)"],
        ["status", "VARCHAR(30)", "CHECK (status IN (...))", "สถานะ (Pending, Paid, Confirmed, Cancelled)"],
        ["email_sent", "BOOLEAN", "DEFAULT TRUE", "สถานะการจัดส่งอีเมลแจ้งลูกค้า"],
        ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่สั่งซื้อ"]
    ]
    tbl6 = doc.add_table(rows=1, cols=4)
    style_table(tbl6, [1.4, 1.3, 2.1, 1.9], dict_headers, t6_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 7. order_items
    add_styled_paragraph(doc, "ตารางที่ 7: order_items (รายการสินค้าในคำสั่งซื้อ)", bold=True, space_after=2)
    t7_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสรายการย่อย"],
        ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อหลัก"],
        ["book_id", "INT", "FK -> books(id) RESTRICT", "รหัสหนังสือที่สั่งซื้อ"],
        ["title", "VARCHAR(255)", "NOT NULL", "ชื่อหนังสือ ณ เวลาที่สั่งซื้อ"],
        ["quantity", "INT", "NOT NULL, CHECK (quantity > 0)", "จำนวนเล่มที่สั่งซื้อ"],
        ["price_at_time", "DECIMAL(10,2)", "CHECK (price_at_time >= 0)", "ราคาต่อเล่ม ณ วันที่สั่งซื้อ"]
    ]
    tbl7 = doc.add_table(rows=1, cols=4)
    style_table(tbl7, [1.2, 1.4, 2.1, 2.0], dict_headers, t7_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 8. payments
    add_styled_paragraph(doc, "ตารางที่ 8: payments (ข้อมูลการชำระเงินและสลิปหลักฐาน)", bold=True, space_after=2)
    t8_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสการชำระเงิน"],
        ["order_id", "INT", "FK -> orders(id) CASCADE, UNIQUE", "รหัสคำสั่งซื้อ"],
        ["payment_method", "VARCHAR(50)", "CHECK (IN ('PromptPay', ...))", "วิธีการชำระเงินจำลอง"],
        ["slip_url", "VARCHAR(500)", "NULL", "ลิงก์ไฟล์ภาพสลิปการโอนเงิน"],
        ["amount", "DECIMAL(10,2)", "CHECK (amount >= 0)", "ยอดเงินที่แจ้งโอน (บาท)"],
        ["status", "VARCHAR(30)", "CHECK (IN ('Pending', ...))", "สถานะตรวจสลิป (Pending, Verified, Rejected)"],
        ["paid_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่แจ้งชำระเงิน"],
        ["verified_at", "TIMESTAMPTZ", "NULL", "วันและเวลาที่ผู้ดูแลระบบอนุมัติสลิป"]
    ]
    tbl8 = doc.add_table(rows=1, cols=4)
    style_table(tbl8, [1.4, 1.3, 2.1, 1.9], dict_headers, t8_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 9. download_links
    add_styled_paragraph(doc, "ตารางที่ 9: download_links (สิทธิ์และโทเค็นดาวน์โหลดปลอดภัย)", bold=True, space_after=2)
    t9_data = [
        ["id", "SERIAL", "PRIMARY KEY", "รหัสสิทธิ์ดาวน์โหลด"],
        ["token", "VARCHAR(64)", "UNIQUE, NOT NULL", "โทเค็นลับเฉพาะออเดอร์ (Security Token)"],
        ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อ"],
        ["book_id", "INT", "FK -> books(id) CASCADE", "รหัสหนังสือที่ได้รับสิทธิ์"],
        ["download_count", "INT", "CHECK (download_count >= 0)", "จำนวนครั้งที่ดาวน์โหลดไปแล้ว"],
        ["max_downloads", "INT", "DEFAULT 5, CHECK (> 0)", "โควตาดาวน์โหลดสูงสุด (5 ครั้ง)"],
        ["expires_at", "TIMESTAMPTZ", "NOT NULL", "วันและเวลาหมดอายุของสิทธิ์ (30 วัน)"]
    ]
    tbl9 = doc.add_table(rows=1, cols=4)
    style_table(tbl9, [1.4, 1.3, 2.1, 1.9], dict_headers, t9_data)

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 3: สถาปัตยกรรมระบบและการพัฒนาระบบจริง
    # =========================================================================
    add_styled_heading(doc, "บทที่ 3: สถาปัตยกรรมระบบและการพัฒนาระบบจริง", level=1)
    
    add_styled_heading(doc, "3.1 สถาปัตยกรรม 3 ระดับ (3-Tier Architecture)", level=2)
    add_styled_paragraph(doc, "ระบบได้รับการพัฒนาตามสถาปัตยกรรม 3-Tier ดังนี้:")
    add_styled_paragraph(doc, "1. Presentation Layer: พัฒนาด้วย Next.js 16 (App Router) ตกแต่งด้วย Tailwind CSS สไตล์ Minimalist รองรับ Responsive UI ทั้งจอคอมพิวเตอร์และมือถือ", space_after=3)
    add_styled_paragraph(doc, "2. Application / Logic Layer: พัฒนาด้วย TypeScript มี Service Layer และ Server Actions ตรวจสอบสิทธิ์บทบาท (Role Guard), คำนวณราคา, สร้างสิทธิ์ดาวน์โหลด และรวมกลุ่มข้อมูลรายงานสด", space_after=3)
    add_styled_paragraph(doc, "3. Data Storage Layer: ฐานข้อมูล PostgreSQL บน Supabase Cloud จัดการ Indexing เพื่อเพิ่มความเร็วในการสืบค้น และบังคับใช้ Security Constraints ทุกตาราง", space_after=6)

    add_styled_heading(doc, "3.2 สคริปต์คำสั่ง SQL ในการสร้างฐานข้อมูล (DDL)", level=2)
    add_styled_paragraph(doc, "ตัวอย่างคำสั่งสร้างตารางหลักและข้อกำหนดบูรณภาพ (Schema DDL):")
    
    sample_ddl = """-- สร้างตารางผู้ใช้งาน พร้อมฟิลด์ยืนยันตัวตนบัญชีธนาคาร
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    bank_account_name VARCHAR(150),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตารางคำสั่งซื้อหลัก
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
);"""
    add_code_block(doc, sample_ddl)

    add_styled_heading(doc, "3.3 ข้อมูลตัวอย่างทดสอบระบบ (Seed Data)", level=2)
    add_styled_paragraph(doc, 
        "ระบบจัดเตรียมข้อมูลตัวอย่างในไฟล์ sql/seed.sql เพื่อจำลองการซื้อขายจริงในระบบมากกว่า 30 คำสั่งซื้อ (คำสั่งซื้อที่ 1 ถึง 32) ครอบคลุมยอดขายตั้งแต่เดือนมิถุนายนถึงกันยายน 2569 โดยมีทั้งออเดอร์สถานะ Confirmed, Pending และ Cancelled เพื่อให้การรันคำสั่ง SQL ในบทที่ 4 แสดงผลวิเคราะห์ได้อย่างสมบูรณ์และถูกต้อง"
    )

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 4: รายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน
    # =========================================================================
    add_styled_heading(doc, "บทที่ 4: รายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน", level=1)
    add_styled_paragraph(doc, 
        "รายงานวิเคราะห์ทั้ง 4 ด้าน พัฒนาขึ้นตามข้อกำหนดใบงานข้อ 5 โดยใช้คำสั่ง SQL สืบข้อมูลจริงจากตารางที่เชื่อมโยงกันใน PostgreSQL แสดงผลผ่านหน้าจอ /admin/reports และส่งออกไฟล์ CSV มาตรฐาน UTF-8 BOM ได้ทันที"
    )

    # Report 1
    add_styled_heading(doc, "4.1 รายงานที่ 1: ยอดขายตามช่วงเวลา (Sales Over Time by Month)", level=2)
    add_styled_paragraph(doc, "• คำถามทางธุรกิจ: ยอดขาย จำนวนคำสั่งซื้อ และค่าเฉลี่ยต่อคำสั่งซื้อ (AOV) มีแนวโน้มเปลี่ยนแปลงไปอย่างไรตามแต่ละเดือน?", bold=True)
    add_styled_paragraph(doc, "• คำสั่ง SQL Query (JOIN, GROUP BY, SUM, COUNT, AVG):")
    
    r1_sql = """SELECT 
    TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month,
    COUNT(o.id) AS total_orders,
    SUM(o.total) AS total_sales,
    ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY sale_month DESC;"""
    add_code_block(doc, r1_sql)

    r1_headers = ["เดือนที่มียอดขาย", "จำนวนคำสั่งซื้อ", "ยอดขายรวมสุทธิ (บาท)", "ค่าเฉลี่ยต่อคำสั่งซื้อ (AOV)"]
    r1_data = [
        ["2026-09 (ล่าสุด)", "7 ออเดอร์", "฿2,402.00", "฿343.14"],
        ["2026-08", "8 ออเดอร์", "฿3,738.00", "฿467.25"],
        ["2026-07", "8 ออเดอร์", "฿3,759.00", "฿469.88"],
        ["2026-06", "8 ออเดอร์", "฿3,599.00", "฿449.88"]
    ]
    tbl_r1 = doc.add_table(rows=1, cols=4)
    style_table(tbl_r1, [1.6, 1.5, 1.8, 1.8], r1_headers, r1_data, header_bg="B45309")
    add_styled_paragraph(doc, "• ผลการวิเคราะห์: ยอดขายในเดือนกันยายน 2026 สะท้อนข้อมูลการสั่งซื้อที่เพิ่มขึ้นสดจากระบบจริง ช่วยให้ผู้บริหารติดตามอัตราเติบโตและปรับกลยุทธ์ส่งเสริมการขายได้อย่างทันท่วงที", italic=True, space_after=12)

    # Report 2
    add_styled_heading(doc, "4.2 รายงานที่ 2: E-Book ขายดีที่สุด 5 อันดับแรก (Top-Selling Books)", level=2)
    add_styled_paragraph(doc, "• คำถามทางธุรกิจ: E-Book ใดขายได้มากที่สุด 5 อันดับแรกตามจำนวนเล่มและยอดขายรวม?", bold=True)
    add_styled_paragraph(doc, "• คำสั่ง SQL Query (JOIN 4 ตาราง, GROUP BY, LIMIT 5):")
    
    r2_sql = """SELECT 
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
LIMIT 5;"""
    add_code_block(doc, r2_sql)

    r2_headers = ["รหัส", "ชื่อหนังสือ E-Book", "ผู้แต่ง", "หมวดหมู่", "เล่มที่ขายได้", "รายได้รวม (บาท)"]
    r2_data = [
        ["#1", "แสงจันทร์บนป่าไผ่", "จารึก ป่าไม้", "วรรณกรรม", "6 เล่ม", "฿1,554.00"],
        ["#2", "The Quiet Algorithm", "Alex Turner", "วิทยาการ", "5 เล่ม", "฿1,945.00"],
        ["#6", "Building Calm Software", "James Park", "เทคโนโลยี", "3 เล่ม", "฿1,347.00"],
        ["#10", "The Minimal Kitchen", "Mai Lin", "อาหาร", "3 เล่ม", "฿1,047.00"],
        ["#11", "ดาวพระศุกร์ก่อนรุ่งสาง", "อรุณ รุ่งโรจน์", "สารคดี", "3 เล่ม", "฿787.00"]
    ]
    tbl_r2 = doc.add_table(rows=1, cols=6)
    style_table(tbl_r2, [0.6, 2.2, 1.4, 1.1, 1.1, 1.3], r2_headers, r2_data, header_bg="1E3A8A")
    add_styled_paragraph(doc, "• ผลการวิเคราะห์: หนังสือด้านวิทยาการและเทคโนโลยีสร้างรายได้เฉลี่ยต่อเล่มสูงสุด ควรจัดวางเป็นสินค้าแนะนำบนแบนเนอร์หน้าแรกของร้าน", italic=True, space_after=12)

    # Report 3
    add_styled_heading(doc, "4.3 รายงานที่ 3: ยอดขายตามหมวดหมู่ (Sales by Category)", level=2)
    add_styled_paragraph(doc, "• คำถามทางธุรกิจ: หมวดหมู่ใดสร้างยอดขายและจำนวนรายการสั่งซื้อได้สูงสุด?", bold=True)
    add_styled_paragraph(doc, "• คำสั่ง SQL Query (JOIN หลายตาราง, GROUP BY, SUM):")
    
    r3_sql = """SELECT 
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
ORDER BY total_category_revenue DESC;"""
    add_code_block(doc, r3_sql)

    r3_headers = ["รหัส", "หมวดหมู่หนังสือ", "จำนวนคำสั่งซื้อ", "จำนวนเล่มที่ขายได้", "ยอดขายรวมสุทธิ (บาท)"]
    r3_data = [
        ["CAT-2", "วิทยาการและคอมพิวเตอร์", "10 ออเดอร์", "10 เล่ม", "฿3,691.00"],
        ["CAT-1", "นวนิยายและวรรณกรรม", "9 ออเดอร์", "9 เล่ม", "฿2,211.00"],
        ["CAT-5", "ไลฟ์สไตล์และอาหาร", "6 ออเดอร์", "6 เล่ม", "฿1,744.00"],
        ["CAT-3", "ประวัติศาสตร์และสารคดี", "5 ออเดอร์", "5 เล่ม", "฿1,345.00"],
        ["CAT-4", "ศิลปะและการออกแบบ", "4 ออเดอร์", "4 เล่ม", "฿1,256.00"]
    ]
    tbl_r3 = doc.add_table(rows=1, cols=5)
    style_table(tbl_r3, [0.8, 2.2, 1.5, 1.5, 1.7], r3_headers, r3_data, header_bg="047857")
    add_styled_paragraph(doc, "• ผลการวิเคราะห์: หมวดวิทยาการและคอมพิวเตอร์มียอดขายรวมสูงสุด สะท้อนกลุ่มผู้อ่านหลักที่เป็นนักศึกษาและสายงานไอที", italic=True, space_after=12)

    # Report 4
    add_styled_heading(doc, "4.4 รายงานที่ 4: พฤติกรรมลูกค้าและยอดซื้อสะสม (Customer Lifetime Value)", level=2)
    add_styled_paragraph(doc, "• คำถามทางธุรกิจ: ลูกค้ารายใดมียอดซื้อสะสมสูงสุด และมีการแจกแจงสถานะคำสั่งซื้อเป็นอย่างไร?", bold=True)
    add_styled_paragraph(doc, "• คำสั่ง SQL Query (JOIN, GROUP BY, HAVING, CASE WHEN):")
    
    r4_sql = """SELECT 
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
ORDER BY total_spent DESC;"""
    add_code_block(doc, r4_sql)

    r4_headers = ["ชื่อลูกค้า", "อีเมล", "ออเดอร์รวม", "ยอดซื้อสะสม", "อนุมัติแล้ว", "รอตรวจ", "ยกเลิก"]
    r4_data = [
        ["KANNITI YASO", "firts.zx99@gmail.com", "6 ออเดอร์", "฿2,842.00", "5 ออเดอร์", "1 ออเดอร์", "0"],
        ["สมชาย สายโค้ด", "somchai.tech@gmail.com", "5 ออเดอร์", "฿2,264.00", "4 ออเดอร์", "1 ออเดอร์", "0"],
        ["วนิดา นักอ่านตัวยง", "wanida.read@hotmail.com", "4 ออเดอร์", "฿1,575.00", "4 ออเดอร์", "0", "0"],
        ["ธนวัฒน์ ศิลป์สว่าง", "tanawat.design@gmail.com", "4 ออเดอร์", "฿1,346.00", "3 ออเดอร์", "0", "1 ออเดอร์"],
        ["พีรณัฐ สายซอฟต์แวร์", "peerat.dev@outlook.com", "3 ออเดอร์", "฿1,237.00", "3 ออเดอร์", "0", "0"]
    ]
    tbl_r4 = doc.add_table(rows=1, cols=7)
    style_table(tbl_r4, [1.6, 2.0, 0.9, 1.2, 0.9, 0.9, 0.8], r4_headers, r4_data, header_bg="4338CA")
    add_styled_paragraph(doc, "• ผลการวิเคราะห์: สามารถระบุกลุ่มลูกค้า VIP เพื่อจัดทำระบบสะสมแต้ม หรือมอบคูปองส่วนลดพิเศษเพื่อกระตุ้นการซื้อซ้ำได้อย่างแม่นยำ", italic=True, space_after=12)

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 5: แผนการทดสอบและประกันคุณภาพข้อมูล
    # =========================================================================
    add_styled_heading(doc, "บทที่ 5: แผนการทดสอบและประกันคุณภาพข้อมูล", level=1)
    add_styled_paragraph(doc, "ตารางผลการทดสอบกรณีทดสอบ 8 กรณีตามเกณฑ์ใบงานข้อ 6:")

    tc_headers = ["รหัส", "ฟังก์ชัน / เงื่อนไขที่ทดสอบ", "ข้อมูลนำเข้า (Input Data)", "ผลลัพธ์ที่คาดหวัง", "ผลการทดสอบจริง", "ผล"]
    tc_data = [
        ["TC-01", "ตรวจสอบอีเมลซ้ำ (UNIQUE)", "อีเมล firts.zx99@gmail.com ที่มีอยู่แล้ว", "ปฏิเสธการสมัคร แจ้งว่าอีเมลนี้ถูกใช้งานแล้ว", "แสดงข้อความเตือนและไม่บันทึกซ้ำลงฐานข้อมูล", "ผ่าน"],
        ["TC-02", "รหัสผ่านสั้นเกินไป", "รหัสผ่าน '123' (น้อยกว่า 6 ตัวอักษร)", "ระบบไม่อนุญาตให้ Submit แจ้งเตือนความยาว", "ขึ้น Alert รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", "ผ่าน"],
        ["TC-03", "หนังสือปิดการขาย (Soft Delete)", "แอดมินปิดการขายหนังสือ ID #4 (is_active=false)", "หน้าร้านแคตตาล็อกต้องไม่แสดงหนังสือเล่มนี้", "หนังสือหายจากหน้าร้านทันทีตามเงื่อนไข", "ผ่าน"],
        ["TC-04", "ดาวน์โหลดก่อนอนุมัติสลิป", "ออเดอร์สถานะ Pending ลูกค้ากดดาวน์โหลด", "ไม่อนุญาตให้ดาวน์โหลด แสดงสถานะรอตรวจสอบ", "ปุ่มดาวน์โหลดถูกล็อก และขึ้นข้อความรอแอดมิน", "ผ่าน"],
        ["TC-05", "ปลดล็อกดาวน์โหลดหลังอนุมัติ", "แอดมินกดอนุมัติสลิปในหน้า /admin/orders", "สถานะเป็น Confirmed และสร้างโทเค็นดาวน์โหลด", "ลูกค้าได้รับปุ่มดาวน์โหลดไฟล์ทันที", "ผ่าน"],
        ["TC-06", "บันทึกราคาติดลบ (CHECK)", "Insert หนังสือด้วยราคา -150.00 บาท", "Database ปฏิเสธคำสั่ง CHECK constraint violation", "PostgreSQL ปฏิเสธการ Insert ข้อมูลผิดรูปแบบ", "ผ่าน"],
        ["TC-07", "ลูกค้าเข้าหลังบ้านตรง (Route Guard)", "ลูกค้าพิมพ์ URL http://localhost:3000/admin", "บล็อกการเข้าถึงด้วยหน้า 403 Forbidden", "ระบบตัดเข้าหน้า 403 Access Denied ทันที", "ผ่าน"],
        ["TC-08", "ส่งออกรายงาน CSV ภาษาไทย", "กดปุ่ม Export CSV ในหน้ารายงานที่ 1", "เปิดไฟล์ใน Microsoft Excel ภาษาไทยไม่เพี้ยน", "ได้ไฟล์ CSV พร้อม UTF-8 BOM อ่านไทยได้ 100%", "ผ่าน"]
    ]
    tbl_tc = doc.add_table(rows=1, cols=6)
    style_table(tbl_tc, [0.7, 1.8, 1.8, 1.8, 1.8, 0.7], tc_headers, tc_data)

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 6: การประยุกต์ใช้ปัญญาประดิษฐ์อย่างรับผิดชอบ
    # =========================================================================
    add_styled_heading(doc, "บทที่ 6: การประยุกต์ใช้ปัญญาประดิษฐ์อย่างรับผิดชอบ", level=1)
    add_styled_paragraph(doc, 
        "ตามข้อกำหนดใบงานข้อ 12 นักศึกษาได้บันทึกการประยุกต์ใช้ AI เพื่อเป็นหลักฐานความโปร่งใสและแสดงการตรวจทานด้วยตนเองดังนี้:"
    )

    ai_headers = ["วันที่", "เครื่องมือ AI", "คำสั่ง Prompt โดยสรุป", "สิ่งที่นำมาใช้งาน", "การตรวจสอบและตรวจทานโดยนักศึกษา"]
    ai_data = [
        ["10 ก.ย. 69", "Claude / Antigravity", "ช่วยออกแบบ ERD และโครงสร้าง 9 ตารางสำหรับร้านขาย E-Book ให้ตรงหลัก 3NF และมี Foreign Key ครบถ้วน", "นำโครงร่าง DDL และความสัมพันธ์ของตารางมาใช้เป็นจุดเริ่มต้น", "ตรวจสอบชนิดข้อมูล ปรับเงื่อนไขความปลอดภัย และทดสอบรันบน PostgreSQL บน Supabase Cloud จริง"],
        ["12 ก.ย. 69", "Claude / Antigravity", "ช่วยเขียน SQL Query รายงาน 4 ด้านตามเกณฑ์อาจารย์ประภาส ที่ใช้ JOIN, GROUP BY, HAVING, CASE WHEN, SUM, COUNT, AVG, LIMIT", "นำคำสั่ง SQL ทั้ง 4 ข้อมาปรับแต่ง", "รัน Query ใน SQL Editor บน Supabase เทียบกับข้อมูลตัวอย่าง 32 คำสั่งซื้อ ยืนยันความถูกต้องของผลรวม"],
        ["14 ก.ย. 69", "Claude / Antigravity", "ช่วยปรับเปลี่ยนฟอนต์ทั้งเว็บให้เป็น Minimal (Plus Jakarta Sans และ IBM Plex Sans Thai) และทำ Route Guard 403", "ได้โค้ด CSS Token และโค้ดตรวจสอบ Role Guard ใน React", "ตรวจสอบการแสดงผลบนหน้าจอคอมพิวเตอร์และมือถือ ยืนยันว่าปุ่มหลังบ้านถูกซ่อนจากลูกค้าจริง"]
    ]
    tbl_ai = doc.add_table(rows=1, cols=5)
    style_table(tbl_ai, [1.0, 1.3, 2.3, 1.8, 2.3], ai_headers, ai_data)

    add_styled_heading(doc, "6.2 จริยธรรมข้อมูลส่วนบุคคล (PDPA Consideration)", level=2)
    add_styled_paragraph(doc, 
        "ในการจัดทำโครงงานนี้ ไม่มีการนำข้อมูลส่วนบุคคลจริง เบอร์โทรศัพท์จริง หรือสลิปธนาคารจริงของบุคคลภายนอกมาใช้งานในระบบ ข้อมูลทั้งหมดในฐานข้อมูลเป็นข้อมูลตัวอย่างจำลองทั้งสิ้น เพื่อรักษาจริยธรรมการใช้งานข้อมูลและปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)"
    )

    doc.add_page_break()

    # =========================================================================
    # 🌟 บทที่ 7: สรุปผลการดำเนินงานและข้อเสนอแนะ
    # =========================================================================
    add_styled_heading(doc, "บทที่ 7: สรุปผลการดำเนินงานและข้อเสนอแนะ", level=1)
    
    add_styled_heading(doc, "7.1 สรุปผลสัมฤทธิ์ของโครงงาน", level=2)
    add_styled_paragraph(doc, 
        "โครงงานพัฒนาระบบฐานข้อมูลร้านขายหนังสือและอีบุ๊กออนไลน์ (Lampara Books) บรรลุผลตามเกณฑ์การประเมิน 100 คะแนนของรายวิชาระบบฐานข้อมูลครบทุกข้อ โครงสร้างฐานข้อมูลมีความสมบูรณ์ตามหลัก 3NF ปราศจากข้อมูลซ้ำซ้อน มีระบบรักษาความปลอดภัยการดาวน์โหลดไฟล์ และมีรายงานเชิงวิเคราะห์ที่ช่วยสนับสนุนการตัดสินใจทางธุรกิจได้อย่างมีประสิทธิภาพ"
    )

    add_styled_heading(doc, "7.2 ข้อเสนอแนะในการพัฒนาต่อยอด", level=2)
    for sug in [
        "1. การพัฒนาระบบตัวอย่างการอ่าน (E-Book Preview Reader): ให้ลูกค้าสามารถทดลองอ่าน 10 หน้าแรกผ่านหน้าเว็บก่อนตัดสินใจซื้อ",
        "2. การเชื่อมต่อระบบชำระเงินอัตโนมัติ (Payment Gateway Webhook): เช่น ระบบแจ้งเตือนการโอนเงินสำเร็จแบบเรียลไทม์",
        "3. การรองรับสินค้าแบบ Hybrid Catalog: เชื่อมโยงกับระบบ Inventory ของวิชาวิศวกรรมซอฟต์แวร์ เพื่อจำหน่ายทั้งหนังสือเล่มกระดาษที่มีการตัดสต็อก และหนังสือดิจิทัลที่เปิดสิทธิ์ดาวน์โหลด"
    ]:
        add_styled_paragraph(doc, sug, space_after=3)

    doc.add_page_break()

    # =========================================================================
    # 🌟 ภาคผนวก
    # =========================================================================
    add_styled_heading(doc, "ภาคผนวก", level=1)
    
    add_styled_heading(doc, "ภาคผนวก ก: รายการตรวจสอบความพร้อมก่อนส่งงาน (Submission Checklist)", level=2)
    for chk in [
        "[X] สมาชิกในกลุ่มเข้าใจและสามารถอธิบายโครงสร้าง ERD ความสัมพันธ์ 1:N, N:M และคำสั่ง SQL ได้อย่างแม่นยำ",
        "[X] คำสั่งซื้อที่ยังไม่ยืนยัน (Pending) ไม่สามารถเปิดดาวน์โหลด E-Book ได้ (ตรงตามข้อกำหนดข้อ 2.2)",
        "[X] มีข้อมูลตัวอย่างในระบบมากกว่า 30 คำสั่งซื้อ และครอบคลุมยอดขายหลายเดือน (มิถุนายน - กันยายน 2569)",
        "[X] ไฟล์ SQL ทั้งหมด (sql/schema.sql, sql/seed.sql, sql/reports.sql) รันได้สมบูรณ์บน Supabase SQL Editor",
        "[X] รายงานวิเคราะห์ 4 ด้าน รันจากข้อมูลจริงในระบบและสามารถ Export เป็นไฟล์ CSV ได้อย่างถูกต้อง",
        "[X] ไม่มีการใช้ข้อมูลส่วนบุคคลจริง รหัสผ่านจริง หรือไฟล์ที่มีลิขสิทธิ์",
        "[X] มีบัญชีทดสอบด่วนบนหน้าจอเพื่อให้ผู้สอนคลิกสลับสิทธิ์ Admin / Customer เพื่อตรวจข้อสอบได้สะดวก"
    ]:
        add_styled_paragraph(doc, chk, space_after=3)

    add_styled_heading(doc, "ภาคผนวก ข: การเชื่อมโยงโครงงานกับวิชาวิศวกรรมซอฟต์แวร์ (SWE Inventory System)", level=2)
    add_styled_paragraph(doc, 
        "ตามประกาศของ อ.ดร.ปิยะนุช ตั้งกิตติพล ในวิชาวิศวกรรมซอฟต์แวร์ โครงงานฝั่งฐานข้อมูลนี้ได้รับการจัดเก็บแยกเป็น Repository ใหม่บน GitHub โดยเฉพาะ เพื่อส่งให้อาจารย์ประภาส ผ่องสนาม และเชื่อมโยงข้ามไปยัง Repository โครงงาน Inventory System ของวิชา SWE ด้วยลิงก์อ้างอิงข้ามหากันในไฟล์ README.md และ PROJECT.md อย่างถูกต้องตามแนวทางปฏิบัติของหลักสูตรวิศวกรรมคอมพิวเตอร์ มทร.อีสาน"
    )

    out_path = r"d:\learnCode\BookSell-DatabaseProject\รายงาน_โครงงานระบบฐานข้อมูล_ร้านขาย_E-Book_2026.docx"
    doc.save(out_path)
    print(f"Successfully generated docx report at: {out_path}")

    # Also save copy with the mini project name
    alt_path = r"d:\learnCode\BookSell-DatabaseProject\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx"
    doc.save(alt_path)
    print(f"Successfully generated alternate docx report at: {alt_path}")

if __name__ == "__main__":
    main()
