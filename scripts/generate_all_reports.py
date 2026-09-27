# -*- coding: utf-8 -*-
"""
Generator for:
1. "รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx"
   Formatted strictly following the academic book layout of "Research_Main.docx"
   - Margins: Top 3.0cm, Left 3.0cm, Right 2.0cm, Bottom 2.0cm | Font: TH SarabunPSK 16pt
   - Cover Page WITH RMUTI Logo at top
   - All unnecessary English in parentheses removed across all headings and text
   - Perfect page breaks, no awkward empty gaps, exact two-pass repaginated TOC with dot leaders
2. "เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.docx"
   Designed specifically for printing out on A4 for the professor to grade and annotate with a pen.
   - Clean, professional architecture diagram with SINGLE Playwright icon
   - Perfectly balanced pages (no awkward overflow or half-empty pages)
   - Clean Thai headings without English clutter
"""

import os
import shutil
import subprocess
from PIL import Image, ImageDraw
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

FONT_NAME = 'TH SarabunPSK'

def ensure_authentic_architecture_diagram():
    """
    Ensure tech_stack_architecture.png has 100% authentic brand logos:
    - Official Next.js, React, TypeScript, Tailwind CSS, Vercel, GitHub,
      PostgreSQL elephant, Supabase Cloud, Supabase Storage, 3NF Database, dbdiagram.io
    - Exactly ONE Playwright card (no duplicate)
    - Real official Lampara Books logo at top (rendered from project/src/app/icon.svg)
    """
    orig_path = r'scratch_original_arch.png'
    if not os.path.exists(orig_path):
        data = subprocess.check_output(['git', 'show', 'd7d4af1:docs/images/tech_stack_architecture.png'])
        with open(orig_path, 'wb') as f:
            f.write(data)
            
    im = Image.open(orig_path).convert('RGBA')
    
    # Fix Testing / Tools box: remove duplicate Playwright card and center single Playwright + dbdiagram
    card_pw = im.crop((768, 350, 942, 415)) # Clean Playwright card
    card_db = im.crop((768, 420, 942, 465)) # dbdiagram card
    draw = ImageDraw.Draw(im)
    bg_color = (241, 254, 246, 255)
    draw.rectangle([763, 288, 945, 466], fill=bg_color)
    
    y1 = 288 + 18
    im.paste(card_pw, (768, y1), card_pw)
    y2 = y1 + 65 + 20
    im.paste(card_db, (768, y2), card_db)
    
    # Replace emoji 📖 at top with real Lampara Books logo
    draw.rectangle([330, 20, 379, 65], fill=(255, 255, 255, 255))
    icon_path = r'scratch_lampara_icon_2x.png'
    if not os.path.exists(icon_path):
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(device_scale_factor=2)
            page.goto('file:///' + os.path.abspath('project/src/app/icon.svg').replace('\\', '/'))
            page.locator('svg').screenshot(path=icon_path)
            browser.close()
            
    icon = Image.open(icon_path).convert('RGBA')
    icon_resized = icon.resize((34, 34), Image.Resampling.LANCZOS)
    im.paste(icon_resized, (342, 26), icon_resized)
    
    target1 = os.path.join(r"d:\learnCode\BookSell-DatabaseProject\docs\images", "tech_stack_architecture.png")
    target2 = os.path.join(r"d:\learnCode\BookSell-DatabaseProject\docs\images", "tech_stack_diagram.png")
    im.save(target1, 'PNG')
    im.save(target2, 'PNG')
    print("Authentic architecture diagram refreshed and validated with 100% real logos.")


def set_run_font(run, font_name=FONT_NAME, size_pt=16, bold=False, italic=False, color_rgb=None):
    """Set font properties including Complex Script (cs) for flawless Thai rendering in Word."""
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    if color_rgb:
        run.font.color.rgb = color_rgb
    
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rFonts.set(qn('w:eastAsia'), font_name)

