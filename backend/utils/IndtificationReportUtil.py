from utils.base import create_letter_pdf
# from base import create_letter_pdf
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO

class IdentificationReportCreaterClass():
    def __init__(self, file_name, data, yuan_img_url, res_img_url):
        self.file_obj = create_letter_pdf(file_name)
        self.data = data
        self.yuan_img_url = yuan_img_url
        self.res_img_url = res_img_url
        self.__build_report()

    def __build_report(self):
        # self.file_obj.add_background_image('bg.png')
        self.file_obj.add_Tile('MRI 识别报告', self.file_obj.height, 24)
        print(self.file_obj.height)
        self.file_obj.height -= 30
        self.file_obj.add_paragraph('非常感谢你使用我们的MRI识别系统，结合Mamba块状卷积神经网络，我们为你提供了以下识别结果：', 50, self.file_obj.height)
        self.file_obj.height -= 10
        self.file_obj.add_Tile('识别结果', self.file_obj.height, 18)
        self.file_obj.add_Tile('recognition result', self.file_obj.height, 12)
        self.file_obj.height -= 10
        self.file_obj.add_image(self.yuan_img_url, 50, self.file_obj.height, 200, 200)
        self.file_obj.height += 200
        self.file_obj.add_image(self.res_img_url, 350, self.file_obj.height, 200, 200)
        self.file_obj.add_PIL_image(self.__create_bar_plot(), 300 - 100, self.file_obj.height, 200, 200)
        print(self.file_obj.height)
        self.file_obj.new_page()
        # self.file_obj.add_background_image('bg.png')
        key = 1
        for item in self.data:
            self.file_obj.add_text(f"{key}. {self.names_list[key - 1]}", 50, self.file_obj.height)
            self.file_obj.height -= 5
            self.file_obj.add_paragraph(item['info'], 50, self.file_obj.height)
            key += 1
        if key == 1:
            self.file_obj.add_text('没有识别到任何内容', 50, self.file_obj.height)
            self.file_obj.add_text('No content was recognized', 50, self.file_obj.height)

    def __create_bar_plot(self):
        plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
        plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号
        key = 1
        names = []
        for item in self.data:
            names.append(str(key) + "_" + item['name'])
            key += 1
        confidences = [item['conf'] for item in self.data]
        self.names_list = names
        plt.figure(figsize=(1 + 2 * len(names), 5))
        plt.bar(names, confidences, color='skyblue')

        plt.ylim(0, 100)
        plt.title('Confidence of Individuals')
        plt.xlabel('Name')
        plt.ylabel('Confidence')
        plt.savefig('confidence_bar_chart1.png')
        img = Image.open('confidence_bar_chart1.png')
        return img

    def generate(self):
        self.file_obj.save()

if __name__ == '__main__':
    yuan_img_url = '1.png'
    res_img_url = '2.png'
    data = [
        {
            'name': '张三',
            'conf':65.0,
            'info': '张三，男，1988年10月1日出生，身份证号码：110101198810010001'
        },
        {
            'name': '张三',
            'conf':60.0,
            'info': '张三，男，1988年10月1日出生，身份证号码：110101198810010001'
        }
    ]
    IdentificationReportCreaterClass('tmp\\report.pdf', data, yuan_img_url, res_img_url).generate()