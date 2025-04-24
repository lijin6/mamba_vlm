from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from database import init_db, db
from models import RecognitionRecord
from utils.IndtificationReportUtil import IdentificationReportCreaterClass
import os
import cv2
import uuid
import json

app = Flask(__name__)
CORS(app)

# 设置保存图片的目录
UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"
REPORT_FOLDER = "tmp"

# 配置数据库 URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
init_db(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/processed/<filename>')
def processed_img(filename):
    # 检查文件是否存在
    try:
        return send_from_directory(PROCESSED_FOLDER, filename)
    except FileNotFoundError:
        abort(404)  # 如果文件不存在，返回 404 错误

@app.route('/reports/<filename>')
def download_pdf(filename):
    # 检查文件是否存在
    try:
        return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)  # 如果文件不存在，返回 404 错误

@app.route('/upload', methods=['POST'])
def upload_images():
    # 检查是否有文件上传
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files')  # 获取所有上传的文件
    if not files:
        return jsonify({"error": "No files found"}), 400

    processed_files = []  # 存储处理后的图片信息
    upload_images = []  # 存储上传的图片信息
    for file in files:
        # 生成唯一的文件名
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        # 保存原始图片
        file.save(upload_path)
        upload_images.append({"filename": file.filename, "path": upload_path})
        # 使用 OpenCV 处理图片
        image = cv2.imread(upload_path)
        if image is None:
            return jsonify({"error": f"Failed to read image: {file.filename}"}), 400

        # 在图片上写入 "Hello"
        cv2.putText(image, "Hello", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        # 保存处理后的图片
        processed_filename = "processed_" + unique_filename
        processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        cv2.imwrite(processed_path, image)

        # 构建文件的 URL（假设后端运行在 http://localhost:5000）
        file_url = f"http://localhost:5000/{PROCESSED_FOLDER}/{processed_filename}"
        processed_files.append({"filename": file.filename, "url": file_url})
    upload_images_dict = {index: value for index, value in enumerate(upload_images)}
    processed_files_dict = {index: value for index, value in enumerate(processed_files)}
    RecognitionRecord_item = RecognitionRecord(submitted_content=json.dumps(upload_images_dict), recognition_result=json.dumps(processed_files_dict))
    db.session.add(RecognitionRecord_item)
    db.session.commit()
    # 返回处理后的图片信息

    # 模拟PDF生成
    yuan_img_url = str(upload_images[0]["path"])
    res_img_url = str(processed_files[0]["url"].replace("http://localhost:5000/", ""))
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
    return jsonify({"processed_files": processed_files, "report_url": "http://localhost:5000/reports/report.pdf"}), 200

if __name__ == '__main__':
    app.run(debug=True)