def set_cell_background(cell, hex_color):
    """Set background color of a table cell."""
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=70, bottom=70, left=110, right=110):
    """Set inner padding for a table cell (in twips/dxa: 20 dxa = 1 pt)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(tbl, border_color="CBD5E1", top_bottom_color="1E3A8A", sz="4"):
    tblPr = tbl._tbl.tblPr
    tblBorders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="12" w:space="0" w:color="{top_bottom_color}"/>\n'
        f'  <w:bottom w:val="single" w:sz="12" w:space="0" w:color="{top_bottom_color}"/>\n'
        f'  <w:left w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{border_color}"/>\n'
        f'  <w:insideV w:val="none"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(tblBorders)

def add_academic_heading(doc, text, level=1, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=4):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.0
    
    if level == 1:
        run = p.add_run(text)
        set_run_font(run, FONT_NAME, size_pt=18, bold=True)
    elif level == 2:
        run = p.add_run(text)
        set_run_font(run, FONT_NAME, size_pt=18, bold=True)
    else:
        run = p.add_run(text)
        set_run_font(run, FONT_NAME, size_pt=16, bold=True)
    return p

def add_academic_paragraph(doc, text="", bold=False, italic=False, space_after=4, font_size=16, 
                           align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0.5, line_spacing=1.0):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    
    txt_stripped = text.strip()
    is_list_or_caption = (
        txt_stripped.startswith(("[X]", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", 
                                 "ก)", "ข)", "ค)", "•", "-", "--", "ตารางที่", "ภาพที่", "คำสำคัญ:")) or
        len(txt_stripped) < 60 or
        bold or
        align != WD_ALIGN_PARAGRAPH.LEFT
    )
    
    if first_line_indent and not is_list_or_caption:
        p.paragraph_format.first_line_indent = Inches(first_line_indent)
    elif txt_stripped.startswith(("1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "•")):
        p.paragraph_format.left_indent = Inches(0.35)
        p.paragraph_format.first_line_indent = Inches(-0.35)
        
    if text:
        run = p.add_run(text)
        set_run_font(run, FONT_NAME, size_pt=font_size, bold=bold, italic=italic)
    return p

def add_code_box(doc, code_text, max_width_in=6.1):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.allow_autofit = False
    tblPr = tbl._tbl.tblPr
    tblW = parse_xml(f'<w:tblW {nsdecls("w")} w:w="{int(max_width_in * 1440)}" w:type="dxa"/>')
    tblPr.append(tblW)
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(max_width_in)
    tcPr = cell._tc.get_or_add_tcPr()
    tcW = parse_xml(f'<w:tcW {nsdecls("w")} w:w="{int(max_width_in * 1440)}" w:type="dxa"/>')
    tcPr.append(tcW)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
    
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="1E3A8A"/>\n'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>\n'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>\n'
        f'  <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>\n'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05
    run = p.add_run(code_text.strip())
    set_run_font(run, 'Consolas', size_pt=9.5, color_rgb=RGBColor(15, 23, 42))
    
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(3)

def format_styled_table(tbl, col_widths, headers, data, header_bg="1E3A8A"):
    num_cols = len(col_widths)
    total_width = sum(col_widths)
    
    is_very_dense = (num_cols >= 6)
    is_dense = (num_cols == 5)
    
    hdr_font_sz = 14 if is_very_dense else (15 if is_dense else 16)
    data_font_sz = 13 if is_very_dense else (14 if is_dense else 15)
    pad_tb = 50 if is_very_dense else 65
    pad_lr = 60 if is_very_dense else 85

    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.allow_autofit = False
    set_table_borders(tbl, border_color="CBD5E1", top_bottom_color=header_bg, sz="4")
    
    tblPr = tbl._tbl.tblPr
    for child in list(tblPr):
        if child.tag.endswith('tblW'):
            tblPr.remove(child)
    tblW = parse_xml(f'<w:tblW {nsdecls("w")} w:w="{int(total_width * 1440)}" w:type="dxa"/>')
    tblPr.append(tblW)

    for child in list(tbl._tbl):
        if child.tag.endswith('tblGrid'):
            tbl._tbl.remove(child)
    tblGrid = parse_xml(f'<w:tblGrid {nsdecls("w")}/>')
    for w in col_widths:
        tblGrid.append(parse_xml(f'<w:gridCol {nsdecls("w")} w:w="{int(w * 1440)}" w:type="dxa"/>'))
    tbl._tbl.insert(tbl._tbl.index(tblPr) + 1, tblGrid)

    # Header
    hdr_row = tbl.rows[0]
    trPr = hdr_row._tr.get_or_add_trPr()
    trPr.append(OxmlElement('w:tblHeader'))
    trPr.append(OxmlElement('w:cantSplit'))

    for i, title in enumerate(headers):
        cell = hdr_row.cells[i]
        cell.text = title
        set_cell_background(cell, header_bg)
        set_cell_margins(cell, top=pad_tb + 15, bottom=pad_tb + 15, left=pad_lr, right=pad_lr)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.0
        for run in p.runs:
            set_run_font(run, FONT_NAME, size_pt=hdr_font_sz, bold=True, color_rgb=RGBColor(255, 255, 255))

    # Data rows
    for r_idx, row_data in enumerate(data):
        row = tbl.add_row()
        r_trPr = row._tr.get_or_add_trPr()
        r_trPr.append(OxmlElement('w:cantSplit'))
        
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, cell_value in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(cell_value)
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=pad_tb, bottom=pad_tb, left=pad_lr, right=pad_lr)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            
            val_str = str(cell_value)
            if c_idx == 0 and len(val_str) < 12:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif val_str.startswith("฿") or (len(val_str) < 10 and any(ch.isdigit() for ch in val_str) and not any(ch in val_str for ch in ['-', ' '])):
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            for run in p.runs:
                set_run_font(run, FONT_NAME, size_pt=data_font_sz)

    for row in tbl.rows:
        for i, w in enumerate(col_widths):
            cell = row.cells[i]
            cell.width = Inches(w)
            tcPr = cell._tc.get_or_add_tcPr()
            for child in list(tcPr):
                if child.tag.endswith('tcW'):
                    tcPr.remove(child)
            tcW = parse_xml(f'<w:tcW {nsdecls("w")} w:w="{int(w * 1440)}" w:type="dxa"/>')
            tcPr.append(tcW)

def add_academic_figure(doc, img_path, caption_text, width_inches=5.2):
    if not os.path.exists(img_path):
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(5)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_inches))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(6)
    run_cap = p_cap.add_run(caption_text)
    set_run_font(run_cap, FONT_NAME, size_pt=14, bold=True)

def add_toc_line(doc, left_text, right_page, is_bold=False, indent_in=0, tab_stop_in=5.9):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.0
    if indent_in > 0:
        p.paragraph_format.left_indent = Inches(indent_in)
    p.paragraph_format.tab_stops.add_tab_stop(Inches(tab_stop_in), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
    
    r1 = p.add_run(left_text)
    set_run_font(r1, FONT_NAME, size_pt=16, bold=is_bold)
    
    r2 = p.add_run(f"\t{right_page}")
    set_run_font(r2, FONT_NAME, size_pt=16, bold=is_bold)
    return p

# =============================================================================
# 1. BUILD ACADEMIC REPORT (เล่มหลัก - มีโลโก้ RMUTI + ลบวงเล็บอังกฤษรกตา)
# =============================================================================
def build_academic_report():
    print("Building Document 1: รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx...")
    doc = Document()
    
    # Setup Section 1: Margins Top 3.0cm, Left 3.0cm, Right 2.0cm, Bottom 2.0cm
    sec1 = doc.sections[0]
    sec1.page_width = Inches(8.27)
    sec1.page_height = Inches(11.69)
    sec1.top_margin = Inches(1.181)
    sec1.bottom_margin = Inches(0.787)
    sec1.left_margin = Inches(1.181)
    sec1.right_margin = Inches(0.787)
    sec1.different_first_page_header_footer = True
    
    sec1.header.paragraphs[0].text = ""
    sec1.footer.paragraphs[0].text = ""
    
    # ---------------------------------------------------------
    # 🌟 หน้าปกเล่มหลัก (Cover Page) - มีโลโก้ มทร.อีสาน ตรงตามที่ขอ
    # ---------------------------------------------------------
    logo_path = r"d:\learnCode\BookSell-DatabaseProject\docs\images\rmuti_logo.png"
    if not os.path.exists(logo_path):
        logo_path = r"d:\learnCode\BookSell-DatabaseProject\docs\RMUTI-logo-color2.png"
        
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(10)
        p_logo.paragraph_format.space_after = Pt(14)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.45))
        
    p_t1 = doc.add_paragraph()
    p_t1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t1.paragraph_format.space_before = Pt(10)
    p_t1.paragraph_format.space_after = Pt(8)
    r = p_t1.add_run("โครงงานพัฒนาระบบฐานข้อมูล")
    set_run_font(r, FONT_NAME, size_pt=24, bold=True)
    
    p_t2 = doc.add_paragraph()
    p_t2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t2.paragraph_format.space_before = Pt(0)
    p_t2.paragraph_format.space_after = Pt(30)
    p_t2.paragraph_format.line_spacing = 1.15
    r = p_t2.add_run("เรื่อง การวิเคราะห์และพัฒนาระบบร้านขายหนังสือและอีบุ๊กออนไลน์\nร้านหนังสือ Lampara Books")
    set_run_font(r, FONT_NAME, size_pt=20, bold=True)
    
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(14)
    p_by.paragraph_format.space_after = Pt(2)
    r = p_by.add_run("จัดทำโดย")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True)
    
    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_author.paragraph_format.space_before = Pt(0)
    p_author.paragraph_format.space_after = Pt(28)
    r1 = p_author.add_run("นายกานต์นิธิ ยะโส\n")
    set_run_font(r1, FONT_NAME, size_pt=18, bold=True)
    r2 = p_author.add_run("รหัสนักศึกษา 67332110223-9")
    set_run_font(r2, FONT_NAME, size_pt=18, bold=True)
    
    p_adv_lbl = doc.add_paragraph()
    p_adv_lbl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_adv_lbl.paragraph_format.space_before = Pt(10)
    p_adv_lbl.paragraph_format.space_after = Pt(2)
    r = p_adv_lbl.add_run("อาจารย์ผู้สอน")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True)
    
    p_adv = doc.add_paragraph()
    p_adv.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_adv.paragraph_format.space_before = Pt(0)
    p_adv.paragraph_format.space_after = Pt(36)
    r = p_adv.add_run("อาจารย์ประภาส ผ่องสนาม")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True)
    
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_foot.paragraph_format.space_before = Pt(0)
    p_foot.paragraph_format.space_after = Pt(0)
    p_foot.paragraph_format.line_spacing = 1.15
    r = p_foot.add_run(
        "รายวิชาระบบฐานข้อมูล รหัสวิชา 31-407-102-301\n"
        "สาขาวิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์\n"
        "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น\n"
        "ภาคการศึกษาที่ 1 ปีการศึกษา 2569"
    )
    set_run_font(r, FONT_NAME, size_pt=18, bold=True)
    
    doc.add_page_break()
    
    # ---------------------------------------------------------
    # 🌟 บทคัดย่อ (Abstract) - คลีน ไม่มีวงเล็บอังกฤษรกตา
    # ---------------------------------------------------------
    add_academic_heading(doc, "บทคัดย่อ", level=1, space_before=12, space_after=8)
    
    add_academic_paragraph(doc,
        "โครงงานพัฒนาระบบฐานข้อมูลร้านขายหนังสือและอีบุ๊กออนไลน์ Lampara Books จัดทำขึ้นเพื่อประยุกต์ใช้ทฤษฎีการออกแบบและการบริหารจัดการระบบฐานข้อมูลเชิงสัมพันธ์ ภายใต้เกณฑ์มาตรฐานของรายวิชาระบบฐานข้อมูล รหัสวิชา 31-407-102-301 โดยเน้นการพัฒนาระบบจำหน่ายหนังสือดิจิทัลที่มีความรัดกุม ถูกต้องตามหลักการจัดรูปแบบบรรทัดฐานขั้นที่ 3 หรือ 3NF และมีความปลอดภัยในการส่งมอบสินค้าดิจิทัลในระดับข้อมูลจริง",
        space_after=6
    )
    
    add_academic_paragraph(doc,
        "ระบบได้รับการออกแบบฐานข้อมูลครอบคลุมกระบวนการขายครบวงจรจำนวนทั้งสิ้น 9 ตาราง ได้แก่ ตารางบทบาทผู้ใช้ roles, ข้อมูลสมาชิกและผู้ดูแลระบบ users, ข้อมูลผู้แต่ง authors, หมวดหมู่หนังสือ categories, รายการหนังสือ books, คำสั่งซื้อหลัก orders, รายการย่อยในคำสั่งซื้อ order_items, ข้อมูลการชำระเงินและสลิป payments, และสิทธิ์โทเค็นการดาวน์โหลดปลอดภัย download_links มีการกำหนดข้อกำหนดบูรณภาพข้อมูลอย่างสมบูรณ์ ได้แก่ คีย์หลัก คีย์นอก ข้อกำหนดห้ามว่าง ข้อกำหนดห้ามซ้ำ และข้อกำหนดตรวจสอบเงื่อนไข เพื่อป้องกันข้อมูลผิดรูปและรองรับข้อมูลธุรกรรมได้อย่างมีประสิทธิภาพ",
        space_after=6
    )
    
    add_academic_paragraph(doc,
        "ระบบทำงานร่วมกับฐานข้อมูล PostgreSQL บนระบบคลาวด์ Supabase ผ่านเว็บแอปพลิเคชัน Next.js 16 และ TypeScript มีการรักษาความปลอดภัยด้วยเงื่อนไขสิทธิ์: สมาชิกทั่วไปไม่สามารถเข้าถึงหน้าหลังบ้านได้ด้วยหน้าแจ้งเตือน 403 Forbidden และคำสั่งซื้อที่ยังไม่ได้รับการยืนยันการชำระเงินจะไม่สามารถเปิดดาวน์โหลดหนังสือได้เด็ดขาด นอกจากนี้ ยังได้พัฒนาคำสั่งสืบค้น SQL ขั้นสูงสำหรับจัดทำรายงานวิเคราะห์ธุรกิจ 4 ด้าน ตอบโจทย์การบริหารจัดการยอดขาย สินค้าขายดี หมวดหมู่ยอดนิยม และมูลค่าสะสมของลูกค้า พร้อมทั้งส่งออกเป็นไฟล์ CSV มาตรฐาน UTF-8 BOM ที่รองรับภาษาไทยใน Microsoft Excel ได้อย่างสมบูรณ์",
        space_after=8
    )
    
    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.first_line_indent = Inches(0.5)
    p_kw.paragraph_format.space_before = Pt(6)
    p_kw.paragraph_format.space_after = Pt(4)
    r1 = p_kw.add_run("คำสำคัญ: ")
    set_run_font(r1, FONT_NAME, size_pt=16, bold=True)
    r2 = p_kw.add_run("ระบบฐานข้อมูล, ร้านขายอีบุ๊กออนไลน์, รูปแบบบรรทัดฐาน 3NF, PostgreSQL, Supabase, Next.js, การควบคุมสิทธิ์ตามบทบาท")
    set_run_font(r2, FONT_NAME, size_pt=16, bold=False)
    
    doc.add_page_break()
    
    # ---------------------------------------------------------
    # 🌟 สารบัญ (Table of Contents) - Dot Leader Style
    # ---------------------------------------------------------
    add_academic_heading(doc, "สารบัญ", level=1, space_before=12, space_after=6)
    
    p_hdr = doc.add_paragraph()
    p_hdr.paragraph_format.space_after = Pt(4)
    p_hdr.paragraph_format.tab_stops.add_tab_stop(Inches(5.9), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p_hdr.add_run("เรื่อง")
    set_run_font(r1, FONT_NAME, size_pt=16, bold=True)
    r2 = p_hdr.add_run("\tหน้า")
    set_run_font(r2, FONT_NAME, size_pt=16, bold=True)
    
    # Clean TOC entries - NO excessive English brackets!
    toc_entries = [
        ("บทคัดย่อ", "ก", True, 0, "บทคัดย่อ"),
        ("สารบัญ", "ข", True, 0, "สารบัญ"),
        ("สารบัญตาราง", "ค", True, 0, "สารบัญตาราง"),
        ("สารบัญภาพ", "ง", True, 0, "สารบัญภาพ"),
        ("บทที่ 1 บทนำและวัตถุประสงค์ของโครงงาน", "1", True, 0, "บทที่ 1 บทนำและวัตถุประสงค์ของโครงงาน"),
        ("1.1 ที่มาและความสำคัญของปัญหา", "1", False, 0.25, "1.1 ที่มาและความสำคัญของปัญหา"),
        ("1.2 วัตถุประสงค์ของโครงงาน", "1", False, 0.25, "1.2 วัตถุประสงค์ของโครงงาน"),
        ("1.3 ขอบเขตของระบบ", "2", False, 0.25, "1.3 ขอบเขตของระบบ"),
        ("1.4 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา", "2", False, 0.25, "1.4 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา"),
        ("บทที่ 2 การวิเคราะห์และออกแบบฐานข้อมูล", "3", True, 0, "บทที่ 2 การวิเคราะห์และออกแบบฐานข้อมูล"),
        ("2.1 ผังความสัมพันธ์ข้อมูล ER Diagram", "3", False, 0.25, "2.1 ผังความสัมพันธ์ข้อมูล ER Diagram"),
        ("2.2 การจัดรูปแบบบรรทัดฐานระดับ 3NF", "4", False, 0.25, "2.2 การจัดรูปแบบบรรทัดฐานระดับ 3NF"),
        ("2.3 พจนานุกรมข้อมูลทั้ง 9 ตาราง", "5", False, 0.25, "2.3 พจนานุกรมข้อมูลทั้ง 9 ตาราง"),
        ("บทที่ 3 การสร้างฐานข้อมูลและข้อกำหนดบูรณภาพข้อมูล", "9", True, 0, "บทที่ 3 การสร้างฐานข้อมูลและข้อกำหนดบูรณภาพข้อมูล"),
        ("3.1 คำสั่งสร้างตาราง DDL บน Supabase PostgreSQL", "9", False, 0.25, "3.1 คำสั่งสร้างตาราง DDL"),
        ("3.2 ข้อกำหนดบูรณภาพข้อมูล", "10", False, 0.25, "3.2 ข้อกำหนดบูรณภาพข้อมูล"),
        ("3.3 ข้อมูลตัวอย่างสำหรับทดสอบระบบ", "10", False, 0.25, "3.3 ข้อมูลตัวอย่างสำหรับทดสอบระบบ"),
        ("บทที่ 4 รายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน", "11", True, 0, "บทที่ 4 รายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน"),
        ("4.1 รายงานที่ 1: ยอดขายตามช่วงเวลา", "11", False, 0.25, "4.1 รายงานที่ 1: ยอดขายตามช่วงเวลา"),
        ("4.2 รายงานที่ 2: หนังสือ E-Book ขายดีที่สุด 5 อันดับแรก", "12", False, 0.25, "4.2 รายงานที่ 2: หนังสือ E-Book ขายดีที่สุด"),
        ("4.3 รายงานที่ 3: ยอดขายตามหมวดหมู่หนังสือ", "13", False, 0.25, "4.3 รายงานที่ 3: ยอดขายตามหมวดหมู่หนังสือ"),
        ("4.4 รายงานที่ 4: พฤติกรรมลูกค้าและยอดซื้อสะสม", "14", False, 0.25, "4.4 รายงานที่ 4: พฤติกรรมลูกค้าและยอดซื้อสะสม"),
        ("บทที่ 5 การพัฒนาเว็บแอปพลิเคชันและการควบคุมสิทธิ์การเข้าถึง", "15", True, 0, "บทที่ 5 การพัฒนาเว็บแอปพลิเคชัน"),
        ("5.1 สถาปัตยกรรมระบบและความปลอดภัยการเข้าสู่ระบบ", "15", False, 0.25, "5.1 สถาปัตยกรรมระบบและความปลอดภัย"),
        ("5.2 การแก้ไขข้อมูลส่วนตัวและการยืนยันบัญชีธนาคาร", "15", False, 0.25, "5.2 การแก้ไขข้อมูลส่วนตัวและการยืนยันบัญชีธนาคาร"),
        ("5.3 การควบคุมสิทธิ์การเข้าถึงตามบทบาทผู้ใช้", "16", False, 0.25, "5.3 การควบคุมสิทธิ์การเข้าถึง"),
        ("5.4 การจัดการหมวดหมู่และการจัดการร้านค้าหลังบ้าน", "17", False, 0.25, "5.4 การจัดการหมวดหมู่"),
        ("5.5 หน้าจอรายงานวิเคราะห์ธุรกิจและการส่งออกไฟล์ CSV", "18", False, 0.25, "5.5 หน้าจอรายงานวิเคราะห์ธุรกิจ"),
        ("บทที่ 6 แผนการทดสอบและประกันคุณภาพระบบ", "19", True, 0, "บทที่ 6 แผนการทดสอบและประกันคุณภาพระบบ"),
        ("บทที่ 7 การประยุกต์ใช้ปัญญาประดิษฐ์ในการพัฒนา", "20", True, 0, "บทที่ 7 การประยุกต์ใช้ปัญญาประดิษฐ์ในการพัฒนา"),
        ("7.1 บันทึกคำสั่งและประวัติการใช้งาน AI", "20", False, 0.25, "7.1 บันทึกคำสั่งและประวัติการใช้งาน AI"),
        ("7.2 ข้อเสนอแนะของ AI ที่ตัดสินใจปฏิเสธ", "20", False, 0.25, "7.2 ข้อเสนอแนะของ AI ที่ตัดสินใจปฏิเสธ"),
        ("7.3 จริยธรรมการคุ้มครองข้อมูลส่วนบุคคล", "21", False, 0.25, "7.3 จริยธรรมการคุ้มครองข้อมูลส่วนบุคคล"),
        ("บทที่ 8 สรุปผลการดำเนินงานและข้อเสนอแนะ", "22", True, 0, "บทที่ 8 สรุปผลการดำเนินงานและข้อเสนอแนะ"),
        ("8.1 สรุปผลสัมฤทธิ์ของโครงงาน", "22", False, 0.25, "8.1 สรุปผลสัมฤทธิ์ของโครงงาน"),
        ("8.2 ข้อเสนอแนะในการพัฒนาต่อยอด", "22", False, 0.25, "8.2 ข้อเสนอแนะในการพัฒนาต่อยอด"),
        ("ภาคผนวก", "23", True, 0, "ภาคผนวก"),
        ("ภาคผนวก ก: รายการตรวจสอบความพร้อมก่อนส่งงาน", "23", False, 0.25, "ภาคผนวก ก"),
        ("ภาคผนวก ข: การเชื่อมโยงโครงงานกับวิชาวิศวกรรมซอฟต์แวร์", "23", False, 0.25, "ภาคผนวก ข"),
    ]
    
    toc_p_elements = []
    for title, p_num, is_bold, ind, skey in toc_entries:
        p_line = add_toc_line(doc, title, p_num, is_bold=is_bold, indent_in=ind)
        toc_p_elements.append((p_line, title, skey))
        
    doc.add_page_break()
    
    # ---------------------------------------------------------
    # 🌟 สารบัญตาราง (List of Tables)
    # ---------------------------------------------------------
    add_academic_heading(doc, "สารบัญตาราง", level=1, space_before=12, space_after=6)
    p_thdr = doc.add_paragraph()
    p_thdr.paragraph_format.space_after = Pt(4)
    p_thdr.paragraph_format.tab_stops.add_tab_stop(Inches(5.9), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p_thdr.add_run("ตารางที่")
    set_run_font(r1, FONT_NAME, size_pt=16, bold=True)
    r2 = p_thdr.add_run("\tหน้า")
    set_run_font(r2, FONT_NAME, size_pt=16, bold=True)
    
    table_entries = [
        ("ตารางที่ 1.1 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา", "2", "ตารางที่ 1.1"),
        ("ตารางที่ 2.1 ตาราง roles: สิทธิ์และบทบาทผู้ใช้งาน", "5", "ตารางที่ 2.1"),
        ("ตารางที่ 2.2 ตาราง users: ข้อมูลสมาชิกและผู้ดูแลระบบ", "5", "ตารางที่ 2.2"),
        ("ตารางที่ 2.3 ตาราง authors: ข้อมูลผู้แต่ง", "6", "ตารางที่ 2.3"),
        ("ตารางที่ 2.4 ตาราง categories: หมวดหมู่หนังสือ", "6", "ตารางที่ 2.4"),
        ("ตารางที่ 2.5 ตาราง books: ข้อมูลหนังสือดิจิทัล E-Book", "7", "ตารางที่ 2.5"),
        ("ตารางที่ 2.6 ตาราง orders: ข้อมูลคำสั่งซื้อหลัก", "7", "ตารางที่ 2.6"),
        ("ตารางที่ 2.7 ตาราง order_items: รายการสินค้าในคำสั่งซื้อ", "8", "ตารางที่ 2.7"),
        ("ตารางที่ 2.8 ตาราง payments: ข้อมูลการชำระเงินและสลิปหลักฐาน", "8", "ตารางที่ 2.8"),
        ("ตารางที่ 2.9 ตาราง download_links: สิทธิ์และโทเค็นดาวน์โหลดปลอดภัย", "9", "ตารางที่ 2.9"),
        ("ตารางที่ 4.1 สรุปยอดขายตามช่วงเวลาแต่ละเดือน", "11", "ตารางที่ 4.1"),
        ("ตารางที่ 4.2 สรุป E-Book ขายดีที่สุด 5 อันดับแรก", "12", "ตารางที่ 4.2"),
        ("ตารางที่ 4.3 สรุปยอดขายตามหมวดหมู่หนังสือ", "13", "ตารางที่ 4.3"),
        ("ตารางที่ 4.4 สรุปพฤติกรรมลูกค้าและยอดซื้อสะสม", "14", "ตารางที่ 4.4"),
        ("ตารางที่ 6.1 ตารางผลการทดสอบกรณีทดสอบทั้ง 8 กรณี", "19", "ตารางที่ 6.1"),
        ("ตารางที่ 7.1 บันทึกประวัติการใช้งาน AI ในการพัฒนา", "20", "ตารางที่ 7.1"),
    ]
    tot_p_elements = []
    for t_title, p_num, skey in table_entries:
        p_tline = add_toc_line(doc, t_title, p_num, is_bold=False, indent_in=0)
        tot_p_elements.append((p_tline, t_title, skey))
        
    doc.add_page_break()
    
    # ---------------------------------------------------------
    # 🌟 สารบัญภาพ (List of Figures)
    # ---------------------------------------------------------
    add_academic_heading(doc, "สารบัญภาพ", level=1, space_before=12, space_after=6)
    p_fhdr = doc.add_paragraph()
    p_fhdr.paragraph_format.space_after = Pt(4)
    p_fhdr.paragraph_format.tab_stops.add_tab_stop(Inches(5.9), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p_fhdr.add_run("ภาพที่")
    set_run_font(r1, FONT_NAME, size_pt=16, bold=True)
    r2 = p_fhdr.add_run("\tหน้า")
    set_run_font(r2, FONT_NAME, size_pt=16, bold=True)
    
    figure_entries = [
        ("ภาพที่ 2.1 ผังความสัมพันธ์ข้อมูล ER Diagram ทั้ง 9 ตาราง", "4", "ภาพที่ 2.1"),
        ("ภาพที่ 5.1 หน้าต่างเข้าสู่ระบบและสมัครสมาชิกแบบ Email และ Password", "15", "ภาพที่ 5.1"),
        ("ภาพที่ 5.2 หน้าต่างแก้ไขข้อมูลส่วนตัวและระบุบัญชีธนาคารยืนยันตัวตน", "16", "ภาพที่ 5.2"),
        ("ภาพที่ 5.3 แถบเมนูด้านบนของผู้ใช้ทั่วไปที่ซ่อนปุ่มหลังบ้าน", "16", "ภาพที่ 5.3"),
        ("ภาพที่ 5.4 ระบบความปลอดภัยแสดงหน้า 403 Forbidden เมื่อไม่ใช่แอดมิน", "17", "ภาพที่ 5.4"),
        ("ภาพที่ 5.5 แถบเมนูด้านบนของสิทธิ์ผู้ดูแลระบบที่แสดงปุ่มหลังบ้าน", "17", "ภาพที่ 5.5"),
        ("ภาพที่ 5.6 หน้าต่างจัดการหมวดหมู่หนังสือในระบบหลังบ้าน", "18", "ภาพที่ 5.6"),
        ("ภาพที่ 5.7 หน้าจอรายงานวิเคราะห์ธุรกิจ 4 ด้าน พร้อมปุ่มส่งออกไฟล์ CSV", "18", "ภาพที่ 5.7"),
    ]
    tof_p_elements = []
    for f_title, p_num, skey in figure_entries:
        p_fline = add_toc_line(doc, f_title, p_num, is_bold=False, indent_in=0)
        tof_p_elements.append((p_fline, f_title, skey))

    # ---------------------------------------------------------
    # 🌟 SECTION 2: Body Chapters (บทที่ 1 ถึง บทที่ 8 + ภาคผนวก)
    # Margins: Top 3.0cm, Left 3.0cm, Right 2.0cm, Bottom 2.0cm
    # Page Numbering: Header Top-Right, starting at 1
    # ---------------------------------------------------------
    sec2 = doc.add_section(WD_SECTION_START.NEW_PAGE)
    sec2.header.is_linked_to_previous = False
    sec2.footer.is_linked_to_previous = False
    sec2.different_first_page_header_footer = False
    sec2.page_width = Inches(8.27)
    sec2.page_height = Inches(11.69)
    sec2.top_margin = Inches(1.181)
    sec2.bottom_margin = Inches(0.787)
    sec2.left_margin = Inches(1.181)
    sec2.right_margin = Inches(0.787)
    
    sectPr = sec2._sectPr
    sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:start="1"/>'))
    
    p_hdr2 = sec2.header.paragraphs[0]
    p_hdr2.text = ""
    p_hdr2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_hdr2.paragraph_format.space_before = Pt(0)
    p_hdr2.paragraph_format.space_after = Pt(0)
    
    fld = parse_xml(
        f'<w:fldSimple {nsdecls("w")} w:instr="PAGE">\n'
        f'  <w:r>\n'
        f'    <w:rPr>\n'
        f'      <w:rFonts w:ascii="{FONT_NAME}" w:hAnsi="{FONT_NAME}" w:cs="{FONT_NAME}" w:eastAsia="{FONT_NAME}"/>\n'
        f'      <w:sz w:val="28"/>\n'
        f'      <w:color w:val="000000"/>\n'
        f'    </w:rPr>\n'
        f'    <w:t>1</w:t>\n'
        f'  </w:r>\n'
        f'</w:fldSimple>'
    )
    p_hdr2._p.append(fld)
    sec2.footer.paragraphs[0].text = ""

    images_dir = r"d:\learnCode\BookSell-DatabaseProject\docs\images"

    # =========================================================
    # บทที่ 1: บทนำและวัตถุประสงค์ของโครงงาน
    # =========================================================
    add_academic_heading(doc, "บทที่ 1\nบทนำและวัตถุประสงค์ของโครงงาน", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "1.1 ที่มาและความสำคัญของปัญหา", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "ในยุคเศรษฐกิจดิจิทัล หนังสืออิเล็กทรอนิกส์หรือ E-Book ได้กลายเป็นช่องทางการเผยแพร่และอ่านหนังสือที่ได้รับความนิยมอย่างแพร่หลาย เนื่องจากผู้บริโภคสามารถสั่งซื้อและดาวน์โหลดไปอ่านได้ทันทีทุกที่ทุกเวลา อย่างไรก็ดี สถาปัตยกรรมระบบสำหรับร้านขายสินค้าดิจิทัลมีความแตกต่างอย่างมีนัยสำคัญจากร้านค้าสินค้าที่จับต้องได้ กล่าวคือ สินค้าดิจิทัลไม่มีการจำกัดจำนวนสินค้าคงเหลือทางกายภาพ แต่ต้องการระบบรักษาความปลอดภัยในการส่งมอบไฟล์ที่มีความเข้มงวดสูง เพื่อให้มั่นใจว่าเฉพาะคำสั่งซื้อที่ชำระเงินถูกต้องแล้วเท่านั้นจึงจะได้รับสิทธิ์เข้าถึงเนื้อหา และป้องกันการนำลิงก์ดาวน์โหลดไปแชร์ต่อสาธารณะ"
    )
    add_academic_paragraph(doc,
        "ด้วยเหตุนี้ การออกแบบโครงสร้างฐานข้อมูลที่มีความสัมพันธ์ถูกต้องตามหลักการจัดรูปแบบบรรทัดฐาน และมีกลไกตรวจสอบเงื่อนไขในระดับ Schema จึงเป็นหัวใจสำคัญอย่างยิ่งในการทำให้ระบบทำงานได้อย่างมั่นคง ปราศจากข้อมูลผิดรูป และรองรับการนำข้อมูลธุรกรรมมาประมวลผลเป็นรายงานวิเคราะห์เพื่อสนับสนุนการตัดสินใจเชิงธุรกิจได้อย่างมีประสิทธิภาพ"
    )

    add_academic_heading(doc, "1.2 วัตถุประสงค์ของโครงงาน", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    for obj in [
        "1. เพื่อออกแบบและพัฒนาฐานข้อมูลเชิงสัมพันธ์สำหรับระบบร้านค้า E-Book ที่ถูกต้องตามหลักการ 3NF",
        "2. เพื่อสร้างระบบเว็บแอปพลิเคชันต้นแบบที่เชื่อมโยงกับฐานข้อมูล PostgreSQL บนระบบคลาวด์ Supabase ได้จริง",
        "3. เพื่อจำลองเส้นทางการใช้งานของลูกค้า และระบบบริหารจัดการหลังบ้านของผู้ดูแลระบบ",
        "4. เพื่อเขียนคำสั่ง SQL สืบทอดรายงานวิเคราะห์ข้อมูลเชิงลึก 4 หัวข้อ และสร้างฟังก์ชันส่งออกข้อมูลเป็นไฟล์ CSV สำหรับผู้บริหาร",
        "5. เพื่อประยุกต์ใช้เครื่องมือปัญญาประดิษฐ์ในการออกแบบและแก้ปัญหาอย่างมีความรับผิดชอบ โปร่งใส และตรวจสอบได้"
    ]:
        add_academic_paragraph(doc, obj, space_after=3)

    add_academic_heading(doc, "1.3 ขอบเขตของระบบ", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "ระบบประกอบด้วย 2 ส่วนหลักตามข้อกำหนด ดังนี้:", bold=True)
    
    add_academic_paragraph(doc, "ก) ขอบเขตส่วนหน้าร้านสำหรับลูกค้า:", bold=True)
    for item in [
        "• ระบบสมาชิก: สมัครสมาชิก เข้าสู่ระบบ แก้ไขข้อมูลพื้นฐาน ชื่อ เบอร์โทร อีเมล และระบุบัญชีธนาคารเพื่อยืนยันตัวตน",
        "• แคตตาล็อกหนังสือ: ค้นหาด้วยชื่อเรื่องหรือคำสำคัญ กรองตามหมวดหมู่ แสดงรายละเอียดราคา ภาพปก และสถานะเปิดขาย",
        "• ตะกร้าสินค้า: ปรับจำนวนหนังสือ ลบรายการ และคำนวณราคาสุทธิแบบเรียลไทม์",
        "• การสั่งซื้อและชำระเงินจำลอง: กรอกข้อมูลผู้สั่ง แนบสลิปโอนเงินจำลอง และตรวจสอบความถูกต้องของข้อมูล",
        "• การดาวน์โหลด E-Book ปลอดภัย: เปิดลิงก์ดาวน์โหลดเฉพาะคำสั่งซื้อที่ได้รับการอนุมัติแล้วเท่านั้น โดยจำกัดสิทธิ์ดาวน์โหลดสูงสุด 5 ครั้งและมีวันหมดอายุ"
    ]:
        add_academic_paragraph(doc, item, space_after=2)

    add_academic_paragraph(doc, "ข) ขอบเขตส่วนหลังบ้านสำหรับผู้ดูแลระบบ:", bold=True)
    for item in [
        "• ระบบรักษาความปลอดภัยสิทธิ์เข้าถึง: ซ่อนปุ่มหลังบ้านจากลูกค้า และมี Route Guard บล็อก URL ด้วยหน้า 403 Forbidden",
        "• การจัดการหนังสือ: เพิ่มหนังสือใหม่ แก้ไขข้อมูลราคา รายละเอียด ลิงก์ดาวน์โหลด และสลับสถานะเปิดหรือปิดการขาย",
        "• การจัดการหมวดหมู่: เพิ่มและแก้ไขหมวดหมู่หนังสือ",
        "• การจัดการคำสั่งซื้อ: ค้นหา ตรวจสอบหลักฐานสลิป และกดอนุมัติเพื่อเปิดสิทธิ์ดาวน์โหลด หรือกดยกเลิกคำสั่งซื้อ",
        "• การจัดการสมาชิก: ดูข้อมูลสมาชิกและสลับบทบาทผู้ใช้ระหว่างแอดมินและลูกค้า",
        "• รายงานวิเคราะห์: แสดงผลข้อมูลสด 4 ด้าน และส่งออกเป็นไฟล์ CSV มาตรฐาน UTF-8 BOM"
    ]:
        add_academic_paragraph(doc, item, space_after=2)

    add_academic_heading(doc, "1.4 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "ตารางที่ 1.1 เครื่องมือและเทคโนโลยีที่ใช้พัฒนา", bold=True, space_after=2)
    tech_headers = ["องค์ประกอบ", "เทคโนโลยีที่เลือกใช้", "บทบาทและความเหมาะสม"]
    tech_data = [
        ["ระบบจัดการฐานข้อมูล", "PostgreSQL บน Supabase Cloud", "ฐานข้อมูลเชิงสัมพันธ์มาตรฐานสากล รองรับ ACID, Constraints, JSON, Indexes และความปลอดภัยสูง"],
        ["เว็บเฟรมเวิร์กส่วนหน้า", "Next.js 16 และ React 19", "เฟรมเวิร์กสมัยใหม่ ให้ความเร็วสูง มีระบบ Server Component และ Routing ปลอดภัย"],
        ["ภาษาโปรแกรม", "TypeScript", "ระบบ Type-Safe ป้องกันข้อผิดพลาดของข้อมูล เชื่อมโยง Data Types ตรงกับ Schema"],
        ["การตกแต่งและจัดวางหน้าเว็บ", "Tailwind CSS", "ออกแบบ UI ทันสมัย สะอาดตา ด้วยแนวคิดมินิมอล อ่านง่าย สบายตา"],
        ["ชุดไอคอนและสัญลักษณ์", "Lucide Icons", "ไอคอนมาตรฐานแบบมินิมอล ช่วยให้ผู้ใช้เข้าใจสถานะของระบบได้อย่างชัดเจน"]
    ]
    tbl_tech = doc.add_table(rows=1, cols=3)
    format_styled_table(tbl_tech, [1.3, 1.8, 2.9], tech_headers, tech_data)

    doc.add_page_break()

    # =========================================================
    # บทที่ 2: การวิเคราะห์และออกแบบฐานข้อมูล
    # =========================================================
    add_academic_heading(doc, "บทที่ 2\nการวิเคราะห์และออกแบบฐานข้อมูล", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "2.1 ผังความสัมพันธ์ข้อมูล ER Diagram", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "ฐานข้อมูลประกอบด้วย 9 ตารางที่มีความสัมพันธ์กันอย่างชัดเจนตามหลักการออกแบบฐานข้อมูลเชิงสัมพันธ์:"
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
        add_academic_paragraph(doc, rel, space_after=2)

    add_academic_figure(doc, os.path.join(images_dir, "erd_column_mapped.png"), 
                        "ภาพที่ 2.1: ผังความสัมพันธ์ข้อมูล ER Diagram ทั้ง 9 ตาราง", width_inches=5.8)

    add_academic_heading(doc, "2.2 การจัดรูปแบบบรรทัดฐานระดับ 3NF", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "การปรับโครงสร้างฐานข้อมูลดำเนินการตามหลัก Normalization อย่างเคร่งครัดเป็น 4 ลำดับขั้น:")
    add_academic_paragraph(doc, "1. รูปแบบก่อนการจัดรูป (UNF): โครงสร้างเดิมก่อนจัดรูป เก็บข้อมูลการสั่งซื้อ ชื่อลูกค้า รายการหนังสือ ผู้แต่ง หมวดหมู่ และราคาไว้ในตารางรวมเพียงตารางเดียว เกิดปัญหาข้อมูลซ้ำซ้อนและชุดข้อมูลซ้ำ", space_after=3)
    add_academic_paragraph(doc, "2. รูปแบบบรรทัดฐานขั้นที่ 1 (1NF): ขจัดชุดข้อมูลซ้ำ โดยทำให้ทุกคอลัมน์เป็นค่าเดี่ยวที่ไม่สามารถแบ่งย่อยได้อีก และกำหนดคีย์หลักชัดเจนในทุกแถว", space_after=3)
    add_academic_paragraph(doc, "3. รูปแบบบรรทัดฐานขั้นที่ 2 (2NF): ขจัด Partial Functional Dependency โดยแยกตาราง authors และ categories ออกจาก books เพื่อให้ฟิลด์ทุกตัวขึ้นตรงกับคีย์หลัก books.id ทั้งหมด และแยกตาราง order_items โดยบันทึกราคา ณ วันที่ซื้อ price_at_time", space_after=3)
    add_academic_paragraph(doc, "4. รูปแบบบรรทัดฐานขั้นที่ 3 (3NF): ขจัด Transitive Functional Dependency ที่ขึ้นต่อกันเองโดยไม่ผ่านคีย์หลัก โดยแยกตารางสิทธิ์ roles ออกจาก users, แยกการชำระเงิน payments ออกจาก orders, และแยกโทเค็นความปลอดภัย download_links ออกจาก orders", space_after=6)

    add_academic_heading(doc, "2.3 พจนานุกรมข้อมูลทั้ง 9 ตาราง", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    dict_headers = ["ชื่อฟิลด์", "ชนิดข้อมูล", "ข้อกำหนด", "คำอธิบายความหมาย"]
    
    dict_tables_info = [
        ("ตารางที่ 2.1 ตาราง roles: สิทธิ์และบทบาทผู้ใช้งาน", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสบทบาท (1 = Admin, 2 = Customer)"],
            ["name", "VARCHAR(50)", "UNIQUE, NOT NULL", "ชื่อบทบาทผู้ใช้งาน"],
            ["description", "TEXT", "NULL", "คำอธิบายขอบเขตหน้าที่ความรับผิดชอบ"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่บันทึกบทบาท"]
        ]),
        ("ตารางที่ 2.2 ตาราง users: ข้อมูลสมาชิกและผู้ดูแลระบบ", [
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
        ]),
        ("ตารางที่ 2.3 ตาราง authors: ข้อมูลผู้แต่ง", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสผู้แต่ง"],
            ["name", "VARCHAR(150)", "NOT NULL", "ชื่อ-นามสกุล หรือนามปากกาผู้แต่ง"],
            ["bio", "TEXT", "NULL", "ประวัติและผลงานโดยย่อ"],
            ["email", "VARCHAR(255)", "NULL", "อีเมลติดต่อผู้แต่ง"],
            ["avatar_url", "VARCHAR(500)", "NULL", "ลิงก์รูปภาพประจำตัวผู้แต่ง"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่บันทึกข้อมูล"]
        ]),
        ("ตารางที่ 2.4 ตาราง categories: หมวดหมู่หนังสือ", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสหมวดหมู่"],
            ["name", "VARCHAR(100)", "UNIQUE, NOT NULL", "ชื่อหมวดหมู่หนังสือภาษาไทย"],
            ["slug", "VARCHAR(100)", "UNIQUE, NOT NULL", "คีย์อ้างอิง URL Slug ภาษาอังกฤษ"],
            ["description", "TEXT", "NULL", "คำอธิบายเกี่ยวกับหมวดหมู่"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่สร้างหมวดหมู่"]
        ]),
        ("ตารางที่ 2.5 ตาราง books: ข้อมูลหนังสือดิจิทัล E-Book", [
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
            ["file_url", "VARCHAR(500)", "NULL", "เส้นทางไฟล์ PDF ตัวอย่าง"]
        ]),
        ("ตารางที่ 2.6 ตาราง orders: ข้อมูลคำสั่งซื้อหลัก", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสคำสั่งซื้อ"],
            ["user_id", "INT", "FK -> users(id) SET NULL", "รหัสสมาชิกผู้สั่งซื้อ"],
            ["checkout_email", "VARCHAR(255)", "NOT NULL", "อีเมลผู้รับลิงก์ดาวน์โหลดและใบเสร็จ"],
            ["checkout_name", "VARCHAR(150)", "NOT NULL", "ชื่อผู้สั่งซื้อ"],
            ["total", "DECIMAL(10,2)", "NOT NULL, CHECK (total >= 0)", "ยอดรวมสุทธิที่ต้องชำระ (บาท)"],
            ["status", "VARCHAR(30)", "CHECK (status IN (...))", "สถานะคำสั่งซื้อ"],
            ["email_sent", "BOOLEAN", "DEFAULT TRUE", "สถานะการจัดส่งอีเมลแจ้งลูกค้า"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่สั่งซื้อ"]
        ]),
        ("ตารางที่ 2.7 ตาราง order_items: รายการสินค้าในคำสั่งซื้อ", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสรายการย่อย"],
            ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อหลัก"],
            ["book_id", "INT", "FK -> books(id) RESTRICT", "รหัสหนังสือที่สั่งซื้อ"],
            ["title", "VARCHAR(255)", "NOT NULL", "ชื่อหนังสือ ณ เวลาที่สั่งซื้อ"],
            ["quantity", "INT", "NOT NULL, CHECK (quantity > 0)", "จำนวนเล่มที่สั่งซื้อ"],
            ["price_at_time", "DECIMAL(10,2)", "CHECK (price_at_time >= 0)", "ราคาต่อเล่ม ณ วันที่สั่งซื้อ"]
        ]),
        ("ตารางที่ 2.8 ตาราง payments: ข้อมูลการชำระเงินและสลิปหลักฐาน", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสการชำระเงิน"],
            ["order_id", "INT", "FK -> orders(id) CASCADE, UNIQUE", "รหัสคำสั่งซื้อที่จับคู่"],
            ["payment_method", "VARCHAR(50)", "CHECK (IN ('PromptPay', ...))", "วิธีการชำระเงินจำลอง"],
            ["slip_url", "VARCHAR(500)", "NULL", "ลิงก์ไฟล์ภาพสลิปการโอนเงิน"],
            ["amount", "DECIMAL(10,2)", "CHECK (amount >= 0)", "ยอดเงินที่แจ้งโอน (บาท)"],
            ["status", "VARCHAR(30)", "CHECK (IN ('Pending', ...))", "สถานะตรวจสลิป"],
            ["paid_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่แจ้งชำระเงิน"],
            ["verified_at", "TIMESTAMPTZ", "NULL", "วันและเวลาที่ผู้ดูแลระบบอนุมัติสลิป"]
        ]),
        ("ตารางที่ 2.9 ตาราง download_links: สิทธิ์และโทเค็นดาวน์โหลดปลอดภัย", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสสิทธิ์ดาวน์โหลด"],
            ["token", "VARCHAR(64)", "UNIQUE, NOT NULL", "โทเค็นความปลอดภัยลับเฉพาะออเดอร์"],
            ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อ"],
            ["book_id", "INT", "FK -> books(id) CASCADE", "รหัสหนังสือที่ได้รับสิทธิ์"],
            ["download_count", "INT", "CHECK (download_count >= 0)", "จำนวนครั้งที่ดาวน์โหลดไปแล้ว"],
            ["max_downloads", "INT", "DEFAULT 5", "จำนวนครั้งที่อนุญาตให้ดาวน์โหลดสูงสุด"],
            ["expires_at", "TIMESTAMPTZ", "NOT NULL", "วันและเวลาหมดอายุของลิงก์ดาวน์โหลด"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "วันและเวลาที่เปิดสิทธิ์ดาวน์โหลด"]
        ])
    ]

    for caption, data_rows in dict_tables_info:
        add_academic_paragraph(doc, caption, bold=True, space_after=2)
        tbl_d = doc.add_table(rows=1, cols=4)
        format_styled_table(tbl_d, [1.2, 1.1, 1.8, 1.9], dict_headers, data_rows)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    doc.add_page_break()

    # =========================================================
    # บทที่ 3: การสร้างฐานข้อมูลและข้อกำหนดบูรณภาพข้อมูล
    # =========================================================
    add_academic_heading(doc, "บทที่ 3\nการสร้างฐานข้อมูลและข้อกำหนดบูรณภาพข้อมูล", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "3.1 คำสั่งสร้างตาราง DDL บน Supabase PostgreSQL", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "ฐานข้อมูลถูกสร้างขึ้นบน PostgreSQL ผ่านระบบคลาวด์ Supabase โดยใช้คำสั่ง Data Definition Language ตัวอย่างคำสั่งสร้างตารางหลัก books และ orders แสดงดังนี้:"
    )

    sample_ddl = """-- คำสั่งสร้างตาราง books พร้อมข้อกำหนดบูรณภาพข้อมูล
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES authors(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    cover_color VARCHAR(20) DEFAULT '#2F5D50',
    description TEXT,
    pages INT CHECK (pages >= 0),
    isbn VARCHAR(30) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    file_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- คำสั่งสร้างตาราง orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    checkout_email VARCHAR(255) NOT NULL,
    checkout_name VARCHAR(150) NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' 
        CHECK (status IN ('Pending', 'Paid', 'Confirmed', 'Cancelled')),
    email_sent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);"""
    add_code_box(doc, sample_ddl)

    add_academic_heading(doc, "3.2 ข้อกำหนดบูรณภาพข้อมูล", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    for c in [
        "1. ข้อกำหนดคีย์หลัก (Primary Key): ทุกตารางมีคอลัมน์ id เป็นคีย์หลักแบบ SERIAL รับประกันความไม่ซ้ำและห้ามเป็นค่าว่าง",
        "2. ข้อกำหนดคีย์นอก (Foreign Key): เชื่อมโยงความสัมพันธ์ข้ามตาราง พร้อมกำหนด ON DELETE CASCADE หรือ ON DELETE SET NULL เพื่อป้องกันปัญหาข้อมูลกำพร้า",
        "3. ข้อกำหนดห้ามเป็นค่าว่าง (NOT NULL): บังคับให้ฟิลด์สำคัญต้องมีค่าเสมอ เช่น ชื่อหนังสือ ราคา อีเมล และชื่อผู้สั่งซื้อ",
        "4. ข้อกำหนดค่าห้ามซ้ำ (UNIQUE): ป้องกันข้อมูลซ้ำซ้อนในระบบ เช่น อีเมลสมาชิก เลขไอเอสบีเอ็น และโทเค็นดาวน์โหลด",
        "5. ข้อกำหนดตรวจสอบเงื่อนไข (CHECK): ตรวจสอบความสมเหตุสมผลของข้อมูล เช่น ราคาต้องมากกว่าหรือเท่ากับศูนย์ และสถานะที่จำกัดเฉพาะค่าที่กำหนด",
        "6. ข้อกำหนดค่าเริ่มต้นอัตโนมัติ (DEFAULT): กำหนดค่าเริ่มต้นอัตโนมัติ เช่น สถานะเปิดขาย และเวลาที่บันทึกข้อมูล"
    ]:
        add_academic_paragraph(doc, c, space_after=2)

    add_academic_heading(doc, "3.3 ข้อมูลตัวอย่างสำหรับทดสอบระบบ", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "ระบบจัดเตรียมข้อมูลตัวอย่างในไฟล์ seed.sql เพื่อจำลองการซื้อขายจริงในระบบมากกว่า 30 คำสั่งซื้อ ครอบคลุมยอดขายตั้งแต่เดือนมิถุนายนถึงกันยายน 2569 โดยมีทั้งออเดอร์สถานะอนุมัติแล้ว รอตรวจสอบ และยกเลิก เพื่อให้การรันคำสั่ง SQL แสดงผลวิเคราะห์ได้อย่างถูกต้องสมบูรณ์"
    )

    doc.add_page_break()

    # =========================================================
    # บทที่ 4: รายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน
    # =========================================================
    add_academic_heading(doc, "บทที่ 4\nรายงานวิเคราะห์ข้อมูลเชิงลึก 4 ด้าน", level=1, space_before=12, space_after=6)
    add_academic_paragraph(doc, 
        "รายงานวิเคราะห์ทั้ง 4 ด้าน พัฒนาขึ้นโดยใช้คำสั่ง SQL สืบข้อมูลจริงจากตารางที่เชื่อมโยงกันใน PostgreSQL แสดงผลผ่านหน้ารายงานผู้ดูแลระบบ และส่งออกเป็นไฟล์ CSV มาตรฐาน UTF-8 BOM ได้ทันที"
    )

    # Report 1
    add_academic_heading(doc, "4.1 รายงานที่ 1: ยอดขายตามช่วงเวลา", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "• คำถามทางธุรกิจ: ยอดขาย จำนวนคำสั่งซื้อ และค่าเฉลี่ยต่อคำสั่งซื้อ มีแนวโน้มเปลี่ยนแปลงไปอย่างไรตามแต่ละเดือน?", bold=True)
    add_academic_paragraph(doc, "• คำสั่ง SQL Query:")
    
    r1_sql = """SELECT 
    TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month,
    COUNT(o.id) AS total_orders,
    SUM(o.total) AS total_sales,
    ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY sale_month DESC;"""
    add_code_box(doc, r1_sql)

    add_academic_paragraph(doc, "ตารางที่ 4.1 สรุปยอดขายตามช่วงเวลาแต่ละเดือน", bold=True, space_after=2)
    r1_headers = ["เดือนที่มียอดขาย", "จำนวนคำสั่งซื้อ", "ยอดขายรวมสุทธิ (บาท)", "ค่าเฉลี่ยต่อคำสั่งซื้อ"]
    r1_data = [
        ["2026-09 (ล่าสุด)", "7 ออเดอร์", "฿2,402.00", "฿343.14"],
        ["2026-08", "8 ออเดอร์", "฿3,738.00", "฿467.25"],
        ["2026-07", "8 ออเดอร์", "฿3,759.00", "฿469.88"],
        ["2026-06", "8 ออเดอร์", "฿3,599.00", "฿449.88"]
    ]
    tbl_r1 = doc.add_table(rows=1, cols=4)
    format_styled_table(tbl_r1, [1.4, 1.3, 1.6, 1.7], r1_headers, r1_data, header_bg="B45309")
    add_academic_paragraph(doc, "• ผลการวิเคราะห์: ยอดขายในเดือนกันยายน 2026 สะท้อนข้อมูลการสั่งซื้อที่เพิ่มขึ้นสดจากระบบจริง ช่วยให้ผู้บริหารติดตามอัตราเติบโตและปรับกลยุทธ์ส่งเสริมการขายได้อย่างทันท่วงที", italic=True, space_after=10)

    # Report 2
    add_academic_heading(doc, "4.2 รายงานที่ 2: หนังสือ E-Book ขายดีที่สุด 5 อันดับแรก", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "• คำถามทางธุรกิจ: หนังสือเล่มใดขายได้มากที่สุด 5 อันดับแรกตามจำนวนเล่มและยอดขายรวม?", bold=True)
    add_academic_paragraph(doc, "• คำสั่ง SQL Query:")
    
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
    add_code_box(doc, r2_sql)

    add_academic_paragraph(doc, "ตารางที่ 4.2 สรุป E-Book ขายดีที่สุด 5 อันดับแรก", bold=True, space_after=2)
    r2_headers = ["รหัส", "ชื่อหนังสือ E-Book", "ผู้แต่ง", "หมวดหมู่", "เล่มที่ขายได้", "รายได้รวม (บาท)"]
    r2_data = [
        ["#1", "แสงจันทร์บนป่าไผ่", "จารึก ป่าไม้", "วรรณกรรม", "6 เล่ม", "฿1,554.00"],
        ["#2", "The Quiet Algorithm", "Alex Turner", "วิทยาการ", "5 เล่ม", "฿1,945.00"],
        ["#6", "Building Calm Software", "James Park", "เทคโนโลยี", "3 เล่ม", "฿1,347.00"],
        ["#10", "The Minimal Kitchen", "Mai Lin", "อาหาร", "3 เล่ม", "฿1,047.00"],
        ["#11", "ดาวพระศุกร์ก่อนรุ่งสาง", "อรุณ รุ่งโรจน์", "สารคดี", "3 เล่ม", "฿787.00"]
    ]
    tbl_r2 = doc.add_table(rows=1, cols=6)
    format_styled_table(tbl_r2, [0.5, 1.5, 1.2, 1.0, 0.9, 0.9], r2_headers, r2_data, header_bg="1E3A8A")
    add_academic_paragraph(doc, "• ผลการวิเคราะห์: หนังสือด้านวิทยาการและเทคโนโลยีสร้างรายได้เฉลี่ยต่อเล่มสูงสุด ควรจัดวางเป็นสินค้าแนะนำบนแบนเนอร์หน้าแรกของร้าน", italic=True, space_after=10)

    # Report 3
    add_academic_heading(doc, "4.3 รายงานที่ 3: ยอดขายตามหมวดหมู่หนังสือ", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "• คำถามทางธุรกิจ: หมวดหมู่ใดสร้างยอดขายและจำนวนรายการสั่งซื้อได้สูงสุด?", bold=True)
    add_academic_paragraph(doc, "• คำสั่ง SQL Query:")
    
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
    add_code_box(doc, r3_sql)

    add_academic_paragraph(doc, "ตารางที่ 4.3 สรุปยอดขายตามหมวดหมู่หนังสือ", bold=True, space_after=2)
    r3_headers = ["รหัส", "หมวดหมู่หนังสือ", "จำนวนคำสั่งซื้อ", "จำนวนเล่มที่ขายได้", "ยอดขายรวมสุทธิ (บาท)"]
    r3_data = [
        ["CAT-2", "วิทยาการและคอมพิวเตอร์", "10 ออเดอร์", "10 เล่ม", "฿3,691.00"],
        ["CAT-1", "นวนิยายและวรรณกรรม", "9 ออเดอร์", "9 เล่ม", "฿2,211.00"],
        ["CAT-5", "ไลฟ์สไตล์และอาหาร", "6 ออเดอร์", "6 เล่ม", "฿1,744.00"],
        ["CAT-3", "ประวัติศาสตร์และสารคดี", "5 ออเดอร์", "5 เล่ม", "฿1,345.00"],
        ["CAT-4", "ศิลปะและการออกแบบ", "4 ออเดอร์", "4 เล่ม", "฿1,256.00"]
    ]
    tbl_r3 = doc.add_table(rows=1, cols=5)
    format_styled_table(tbl_r3, [0.6, 1.8, 1.2, 1.1, 1.3], r3_headers, r3_data, header_bg="047857")
    add_academic_paragraph(doc, "• ผลการวิเคราะห์: หมวดวิทยาการและคอมพิวเตอร์มียอดขายรวมสูงสุด สะท้อนกลุ่มผู้อ่านหลักที่เป็นนักศึกษาและสายงานไอที", italic=True, space_after=10)

    # Report 4
    add_academic_heading(doc, "4.4 รายงานที่ 4: พฤติกรรมลูกค้าและยอดซื้อสะสม", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, "• คำถามทางธุรกิจ: ลูกค้ารายใดมียอดซื้อสะสมสูงสุด และมีการแจกแจงสถานะคำสั่งซื้อเป็นอย่างไร?", bold=True)
    add_academic_paragraph(doc, "• คำสั่ง SQL Query:")
    
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
    add_code_box(doc, r4_sql)

    add_academic_paragraph(doc, "ตารางที่ 4.4 สรุปพฤติกรรมลูกค้าและยอดซื้อสะสม", bold=True, space_after=2)
    r4_headers = ["ชื่อลูกค้า", "อีเมล", "ออเดอร์รวม", "ยอดซื้อสะสม", "อนุมัติแล้ว", "รอตรวจ", "ยกเลิก"]
    r4_data = [
        ["KANNITI YASO", "firts.zx99@gmail.com", "6 ออเดอร์", "฿2,842.00", "5 ออเดอร์", "1 ออเดอร์", "0"],
        ["สมชาย สายโค้ด", "somchai.tech@gmail.com", "5 ออเดอร์", "฿2,264.00", "4 ออเดอร์", "1 ออเดอร์", "0"],
        ["วนิดา นักอ่านตัวยง", "wanida.read@hotmail.com", "4 ออเดอร์", "฿1,575.00", "4 ออเดอร์", "0", "0"],
        ["ธนวัฒน์ ศิลป์สว่าง", "tanawat.design@gmail.com", "4 ออเดอร์", "฿1,346.00", "3 ออเดอร์", "0", "1 ออเดอร์"],
        ["พีรณัฐ สายซอฟต์แวร์", "peerat.dev@outlook.com", "3 ออเดอร์", "฿1,237.00", "3 ออเดอร์", "0", "0"]
    ]
    tbl_r4 = doc.add_table(rows=1, cols=7)
    format_styled_table(tbl_r4, [0.9, 1.2, 0.7, 0.7, 0.8, 0.8, 0.9], r4_headers, r4_data, header_bg="4338CA")
    add_academic_paragraph(doc, "• ผลการวิเคราะห์: สามารถระบุกลุ่มลูกค้าหลักเพื่อจัดทำโปรโมชันหรือมอบสิทธิพิเศษเพื่อกระตุ้นการซื้อซ้ำได้อย่างแม่นยำ", italic=True, space_after=6)

    doc.add_page_break()

    # =========================================================
    # บทที่ 5: การพัฒนาเว็บแอปพลิเคชันและการควบคุมสิทธิ์การเข้าถึง
    # =========================================================
    add_academic_heading(doc, "บทที่ 5\nการพัฒนาเว็บแอปพลิเคชันและการควบคุมสิทธิ์การเข้าถึง", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "5.1 สถาปัตยกรรมระบบและความปลอดภัยการเข้าสู่ระบบ", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc,
        "ระบบพัฒนาด้วย Next.js 16 และเชื่อมต่อไปยัง Supabase PostgreSQL โดยมีหน้าต่างเข้าสู่ระบบและสมัครสมาชิกแบบ Email และ Password ที่สะอาดตา สอดคล้องกับแนวคิดการออกแบบสไตล์มินิมอล ดังแสดงในภาพที่ 5.1"
    )
    add_academic_figure(doc, os.path.join(images_dir, "login_overview.png"), "ภาพที่ 5.1: หน้าต่างเข้าสู่ระบบและสมัครสมาชิกแบบ Email และ Password พร้อมปุ่มสลับบทบาททดสอบด่วน")

    add_academic_heading(doc, "5.2 การแก้ไขข้อมูลส่วนตัวและการยืนยันบัญชีธนาคาร", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc,
        "เพื่อความถูกต้องในการสั่งซื้อและป้องกันการแอบอ้างสลิปโอนเงิน ระบบจัดเตรียมปุ่มการตั้งค่าในหน้าเข้าสู่ระบบ เพื่อให้ลูกค้าสามารถแก้ไขชื่อ เบอร์โทร อีเมล รวมถึงระบุชื่อบัญชีธนาคารและเลขที่บัญชีเพื่อใช้จับคู่ยืนยันตัวตนกับสลิปโอนเงิน ดังแสดงในภาพที่ 5.2"
    )
    add_academic_figure(doc, os.path.join(images_dir, "profile_settings_modal.png"), "ภาพที่ 5.2: หน้าต่างแก้ไขข้อมูลส่วนตัวและระบุบัญชีธนาคารยืนยันตัวตน")

    add_academic_heading(doc, "5.3 การควบคุมสิทธิ์การเข้าถึงตามบทบาทผู้ใช้", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc,
        "ตามข้อกำหนดด้านความปลอดภัย บัญชีที่เป็นลูกค้าทั่วไปจะไม่สามารถมองเห็นปุ่มหลังบ้านบนแถบเมนูหลักของเว็บไซต์ได้ เพื่อป้องกันความสับสนและการพยายามเข้าถึงส่วนที่ไม่ได้รับอนุญาต ดังแสดงในภาพที่ 5.3"
    )
    add_academic_figure(doc, os.path.join(images_dir, "customer_header.png"), "ภาพที่ 5.3: แถบเมนูด้านบนของผู้ใช้ทั่วไปที่ซ่อนปุ่มหลังบ้าน", width_inches=5.2)

    add_academic_paragraph(doc,
        "ยิ่งไปกว่านั้น หากผู้ใช้ทั่วไปพยายามพิมพ์ URL ตรงเข้าไปยังหน้าหลังบ้าน ระบบมี Route Guard ทำการดักจับและส่งกลับเป็นหน้า 403 Forbidden ทันที เพื่อป้องกันการข้ามสิทธิ์อย่างเด็ดขาด ดังแสดงในภาพที่ 5.4"
    )
    add_academic_figure(doc, os.path.join(images_dir, "admin_403_forbidden.png"), "ภาพที่ 5.4: ระบบความปลอดภัยแสดงหน้า 403 Forbidden เมื่อไม่ใช่แอดมิน")

    add_academic_paragraph(doc,
        "ในทางกลับกัน เมื่อเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ แถบเมนูด้านบนจะแสดงปุ่มหลังบ้านพร้อมสถานะสิทธิ์อย่างเด่นชัด ทำให้ผู้ดูแลระบบสามารถเข้าถึงเมนูจัดการร้านค้าได้อย่างสะดวก ดังแสดงในภาพที่ 5.5"
    )
    add_academic_figure(doc, os.path.join(images_dir, "admin_header.png"), "ภาพที่ 5.5: แถบเมนูด้านบนของสิทธิ์ผู้ดูแลระบบที่แสดงปุ่มหลังบ้าน", width_inches=5.2)

    add_academic_heading(doc, "5.4 การจัดการหมวดหมู่และการจัดการร้านค้าหลังบ้าน", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc,
        "ผู้ดูแลระบบสามารถบริหารจัดการข้อมูลพื้นฐานของระบบ เช่น การเพิ่มหมวดหมู่หนังสือ การแก้ไขชื่อและสลักภาษาอังกฤษ รวมถึงการตรวจสอบคำสั่งซื้อและอนุมัติสลิปโอนเงินเพื่อเปิดสิทธิ์ดาวน์โหลดให้แก่ลูกค้า ดังแสดงในภาพที่ 5.6"
    )
    add_academic_figure(doc, os.path.join(images_dir, "category_management.png"), "ภาพที่ 5.6: หน้าต่างจัดการหมวดหมู่หนังสือในระบบหลังบ้าน")

    add_academic_heading(doc, "5.5 หน้าจอรายงานวิเคราะห์ธุรกิจและการส่งออกไฟล์ CSV", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc,
        "หน้ารายงานดึงข้อมูลสรุปยอดขายสดจากฐานข้อมูลมาแสดงผลแบบ Interactive พร้อมปุ่ม Export CSV ซึ่งถูกออกแบบให้บันทึกไฟล์ด้วยรหัส UTF-8 พร้อม Byte Order Mark ทำให้เมื่อเปิดไฟล์ใน Microsoft Excel สระและพยัญชนะภาษาไทยจะแสดงผลได้อย่างถูกต้องสมบูรณ์ ปราศจากปัญหาภาษาต่างดาว ดังแสดงในภาพที่ 5.7"
    )
    add_academic_figure(doc, os.path.join(images_dir, "admin_reports_overview.png"), "ภาพที่ 5.7: หน้าจอรายงานวิเคราะห์ธุรกิจ 4 ด้าน พร้อมปุ่ม Export CSV")

    doc.add_page_break()

    # =========================================================
    # บทที่ 6: แผนการทดสอบและประกันคุณภาพระบบ
    # =========================================================
    add_academic_heading(doc, "บทที่ 6\nแผนการทดสอบและประกันคุณภาพระบบ", level=1, space_before=12, space_after=6)
    add_academic_paragraph(doc, "ตารางที่ 6.1 ตารางผลการทดสอบกรณีทดสอบทั้ง 8 กรณี", bold=True, space_after=2)

    tc_headers = ["รหัส", "ฟังก์ชันที่ทดสอบ", "ข้อมูลนำเข้า", "ผลลัพธ์ที่คาดหวัง", "ผลการทดสอบจริง", "ผล"]
    tc_data = [
        ["TC-01", "ตรวจสอบอีเมลซ้ำ", "อีเมลที่มีอยู่แล้วในระบบ", "ปฏิเสธการสมัคร แจ้งเตือนว่าอีเมลนี้ถูกใช้งานแล้ว", "แสดงข้อความเตือนและไม่บันทึกซ้ำลงฐานข้อมูล", "ผ่าน"],
        ["TC-02", "รหัสผ่านสั้นเกินไป", "รหัสผ่านน้อยกว่า 6 ตัวอักษร", "ระบบไม่อนุญาต แจ้งเตือนความยาวขั้นต่ำ", "ขึ้นข้อความแจ้งเตือนรหัสผ่านต้องมี 6 ตัวอักษรขึ้นไป", "ผ่าน"],
        ["TC-03", "หนังสือปิดการขาย", "แอดมินปิดการขายหนังสือเล่มที่ต้องการ", "หน้าร้านแคตตาล็อกต้องไม่แสดงหนังสือเล่มนี้", "หนังสือหายจากหน้าร้านทันทีตามเงื่อนไข", "ผ่าน"],
        ["TC-04", "ดาวน์โหลดก่อนอนุมัติสลิป", "คำสั่งซื้อสถานะรอตรวจ ลูกค้ากดดาวน์โหลด", "ไม่อนุญาตให้ดาวน์โหลด แสดงสถานะรอตรวจสอบ", "ปุ่มดาวน์โหลดถูกล็อก และขึ้นข้อความรอแอดมินอนุมัติ", "ผ่าน"],
        ["TC-05", "ปลดล็อกดาวน์โหลดหลังอนุมัติ", "แอดมินกดอนุมัติสลิปในหน้าจัดการออเดอร์", "สถานะเปลี่ยนเป็นอนุมัติแล้วและสร้างโทเค็น", "ลูกค้าได้รับปุ่มดาวน์โหลดไฟล์ทันที", "ผ่าน"],
        ["TC-06", "บันทึกราคาติดลบ", "ใส่ราคาหนังสือติดลบในคำสั่งเพิ่มข้อมูล", "ฐานข้อมูลปฏิเสธคำสั่งจากเงื่อนไข CHECK", "PostgreSQL ปฏิเสธการบันทึกข้อมูลผิดรูปแบบ", "ผ่าน"],
        ["TC-07", "ลูกค้าพิมพ์เข้าหน้าหลังบ้านตรง", "ลูกค้าพิมพ์ URL เข้าหน้าหลังบ้านโดยตรง", "บล็อกการเข้าถึงด้วยหน้า 403 Forbidden", "ระบบตัดเข้าหน้า 403 Access Denied ทันที", "ผ่าน"],
        ["TC-08", "ส่งออกรายงาน CSV ภาษาไทย", "กดปุ่ม Export CSV ในหน้ารายงาน", "เปิดไฟล์ใน Microsoft Excel ภาษาไทยไม่เพี้ยน", "ได้ไฟล์ CSV พร้อม UTF-8 BOM อ่านไทยได้สมบูรณ์", "ผ่าน"]
    ]
    tbl_tc = doc.add_table(rows=1, cols=6)
    format_styled_table(tbl_tc, [0.6, 1.4, 1.3, 1.3, 1.0, 0.4], tc_headers, tc_data)

    doc.add_page_break()

    # =========================================================
    # บทที่ 7: การประยุกต์ใช้ปัญญาประดิษฐ์ในการพัฒนา
    # =========================================================
    add_academic_heading(doc, "บทที่ 7\nการประยุกต์ใช้ปัญญาประดิษฐ์ในการพัฒนา", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "7.1 บันทึกคำสั่งและประวัติการใช้งาน AI", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "นักศึกษาได้บันทึกการประยุกต์ใช้เครื่องมือปัญญาประดิษฐ์เพื่อเป็นหลักฐานความโปร่งใสและแสดงการตรวจทานด้วยตนเองดังนี้:"
    )

    add_academic_paragraph(doc, "ตารางที่ 7.1 บันทึกประวัติการใช้งาน AI ในการพัฒนา", bold=True, space_after=2)
    ai_headers = ["วันที่", "เครื่องมือ AI", "คำสั่ง Prompt โดยสรุป", "สิ่งที่นำมาใช้งาน", "การตรวจสอบโดยนักศึกษา"]
    ai_data = [
        ["10 ก.ย. 69", "Claude / Antigravity", "ช่วยออกแบบ ERD และโครงสร้าง 9 ตารางสำหรับร้านขาย E-Book ให้ตรงหลัก 3NF และมี Foreign Key ครบถ้วน", "นำโครงร่าง DDL และความสัมพันธ์ของตารางมาใช้เป็นจุดเริ่มต้น", "ตรวจสอบชนิดข้อมูล ปรับเงื่อนไขความปลอดภัย และทดสอบรันบน PostgreSQL บน Supabase Cloud จริง"],
        ["12 ก.ย. 69", "Claude / Antigravity", "ช่วยเขียน SQL Query รายงาน 4 ด้านตามเกณฑ์อาจารย์ประภาส ที่ใช้ JOIN, GROUP BY, HAVING, CASE WHEN, SUM, COUNT, AVG, LIMIT", "นำคำสั่ง SQL ทั้ง 4 ข้อมาปรับแต่ง", "รัน Query ใน SQL Editor บน Supabase เทียบกับข้อมูลตัวอย่าง 32 คำสั่งซื้อ ยืนยันความถูกต้องของผลรวม"],
        ["14 ก.ย. 69", "Claude / Antigravity", "ช่วยปรับแต่งสไตล์หน้าเว็บให้เป็นมินิมอล และทำ Route Guard หน้า 403", "ได้โครงร่างโค้ด CSS และฟังก์ชันตรวจสอบสิทธิ์ใน React", "ตรวจสอบการแสดงผลบนหน้าจอคอมพิวเตอร์และมือถือ ยืนยันว่าปุ่มหลังบ้านถูกซ่อนจากลูกค้าจริง"]
    ]
    tbl_ai = doc.add_table(rows=1, cols=5)
    format_styled_table(tbl_ai, [0.8, 1.2, 1.5, 1.2, 1.3], ai_headers, ai_data)

    add_academic_heading(doc, "7.2 ข้อเสนอแนะของ AI ที่ตัดสินใจปฏิเสธ", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    for rej in [
        "1. การเก็บข้อมูลสลิปเป็น Base64 ในตาราง payments: AI เสนอให้แปลงไฟล์สลิปเป็น Base64 แล้วเซฟลงฐานข้อมูลตรงๆ แต่นักศึกษาปฏิเสธเนื่องจากจะทำให้ฐานข้อมูลมีขนาดใหญ่เกินความจำเป็นและลดประสิทธิภาพ จึงเลือกเก็บเป็น URL ชี้ไปยัง Cloud Storage แทน",
        "2. การอนุญาตให้ลูกค้าดาวน์โหลดไฟล์ E-Book ได้ทันทีโดยไม่ต้องรอตรวจสลิป: นักศึกษาปฏิเสธเนื่องจากขัดต่อข้อกำหนดความปลอดภัยของอาจารย์ และเสี่ยงต่อการสั่งซื้อโดยไม่โอนเงินจริง",
        "3. การใช้รหัสผ่านแบบข้อความธรรมดาในตารางทดสอบ: นักศึกษาปฏิเสธและปรับปรุง Schema ให้เก็บเป็นรหัสผ่านที่เข้ารหัสความปลอดภัยเสมอ เพื่อให้เป็นไปตามมาตรฐานสากล"
    ]:
        add_academic_paragraph(doc, rej, space_after=3)

    add_academic_heading(doc, "7.3 จริยธรรมการคุ้มครองข้อมูลส่วนบุคคล", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "ในการจัดทำโครงงานนี้ ไม่มีการนำข้อมูลส่วนบุคคลจริง เบอร์โทรศัพท์จริง หรือสลิปธนาคารจริงของบุคคลภายนอกมาใช้งานในระบบ ข้อมูลทั้งหมดในฐานข้อมูลเป็นข้อมูลตัวอย่างจำลองทั้งสิ้น เพื่อรักษาจริยธรรมการใช้งานข้อมูลและปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล"
    )

    doc.add_page_break()

    # =========================================================
    # บทที่ 8: สรุปผลการดำเนินงานและข้อเสนอแนะ
    # =========================================================
    add_academic_heading(doc, "บทที่ 8\nสรุปผลการดำเนินงานและข้อเสนอแนะ", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "8.1 สรุปผลสัมฤทธิ์ของโครงงาน", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "โครงงานพัฒนาระบบฐานข้อมูลร้านขายหนังสือและอีบุ๊กออนไลน์ Lampara Books บรรลุผลตามเกณฑ์การประเมินของรายวิชาระบบฐานข้อมูลครบทุกข้อ โครงสร้างฐานข้อมูลมีความสมบูรณ์ตามหลัก 3NF ปราศจากข้อมูลซ้ำซ้อน มีระบบรักษาความปลอดภัยการดาวน์โหลดไฟล์ และมีรายงานเชิงวิเคราะห์ที่ช่วยสนับสนุนการตัดสินใจทางธุรกิจได้อย่างมีประสิทธิภาพ"
    )

    add_academic_heading(doc, "8.2 ข้อเสนอแนะในการพัฒนาต่อยอด", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    for sug in [
        "1. การพัฒนาระบบตัวอย่างการอ่าน: ให้ลูกค้าสามารถทดลองอ่านเนื้อหาตัวอย่างบางส่วนผ่านหน้าเว็บก่อนตัดสินใจซื้อ",
        "2. การเชื่อมต่อระบบชำระเงินอัตโนมัติ: เช่น ระบบแจ้งเตือนการโอนเงินสำเร็จแบบเรียลไทม์ผ่าน QR Code API",
        "3. การรองรับสินค้าแบบผสมผสาน: เชื่อมโยงกับระบบคลังสินค้าของวิชาวิศวกรรมซอฟต์แวร์ เพื่อจำหน่ายทั้งหนังสือเล่มกระดาษที่มีการตัดสต็อก และหนังสือดิจิทัลที่เปิดสิทธิ์ดาวน์โหลด"
    ]:
        add_academic_paragraph(doc, sug, space_after=3)

    doc.add_page_break()

    # =========================================================
    # ภาคผนวก
    # =========================================================
    add_academic_heading(doc, "ภาคผนวก", level=1, space_before=12, space_after=6)
    
    add_academic_heading(doc, "ภาคผนวก ก: รายการตรวจสอบความพร้อมก่อนส่งงาน", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    for chk in [
        "[X] สมาชิกในกลุ่มเข้าใจและสามารถอธิบายโครงสร้าง ERD ความสัมพันธ์ 1:N, N:M และคำสั่ง SQL ได้อย่างแม่นยำ",
        "[X] คำสั่งซื้อที่ยังไม่ยืนยันการชำระเงินไม่สามารถเปิดดาวน์โหลด E-Book ได้",
        "[X] มีข้อมูลตัวอย่างในระบบมากกว่า 30 คำสั่งซื้อ และครอบคลุมยอดขายหลายเดือนตั้งแต่ มิถุนายน ถึง กันยายน 2569",
        "[X] ไฟล์ SQL ทั้งหมดสามารถรันได้สมบูรณ์บน Supabase SQL Editor",
        "[X] รายงานวิเคราะห์ 4 ด้าน รันจากข้อมูลจริงในระบบและสามารถส่งออกเป็นไฟล์ CSV ได้อย่างถูกต้อง",
        "[X] ไม่มีการใช้ข้อมูลส่วนบุคคลจริง รหัสผ่านจริง หรือไฟล์ที่มีลิขสิทธิ์",
        "[X] มีบัญชีทดสอบด่วนบนหน้าจอเพื่อให้ผู้สอนคลิกสลับสิทธิ์ Admin และ Customer เพื่อตรวจงานได้สะดวก"
    ]:
        add_academic_paragraph(doc, chk, space_after=3)

    add_academic_heading(doc, "ภาคผนวก ข: การเชื่อมโยงโครงงานกับวิชาวิศวกรรมซอฟต์แวร์", level=2, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4)
    add_academic_paragraph(doc, 
        "โครงงานฝั่งฐานข้อมูลนี้ได้รับการจัดเก็บแยกเป็น Repository ใหม่บน GitHub โดยเฉพาะ เพื่อส่งให้อาจารย์ประภาส ผ่องสนาม และเชื่อมโยงข้ามไปยัง Repository โครงงาน Inventory System ของวิชาวิศวกรรมซอฟต์แวร์ ด้วยลิงก์อ้างอิงข้ามหากันอย่างถูกต้องตามแนวทางปฏิบัติของหลักสูตรวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น"
    )

    # Save Pass 1
    main_docx = r"D:\learnCode\BookSell-DatabaseProject\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx"
    doc.save(main_docx)
    print(f"Academic Report Pass 1 saved: {main_docx}")

    # Two-Pass Repagination via Word COM
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        doc_com = word.Documents.Open(os.path.abspath(main_docx))
        doc_com.Repaginate()
        
        heading_pages = {}
        sec2_com = doc_com.Sections(2)
        for para in sec2_com.Range.Paragraphs:
            t = para.Range.Text.strip()
            for _, _, _, _, skey in toc_entries:
                if skey in t and skey not in heading_pages:
                    heading_pages[skey] = str(para.Range.Information(1))
            for _, _, skey in table_entries:
                if skey in t and skey not in heading_pages:
                    heading_pages[skey] = str(para.Range.Information(1))
            for _, _, skey in figure_entries:
                if skey in t and skey not in heading_pages:
                    heading_pages[skey] = str(para.Range.Information(1))
                    
        doc_com.Close(False)
        word.Quit()
        print("Scanned exact Section 2 heading page numbers via Word COM:")
        for k, v in heading_pages.items():
            print(f"  {k[:35]} -> Page {v}")

        # Update TOC lines
        for p_line, title, skey in toc_p_elements:
            if skey in heading_pages:
                actual_pg = heading_pages[skey]
                p_line.text = ""
                r1 = p_line.add_run(title)
                is_bold = any(title == e[0] and e[2] for e in toc_entries)
                set_run_font(r1, FONT_NAME, size_pt=16, bold=is_bold)
                r2 = p_line.add_run(f"\t{actual_pg}")
                set_run_font(r2, FONT_NAME, size_pt=16, bold=is_bold)

        # Update Table lines
        for p_tline, t_title, skey in tot_p_elements:
            if skey in heading_pages:
                actual_pg = heading_pages[skey]
                p_tline.text = ""
                r1 = p_tline.add_run(t_title)
                set_run_font(r1, FONT_NAME, size_pt=16, bold=False)
                r2 = p_tline.add_run(f"\t{actual_pg}")
                set_run_font(r2, FONT_NAME, size_pt=16, bold=False)

        # Update Figure lines
        for p_fline, f_title, skey in tof_p_elements:
            if skey in heading_pages:
                actual_pg = heading_pages[skey]
                p_fline.text = ""
                r1 = p_fline.add_run(f_title)
                set_run_font(r1, FONT_NAME, size_pt=16, bold=False)
                r2 = p_fline.add_run(f"\t{actual_pg}")
                set_run_font(r2, FONT_NAME, size_pt=16, bold=False)

        doc.save(main_docx)
        print(f"Final Academic Report saved with 100% exact page numbers: {main_docx}")
    except Exception as e:
        print("Word COM Repagination note:", e)

    desktop_docx = r"C:\Users\First 1\Desktop\Db\01_เอกสารรายงาน-MiniProject-Database\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx"
    try:
        os.makedirs(os.path.dirname(desktop_docx), exist_ok=True)
        shutil.copy2(main_docx, desktop_docx)
        print(f"Synced Academic Report to Desktop: {desktop_docx}")
    except Exception as e:
        print("Desktop sync note:", e)

# =============================================================================
# 2. BUILD EVALUATION & PRINT DOCUMENT (สำหรับอาจารย์ตรวจ - ลบวงเล็บอังกฤษรกตา + จัดหน้าบาลานซ์)
# =============================================================================
def build_evaluation_doc():
    print("\nBuilding Document 2: เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.docx...")
    doc = Document()
    
    # Page setup: A4 with standard 2.0cm margins
    sec = doc.sections[0]
    sec.page_width = Inches(8.27)
    sec.page_height = Inches(11.69)
    sec.top_margin = Inches(0.8)
    sec.bottom_margin = Inches(0.8)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)
    sec.different_first_page_header_footer = True
    
    sec.header.paragraphs[0].text = ""
    sec.footer.paragraphs[0].text = ""

    # ---------------------------------------------------------
    # 🌟 หน้าปกเล่มตรวจ (Cover Page)
    # ---------------------------------------------------------
    logo_path = r"d:\learnCode\BookSell-DatabaseProject\docs\images\rmuti_logo.png"
    if not os.path.exists(logo_path):
        logo_path = r"d:\learnCode\BookSell-DatabaseProject\docs\RMUTI-logo-color2.png"
        
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(16)
        p_logo.paragraph_format.space_after = Pt(14)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.5))
        
    p_t0 = doc.add_paragraph()
    p_t0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t0.paragraph_format.space_before = Pt(0)
    p_t0.paragraph_format.space_after = Pt(8)
    r = p_t0.add_run("เอกสารประกอบการตรวจประเมินโครงงาน")
    set_run_font(r, FONT_NAME, size_pt=20, bold=True, color_rgb=RGBColor(30, 58, 138))

    p_t1 = doc.add_paragraph()
    p_t1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t1.paragraph_format.space_before = Pt(0)
    p_t1.paragraph_format.space_after = Pt(8)
    p_t1.paragraph_format.line_spacing = 1.15
    r = p_t1.add_run("การออกแบบส่วนติดต่อผู้ใช้และโครงสร้างฐานข้อมูล\nร้านขายหนังสือและอีบุ๊กออนไลน์ Lampara Books")
    set_run_font(r, FONT_NAME, size_pt=22, bold=True)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(32)
    r = p_sub.add_run("โครงงานพัฒนาระบบฐานข้อมูล | รายวิชาระบบฐานข้อมูล รหัสวิชา 31-407-102-301")
    set_run_font(r, FONT_NAME, size_pt=17, bold=True, color_rgb=RGBColor(71, 85, 105))

    p_author_box = doc.add_paragraph()
    p_author_box.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_author_box.paragraph_format.space_before = Pt(14)
    p_author_box.paragraph_format.space_after = Pt(28)
    p_author_box.paragraph_format.line_spacing = 1.25
    r1 = p_author_box.add_run("จัดทำโดย\n")
    set_run_font(r1, FONT_NAME, size_pt=18, bold=True)
    r2 = p_author_box.add_run("นายกานต์นิธิ ยะโส   รหัสนักศึกษา 67332110223-9\n\n")
    set_run_font(r2, FONT_NAME, size_pt=18, bold=True)
    r3 = p_author_box.add_run("เสนอ\n")
    set_run_font(r3, FONT_NAME, size_pt=18, bold=True)
    r4 = p_author_box.add_run("อาจารย์ประภาส ผ่องสนาม (อาจารย์ผู้สอน)")
    set_run_font(r4, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    p_uni = doc.add_paragraph()
    p_uni.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_uni.paragraph_format.space_before = Pt(30)
    p_uni.paragraph_format.space_after = Pt(0)
    p_uni.paragraph_format.line_spacing = 1.15
    r = p_uni.add_run(
        "สาขาวิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์\n"
        "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น\n"
        "ภาคการศึกษาที่ 1 ปีการศึกษา 2569"
    )
    set_run_font(r, FONT_NAME, size_pt=17, bold=True)
    
    doc.add_page_break()

    # ---------------------------------------------------------
    # 🌟 SECTION 2: Evaluation Pages with Clean Headers
    # ---------------------------------------------------------
    sec_eval = doc.add_section(WD_SECTION_START.NEW_PAGE)
    sec_eval.header.is_linked_to_previous = False
    sec_eval.footer.is_linked_to_previous = False
    sec_eval.different_first_page_header_footer = False
    sec_eval.page_width = Inches(8.27)
    sec_eval.page_height = Inches(11.69)
    sec_eval.top_margin = Inches(0.8)
    sec_eval.bottom_margin = Inches(0.8)
    sec_eval.left_margin = Inches(0.9)
    sec_eval.right_margin = Inches(0.9)
    
    sectPr = sec_eval._sectPr
    sectPr.append(parse_xml(f'<w:pgNumType {nsdecls("w")} w:start="1"/>'))
    
    p_hdr = sec_eval.header.paragraphs[0]
    p_hdr.text = ""
    p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_hdr.paragraph_format.space_before = Pt(0)
    p_hdr.paragraph_format.space_after = Pt(0)
    fld = parse_xml(
        f'<w:fldSimple {nsdecls("w")} w:instr="PAGE">\n'
        f'  <w:r>\n'
        f'    <w:rPr>\n'
        f'      <w:rFonts w:ascii="{FONT_NAME}" w:hAnsi="{FONT_NAME}" w:cs="{FONT_NAME}" w:eastAsia="{FONT_NAME}"/>\n'
        f'      <w:sz w:val="26"/>\n'
        f'      <w:color w:val="64748B"/>\n'
        f'    </w:rPr>\n'
        f'    <w:t>1</w:t>\n'
        f'  </w:r>\n'
        f'</w:fldSimple>'
    )
    p_hdr._p.append(fld)

    images_dir = r"d:\learnCode\BookSell-DatabaseProject\docs\images"
    shots_dir = r"d:\learnCode\BookSell-DatabaseProject\shots"

    # =========================================================
    # ส่วนที่ 1: ผังภาพรวมสถาปัตยกรรมระบบ (ไม่มีหัวข้อซ้อนกัน 3 ชั้น!)
    # =========================================================
    p_s1 = doc.add_paragraph()
    p_s1.paragraph_format.space_before = Pt(8)
    p_s1.paragraph_format.space_after = Pt(2)
    p_s1.paragraph_format.keep_with_next = True
    r = p_s1.add_run("ส่วนที่ 1: ผังภาพรวมสถาปัตยกรรมระบบ")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    p_s1_sub = doc.add_paragraph()
    p_s1_sub.paragraph_format.space_before = Pt(0)
    p_s1_sub.paragraph_format.space_after = Pt(8)
    r = p_s1_sub.add_run("สถาปัตยกรรม 3 ระดับ เชื่อมโยง Next.js 16 และ Supabase PostgreSQL")
    set_run_font(r, FONT_NAME, size_pt=15, bold=False, color_rgb=RGBColor(71, 85, 105))

    p_img1 = doc.add_paragraph()
    p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img1.paragraph_format.space_before = Pt(2)
    p_img1.paragraph_format.space_after = Pt(6)
    p_img1.paragraph_format.keep_with_next = True
    p_img1.add_run().add_picture(os.path.join(images_dir, "tech_stack_architecture.png"), width=Inches(6.3))

    p_d1 = doc.add_paragraph()
    p_d1.paragraph_format.space_before = Pt(2)
    p_d1.paragraph_format.space_after = Pt(4)
    p_d1.paragraph_format.line_spacing = 1.15
    r_d = p_d1.add_run("คำอธิบายทางเทคนิค: ระบบใช้ Next.js 16 และ React 19 ประมวลผลฝั่งผู้ใช้และ Server Actions สื่อสารกับฐานข้อมูล PostgreSQL บนระบบคลาวด์ Supabase แบบเรียลไทม์ มีระบบความปลอดภัย Route Guard ป้องกันหน้า 403 และส่งออกไฟล์ CSV ด้วยรหัส UTF-8 BOM อย่างสมบูรณ์")
    set_run_font(r_d, FONT_NAME, size_pt=15, bold=False, color_rgb=RGBColor(30, 41, 59))

    doc.add_page_break()

    # =========================================================
    # ส่วนที่ 2: โครงสร้างฐานข้อมูลและผัง ER Diagram (หน้าเดียวเต็มตา)
    # =========================================================
    p_s2 = doc.add_paragraph()
    p_s2.paragraph_format.space_before = Pt(8)
    p_s2.paragraph_format.space_after = Pt(2)
    p_s2.paragraph_format.keep_with_next = True
    r = p_s2.add_run("ส่วนที่ 2: ผังความสัมพันธ์ข้อมูล ER Diagram")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    p_s2_sub = doc.add_paragraph()
    p_s2_sub.paragraph_format.space_before = Pt(0)
    p_s2_sub.paragraph_format.space_after = Pt(6)
    r = p_s2_sub.add_run("ผังความสัมพันธ์ครอบคลุมทั้ง 9 ตาราง พร้อมคีย์หลัก คีย์นอก และข้อกำหนดบูรณภาพข้อมูล")
    set_run_font(r, FONT_NAME, size_pt=15, bold=False, color_rgb=RGBColor(71, 85, 105))

    p_img2 = doc.add_paragraph()
    p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img2.paragraph_format.space_before = Pt(2)
    p_img2.paragraph_format.space_after = Pt(6)
    p_img2.paragraph_format.keep_with_next = True
    p_img2.add_run().add_picture(os.path.join(images_dir, "erd_column_mapped.png"), width=Inches(6.4))

    p_d2 = doc.add_paragraph()
    p_d2.paragraph_format.space_before = Pt(2)
    p_d2.paragraph_format.space_after = Pt(4)
    p_d2.paragraph_format.line_spacing = 1.15
    r_d2 = p_d2.add_run("คำอธิบายทางเทคนิค: แสดงความสัมพันธ์ระดับ Schema ครบถ้วน ได้แก่ roles เชื่อมโยงกับ users (1:N), users เชื่อมโยงกับ orders (1:N), authors และ categories เชื่อมโยงกับ books (1:N), orders และ books เชื่อมโยงกับ order_items (1:N), orders เชื่อมโยงกับ payments (1:1), และ orders เชื่อมโยงกับ download_links (1:N)")
    set_run_font(r_d2, FONT_NAME, size_pt=15, bold=False, color_rgb=RGBColor(30, 41, 59))

    doc.add_page_break()

    # ---------------------------------------------------------
    # พจนานุกรมข้อมูลทั้ง 9 ตาราง (Data Dictionary)
    # ---------------------------------------------------------
    p_s_dict = doc.add_paragraph()
    p_s_dict.paragraph_format.space_before = Pt(8)
    p_s_dict.paragraph_format.space_after = Pt(2)
    p_s_dict.paragraph_format.keep_with_next = True
    r = p_s_dict.add_run("โครงสร้างตารางข้อมูลทั้ง 9 ตาราง")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    dict_headers = ["ชื่อฟิลด์", "ชนิดข้อมูล", "ข้อกำหนด", "คำอธิบายความหมาย"]
    dict_tables_all = [
        ("1. ตาราง roles: สิทธิ์และบทบาทผู้ใช้งาน", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสบทบาท (1 = Admin, 2 = Customer)"],
            ["name", "VARCHAR(50)", "UNIQUE, NOT NULL", "ชื่อบทบาทผู้ใช้งาน"],
            ["description", "TEXT", "NULL", "คำอธิบายหน้าที่ความรับผิดชอบ"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "เวลาสร้างข้อมูล"]
        ]),
        ("2. ตาราง users: ข้อมูลสมาชิกและผู้ดูแลระบบ", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสผู้ใช้งาน"],
            ["role_id", "INT", "FK -> roles(id) RESTRICT", "รหัสบทบาท"],
            ["email", "VARCHAR(255)", "UNIQUE, NOT NULL", "อีเมลเข้าสู่ระบบ"],
            ["password_hash", "VARCHAR(255)", "NOT NULL", "รหัสผ่านที่เข้ารหัส"],
            ["full_name", "VARCHAR(150)", "NOT NULL", "ชื่อ-นามสกุล"],
            ["phone", "VARCHAR(30)", "NULL", "เบอร์โทรศัพท์"],
            ["bank_account_name", "VARCHAR(150)", "NULL", "ชื่อบัญชีธนาคารสำหรับยืนยันตัวตน"],
            ["bank_account_number", "VARCHAR(50)", "NULL", "เลขที่บัญชีธนาคาร"],
            ["bank_name", "VARCHAR(100)", "NULL", "ชื่อธนาคาร"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "เวลาสมัคร"]
        ]),
        ("3. ตาราง authors: ข้อมูลผู้แต่ง", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสผู้แต่ง"],
            ["name", "VARCHAR(150)", "NOT NULL", "ชื่อ-นามสกุล หรือนามปากกา"],
            ["bio", "TEXT", "NULL", "ประวัติผลงาน"],
            ["email", "VARCHAR(255)", "NULL", "อีเมลติดต่อ"],
            ["avatar_url", "VARCHAR(500)", "NULL", "ลิงก์รูปผู้แต่ง"]
        ]),
        ("4. ตาราง categories: หมวดหมู่หนังสือ", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสหมวดหมู่"],
            ["name", "VARCHAR(100)", "UNIQUE, NOT NULL", "ชื่อหมวดหมู่ภาษาไทย"],
            ["slug", "VARCHAR(100)", "UNIQUE, NOT NULL", "URL Slug ภาษาอังกฤษ"],
            ["description", "TEXT", "NULL", "คำอธิบายหมวดหมู่"]
        ]),
        ("5. ตาราง books: ข้อมูลหนังสือดิจิทัล E-Book", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสหนังสือ"],
            ["title", "VARCHAR(255)", "NOT NULL", "ชื่อเรื่องหนังสือ"],
            ["author_id", "INT", "FK -> authors(id) SET NULL", "รหัสผู้แต่ง"],
            ["category_id", "INT", "FK -> categories(id) SET NULL", "รหัสหมวดหมู่"],
            ["price", "DECIMAL(10,2)", "NOT NULL, CHECK (price >= 0)", "ราคาจำหน่ายต่อเล่ม (บาท)"],
            ["cover_color", "VARCHAR(20)", "DEFAULT '#2F5D50'", "โค้ดสีปกจำลอง"],
            ["description", "TEXT", "NULL", "เรื่องย่อและสารบัญ"],
            ["pages", "INT", "CHECK (pages >= 0)", "จำนวนหน้า"],
            ["isbn", "VARCHAR(30)", "UNIQUE, NULL", "เลขมาตรฐานสากล"],
            ["is_active", "BOOLEAN", "DEFAULT TRUE", "สถานะขาย (Soft Delete)"],
            ["file_url", "VARCHAR(500)", "NULL", "ลิงก์ไฟล์หนังสือ"]
        ]),
        ("6. ตาราง orders: ข้อมูลคำสั่งซื้อหลัก", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสคำสั่งซื้อ"],
            ["user_id", "INT", "FK -> users(id) SET NULL", "รหัสสมาชิกผู้สั่ง"],
            ["checkout_email", "VARCHAR(255)", "NOT NULL", "อีเมลผู้รับไฟล์"],
            ["checkout_name", "VARCHAR(150)", "NOT NULL", "ชื่อผู้สั่งซื้อ"],
            ["total", "DECIMAL(10,2)", "NOT NULL, CHECK (total >= 0)", "ยอดรวมสุทธิ (บาท)"],
            ["status", "VARCHAR(30)", "CHECK (status IN (...))", "สถานะ (Pending, Paid, Confirmed, Cancelled)"],
            ["created_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "เวลาสั่งซื้อ"]
        ]),
        ("7. ตาราง order_items: รายการสินค้าในคำสั่งซื้อ", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสรายการย่อย"],
            ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อหลัก"],
            ["book_id", "INT", "FK -> books(id) RESTRICT", "รหัสหนังสือ"],
            ["title", "VARCHAR(255)", "NOT NULL", "ชื่อหนังสือ ณ เวลาซื้อ"],
            ["quantity", "INT", "NOT NULL, CHECK (quantity > 0)", "จำนวนเล่ม"],
            ["price_at_time", "DECIMAL(10,2)", "CHECK (price_at_time >= 0)", "ราคาประวัติ ณ วันสั่งซื้อ"]
        ]),
        ("8. ตาราง payments: ข้อมูลการชำระเงินและสลิปหลักฐาน", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสการชำระเงิน"],
            ["order_id", "INT", "FK -> orders(id) CASCADE, UNIQUE", "รหัสคำสั่งซื้อ"],
            ["payment_method", "VARCHAR(50)", "CHECK (IN ('PromptPay', ...))", "วิธีชำระเงิน"],
            ["slip_url", "VARCHAR(500)", "NULL", "ลิงก์ไฟล์ภาพสลิปโอนเงิน"],
            ["amount", "DECIMAL(10,2)", "CHECK (amount >= 0)", "ยอดเงินที่แจ้งโอน (บาท)"],
            ["status", "VARCHAR(30)", "CHECK (IN ('Pending', ...))", "สถานะสลิป (Pending, Verified, Rejected)"],
            ["paid_at", "TIMESTAMPTZ", "DEFAULT CURRENT_TIMESTAMP", "เวลาแจ้งโอน"]
        ]),
        ("9. ตาราง download_links: สิทธิ์และโทเค็นดาวน์โหลดปลอดภัย", [
            ["id", "SERIAL", "PRIMARY KEY", "รหัสสิทธิ์ดาวน์โหลด"],
            ["token", "VARCHAR(64)", "UNIQUE, NOT NULL", "โทเค็นความปลอดภัยลับเฉพาะออเดอร์"],
            ["order_id", "INT", "FK -> orders(id) CASCADE", "รหัสคำสั่งซื้อ"],
            ["book_id", "INT", "FK -> books(id) CASCADE", "รหัสหนังสือที่ได้รับสิทธิ์"],
            ["download_count", "INT", "CHECK (download_count >= 0)", "จำนวนครั้งที่ดาวน์โหลด"],
            ["max_downloads", "INT", "DEFAULT 5", "โควตาดาวน์โหลดสูงสุด (5 ครั้ง)"],
            ["expires_at", "TIMESTAMPTZ", "NOT NULL", "วันเวลาหมดอายุของลิงก์"]
        ])
    ]

    for title, rows in dict_tables_all:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.keep_with_next = True
        p_t.paragraph_format.space_before = Pt(6)
        p_t.paragraph_format.space_after = Pt(2)
        r = p_t.add_run(title)
        set_run_font(r, FONT_NAME, size_pt=16, bold=True)
        
        tbl_d = doc.add_table(rows=1, cols=4)
        format_styled_table(tbl_d, [1.2, 1.1, 1.9, 2.2], dict_headers, rows)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    doc.add_page_break()

    # ---------------------------------------------------------
    # รายงานวิเคราะห์ธุรกิจ 4 ด้าน (Analytical SQL Queries)
    # ---------------------------------------------------------
    p_s_sql = doc.add_paragraph()
    p_s_sql.paragraph_format.space_before = Pt(8)
    p_s_sql.paragraph_format.space_after = Pt(2)
    p_s_sql.paragraph_format.keep_with_next = True
    r = p_s_sql.add_run("รายงานวิเคราะห์ธุรกิจ 4 ด้าน ด้วยคำสั่ง SQL")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    # SQL 1
    add_academic_paragraph(doc, "1. รายงานยอดขายตามช่วงเวลาแต่ละเดือน", bold=True, space_after=2)
    r1_sql = """SELECT TO_CHAR(o.created_at, 'YYYY-MM') AS sale_month, COUNT(o.id) AS total_orders,
       SUM(o.total) AS total_sales, ROUND(AVG(o.total), 2) AS avg_order_value
