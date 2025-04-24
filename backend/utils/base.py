from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph  
from reportlab.lib.utils import ImageReader

from PIL import Image

font_name = "v1"
try:
    pdfmetrics.registerFont(TTFont(font_name, './utils/v1.ttf'))
except Exception as e:
    pdfmetrics.registerFont(TTFont(font_name, './v1.ttf'))
    print("Font not found")
    

# letter = (8.5*72, 11*72) = (612, 792)
class create_letter_pdf:

    def __init__(self, filename):
        self.paragraph_style = ParagraphStyle(
            name = "normalPargaph",
            fontName = font_name,
            fontSize = 12,
            alignment = 0,
            borderPadding = 0,
            firstLineIndent = 20,
            leading = 20
        )
        self.height = letter[1] - 50
        self.canvas_obj = canvas.Canvas(filename, pagesize=letter)
        self.canvas_obj.setFont(font_name, 12)

    def add_Tile(self, text, y, size=12):
        self.canvas_obj.saveState() # 保存当前状态
        self.canvas_obj.setFont(font_name, size)
        self.canvas_obj.drawCentredString(letter[0]/2, y - size, text)
        self.height -= size
        self.canvas_obj.restoreState() # 恢复之前状态
    
    def add_text(self, text, x, y):
        self.canvas_obj.saveState() # 保存当前状态
        self.canvas_obj.setFont(font_name, 12)
        self.canvas_obj.drawString(x, y - 12, text)
        self.height -= 12
        self.canvas_obj.restoreState()

    def add_paragraph(self, text, x, y):
        self.canvas_obj.saveState() # 保存当前状态
        p = Paragraph(text, self.paragraph_style)
        p.wrapOn(self.canvas_obj, letter[0] - 100, 0)
        p.drawOn(self.canvas_obj, x, y - p.height)
        self.height -= p.height
        self.canvas_obj.restoreState()

    def add_image(self, image_path, x, y, width, height):
        self.canvas_obj.saveState() # 保存当前状态
        self.canvas_obj.drawImage(image_path, x, y - height, width, height)
        self.height -= height
        self.canvas_obj.restoreState()

    def add_PIL_image(self, image, x, y, width, height):
        self.canvas_obj.saveState() # 保存当前状态
        self.canvas_obj.drawImage(ImageReader(image), x, y - height, width, height)
        self.height -= height
        self.canvas_obj.restoreState()

    def add_background_image(self, image_path):
        self.canvas_obj.saveState()
        self.canvas_obj.drawImage(image_path, 0, 0, letter[0], letter[1])
        self.canvas_obj.restoreState()

    def new_page(self):
        self.canvas_obj.showPage()
        self.height = letter[1] - 50

    def save(self):
        self.canvas_obj.showPage()
        self.canvas_obj.save()

if __name__ == '__main__':
    pdf = create_letter_pdf('test.pdf')
    pdf.add_Tile('测试', 740, 24)
    pdf.add_paragraph('测试33', 50, 690)
    image_path = '2.png'  # 替换为您的图片路径  
    image = Image.open(image_path)  
    # res = image.tobytes("hex", "rgb")
    pdf.add_image(ImageReader(image), 50, 690 - 200 - 60, 200, 200)
    pdf.save()
    # bytes.close()