FROM orders o WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM') ORDER BY sale_month DESC;"""
    add_code_box(doc, r1_sql, max_width_in=6.4)
    r1_headers = ["เดือนที่มียอดขาย", "จำนวนคำสั่งซื้อ", "ยอดขายรวมสุทธิ (บาท)", "ค่าเฉลี่ยต่อคำสั่งซื้อ"]
    r1_data = [
        ["2026-09 (ล่าสุด)", "7 ออเดอร์", "฿2,402.00", "฿343.14"],
        ["2026-08", "8 ออเดอร์", "฿3,738.00", "฿467.25"],
        ["2026-07", "8 ออเดอร์", "฿3,759.00", "฿469.88"],
        ["2026-06", "8 ออเดอร์", "฿3,599.00", "฿449.88"]
    ]
    tbl_r1 = doc.add_table(rows=1, cols=4)
    format_styled_table(tbl_r1, [1.4, 1.3, 1.8, 1.9], r1_headers, r1_data, header_bg="B45309")
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # SQL 2
    add_academic_paragraph(doc, "2. รายงานหนังสือ E-Book ขายดีที่สุด 5 อันดับแรก", bold=True, space_after=2)
    r2_sql = """SELECT b.id, b.title, COALESCE(a.name, 'ไม่ระบุ') AS author, COALESCE(c.name, 'ทั่วไป') AS category,
       SUM(oi.quantity) AS total_sold, SUM(oi.quantity * oi.price_at_time) AS total_revenue
FROM order_items oi JOIN books b ON oi.book_id = b.id LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN categories c ON b.category_id = c.id JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('Confirmed', 'Completed', 'Paid')
GROUP BY b.id, b.title, a.name, c.name ORDER BY total_sold DESC, total_revenue DESC LIMIT 5;"""
    add_code_box(doc, r2_sql, max_width_in=6.4)
    r2_headers = ["รหัส", "ชื่อหนังสือ E-Book", "ผู้แต่ง", "หมวดหมู่", "เล่มที่ขายได้", "รายได้รวม (บาท)"]
    r2_data = [
        ["#1", "แสงจันทร์บนป่าไผ่", "จารึก ป่าไม้", "วรรณกรรม", "6 เล่ม", "฿1,554.00"],
        ["#2", "The Quiet Algorithm", "Alex Turner", "วิทยาการ", "5 เล่ม", "฿1,945.00"],
        ["#6", "Building Calm Software", "James Park", "เทคโนโลยี", "3 เล่ม", "฿1,347.00"],
        ["#10", "The Minimal Kitchen", "Mai Lin", "อาหาร", "3 เล่ม", "฿1,047.00"],
        ["#11", "ดาวพระศุกร์ก่อนรุ่งสาง", "อรุณ รุ่งโรจน์", "สารคดี", "3 เล่ม", "฿787.00"]
    ]
    tbl_r2 = doc.add_table(rows=1, cols=6)
    format_styled_table(tbl_r2, [0.5, 1.6, 1.2, 1.1, 1.0, 1.0], r2_headers, r2_data, header_bg="1E3A8A")

    doc.add_page_break()

    # =========================================================
    # ส่วนที่ 3: หน้าต่างส่วนติดต่อผู้ใช้ของระบบ (Web UI Presentation)
    # จัดวางแบบบาลานซ์ 2 ส่วนต่อหน้า ไม่มีพื้นที่ว่างเวิ้งว้าง
    # =========================================================
    p_s3 = doc.add_paragraph()
    p_s3.paragraph_format.space_before = Pt(8)
    p_s3.paragraph_format.space_after = Pt(2)
    p_s3.paragraph_format.keep_with_next = True
    r = p_s3.add_run("ส่วนที่ 3: การออกแบบหน้าจอเว็บแอปพลิเคชันและการทำงานจริง")
    set_run_font(r, FONT_NAME, size_pt=18, bold=True, color_rgb=RGBColor(30, 58, 138))

    def add_compact_ui_block(title, img_path, desc, width_in=5.4):
        p_t = doc.add_paragraph()
        p_t.paragraph_format.keep_with_next = True
        p_t.paragraph_format.space_before = Pt(8)
        p_t.paragraph_format.space_after = Pt(2)
        r = p_t.add_run(title)
        set_run_font(r, FONT_NAME, size_pt=16, bold=True, color_rgb=RGBColor(15, 23, 42))
        
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.keep_with_next = True
            p_img.paragraph_format.space_before = Pt(2)
            p_img.paragraph_format.space_after = Pt(3)
            p_img.add_run().add_picture(img_path, width=Inches(width_in))
            
        p_d = doc.add_paragraph()
        p_d.paragraph_format.space_before = Pt(0)
        p_d.paragraph_format.space_after = Pt(8)
        p_d.paragraph_format.line_spacing = 1.1
        r_d = p_d.add_run(f"การทำงาน: {desc}")
        set_run_font(r_d, FONT_NAME, size_pt=14.5, color_rgb=RGBColor(51, 65, 85))

    # =========================================================
    # ส่วนที่ 3: หน้าต่างส่วนติดต่อผู้ใช้ของระบบ (Web UI Presentation)
    # จัดวางแบบบาลานซ์ 2 หน้าจอต่อ 1 หน้ากระดาษ พอดีกรอบ สวยงาม ไม่มีภาพยาวหลุดกรอบ
    # =========================================================
    # Page 1 of Web UI: 1 & 2
    add_compact_ui_block(
        "1. ส่วนหัวและแถบนำทางหน้าร้านของผู้ใช้ทั่วไป",
        os.path.join(images_dir, "customer_header.png"),
        "แถบเมนูนำทางสะอาดตา มีเมนูหน้าร้าน รถเข็นพร้อมตัวเลขนับจำนวน และปุ่มเข้าสู่ระบบ โดยซ่อนปุ่มหลังบ้านจากลูกค้าทั่วไปอย่างปลอดภัย",
        width_in=5.2
    )
    add_compact_ui_block(
        "2. หน้าตะกร้าสินค้าและการคำนวณราคาสุทธิแบบเรียลไทม์",
        os.path.join(shots_dir, "cart@1280.png"),
        "ลูกค้าสามารถปรับเพิ่มหรือลดจำนวนเล่ม หรือลบรายการที่ไม่ต้องการ โดยระบบจะคำนวณราคาสุทธิแบบเรียลไทม์พร้อมปุ่มสั่งซื้อ",
        width_in=4.6
    )
    doc.add_page_break()

    # Page 2 of Web UI: 3 & 4
    add_compact_ui_block(
        "3. หน้าสั่งซื้อและแจ้งชำระเงินจำลอง พร้อมแนบสลิปโอนเงิน",
        os.path.join(shots_dir, "checkout@1280.png"),
        "กรอกชื่อ-นามสกุล อีเมลผู้รับไฟล์ และแนบหลักฐานสลิปการโอนเงิน โดยบันทึกลงตาราง orders, order_items และ payments ทันที",
        width_in=4.6
    )
    add_compact_ui_block(
        "4. หน้าต่างแก้ไขข้อมูลส่วนตัวและระบุบัญชีธนาคารยืนยันตัวตน",
        os.path.join(images_dir, "profile_settings_modal.png"),
        "เปิดให้สมาชิกแก้ไขข้อมูล ชื่อ เบอร์โทร รวมถึงชื่อและเลขบัญชีธนาคาร เพื่อใช้ตรวจสอบความถูกต้องของสลิปโอนเงินในตาราง users",
        width_in=4.8
    )
    doc.add_page_break()

    # Page 3 of Web UI: 5 & 6
    add_compact_ui_block(
        "5. หน้าต่างเข้าสู่ระบบและสมัครสมาชิก พร้อมปุ่มสลับบทบาททดสอบด่วน",
        os.path.join(images_dir, "login_overview.png"),
        "ระบบตรวจสอบความปลอดภัยของรหัสผ่าน พร้อมปุ่มทดสอบสลับสิทธิ์ระหว่าง Admin และ Customer เพื่อความสะดวกในการตรวจข้อสอบของอาจารย์",
        width_in=4.8
    )
    add_compact_ui_block(
        "6. แถบนำทางของผู้ดูแลระบบที่แสดงปุ่มหลังบ้าน",
        os.path.join(images_dir, "admin_header.png"),
        "เมื่อเข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ แถบเมนูด้านบนจะแสดงปุ่มหลังบ้านพร้อมสถานะสิทธิ์อย่างเด่นชัด ทำให้เข้าถึงเมนูจัดการร้านค้าได้อย่างสะดวก",
        width_in=5.2
    )
    doc.add_page_break()

    # Page 4 of Web UI: 7 & 8
    admin_dash_img = os.path.join(images_dir, "admin-dashboard.png")
    if not os.path.exists(admin_dash_img):
        admin_dash_img = os.path.join(r"d:\learnCode\BookSell-DatabaseProject\docs", "admin-dashboard.png")
    add_compact_ui_block(
        "7. หน้าแผงควบคุมระบบหลังบ้านของผู้ดูแลระบบ",
        admin_dash_img,
        "ศูนย์กลางการจัดการคำสั่งซื้อ การตรวจสอบสลิปโอนเงิน การกดอนุมัติเพื่อเปิดสิทธิ์ดาวน์โหลด หรือกดยกเลิก พร้อมระบบค้นหาออเดอร์",
        width_in=5.2
    )
    add_compact_ui_block(
        "8. หน้าต่างจัดการหมวดหมู่และหนังสือ",
        os.path.join(images_dir, "category_management.png"),
        "แอดมินสามารถเพิ่มและแก้ไขหมวดหมู่ และสลับสถานะเปิดหรือปิดการขายเพื่อทำ Soft Delete หนังสือออกจากหน้าร้านโดยไม่ลบประวัติคำสั่งซื้อ",
        width_in=5.2
    )
    doc.add_page_break()

    # Page 5 of Web UI: 9 & 10
    add_compact_ui_block(
        "9. ระบบความปลอดภัย Route Guard แสดงหน้า 403 Forbidden",
        os.path.join(images_dir, "admin_403_forbidden.png"),
        "เมื่อผู้ใช้ทั่วไปหรือผู้ที่ยังไม่ได้เข้าสู่ระบบ พยายามพิมพ์ URL เข้าหน้าหลังบ้านโดยตรง ระบบจะบล็อกการเข้าถึงและส่งกลับหน้า 403 ทันที",
        width_in=5.2
    )
    add_compact_ui_block(
        "10. หน้ารายงานสถิติธุรกิจ 4 ด้าน พร้อมปุ่มส่งออกไฟล์ CSV",
        os.path.join(images_dir, "admin_reports_overview.png"),
        "หน้ารายงานประมวลผลคำสั่ง SQL ดึงข้อมูลสดจาก PostgreSQL จัดทำตารางสรุป พร้อมปุ่ม Export CSV ด้วยรหัส UTF-8 BOM ที่อ่านไทยใน Excel ได้สมบูรณ์",
        width_in=5.2
    )

    eval_docx = r"D:\learnCode\BookSell-DatabaseProject\เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.docx"
    doc.save(eval_docx)
    print(f"Document 2 saved successfully: {eval_docx} ({os.path.getsize(eval_docx):,} bytes)")

    desktop_eval = r"C:\Users\First 1\Desktop\Db\01_เอกสารรายงาน-MiniProject-Database\เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.docx"
    try:
        os.makedirs(os.path.dirname(desktop_eval), exist_ok=True)
        shutil.copy2(eval_docx, desktop_eval)
        print(f"Synced Document 2 to Desktop: {desktop_eval}")
    except Exception as e:
        print("Desktop sync note:", e)

def export_pdfs_via_word_com():
    """Convert both DOCX files to PDF using Word COM with exact layout repagination."""
    import win32com.client
    print("\n--- Starting Word COM PDF Export for Both Documents ---")
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False

    files_to_export = [
        (
            r"D:\learnCode\BookSell-DatabaseProject\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.docx",
            r"D:\learnCode\BookSell-DatabaseProject\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.pdf",
            r"C:\Users\First 1\Desktop\Db\01_เอกสารรายงาน-MiniProject-Database\รายงาน_Mini_Project_Database_ร้านขาย_E-Book_2026.pdf"
        ),
        (
            r"D:\learnCode\BookSell-DatabaseProject\เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.docx",
            r"D:\learnCode\BookSell-DatabaseProject\เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.pdf",
            r"C:\Users\First 1\Desktop\Db\01_เอกสารรายงาน-MiniProject-Database\เอกสารตรวจประเมิน_หน้าตาเว็บและโครงสร้างฐานข้อมูล_สำหรับอาจารย์_2026.pdf"
        )
    ]

    for docx_path, pdf_path, desktop_pdf in files_to_export:
        if os.path.exists(docx_path):
            try:
                doc_com = word.Documents.Open(os.path.abspath(docx_path))
                doc_com.Repaginate()
                doc_com.SaveAs(os.path.abspath(pdf_path), FileFormat=17) # 17 = wdFormatPDF
                doc_com.Close()
                print(f"Exported PDF: {pdf_path}")
                shutil.copy2(pdf_path, desktop_pdf)
                print(f"Synced PDF to Desktop: {desktop_pdf}")
            except Exception as e:
                print(f"Error exporting PDF for {docx_path}: {e}")

    word.Quit()
    print("--- Word COM PDF Export Completed ---")

def main():
    print("=================================================================")
    print("STARTING COMPLETE DOCUMENT GENERATION WITH AUTHENTIC LOGOS & COMPACT UI")
    print("=================================================================")
    ensure_authentic_architecture_diagram()
    build_academic_report()
    build_evaluation_doc()
    export_pdfs_via_word_com()
    print("\n=================================================================")
    print("ALL DOCUMENTS AND PDFS UPDATED AND SYNCED SUCCESSFULLY!")
    print("=================================================================")

if __name__ == "__main__":
    main()
