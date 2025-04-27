from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from database import init_db, db
from models import RecognitionRecord
from utils.IndtificationReportUtil import IdentificationReportCreaterClass
import os
import cv2
import uuid
import json
import nibabel as nib  # For handling .nii.gz medical images
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import os
import numpy as np
import nibabel as nib
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

# 设置保存图片的目录
UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed"
REPORT_FOLDER = "tmp"
MEDICAL_UPLOAD_FOLDER = "medical_uploads"
MEDICAL_PROCESSED_FOLDER = "medical_processed"

# 配置数据库 URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
init_db(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(MEDICAL_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MEDICAL_PROCESSED_FOLDER, exist_ok=True)


UPLOAD_FOLDER = 'uploads'
OUTPUT_DIR = 'outputs'
ALLOWED_EXTENSIONS = {'nii', 'gz', 'nii.gz'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --------------------------- 工具函数 ---------------------------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/outputs/<path:filename>')
def serve_output_file(filename):
    return send_from_directory('outputs', filename)

def load_nifti(path):
    img = nib.load(path)
    return img.get_fdata(), img

def process_image(ct_data, seg_data, ct_img, basename, best_slice):
    # 提取最佳切片
    ct_slice = ct_data[:, :, best_slice].T
    seg_slice = seg_data[:, :, best_slice].T
    voxel_spacing = ct_img.header.get_zooms()

    # 器官映射和颜色
    organ_labels = {
        1: "Liver", 2: "Right Kidney", 3: "Spleen", 4: "Pancreas", 5: "Aorta",
        6: "IVC", 7: "Right Adrenal", 8: "Left Adrenal", 9: "Gallbladder",
        10: "Esophagus", 11: "Stomach", 12: "Duodenum", 13: "Left Kidney"
    }
    organ_colors = {
        0: [0, 0, 0, 0], 1: [0, 1, 0, 0.6], 2: [1, 0, 0, 0.6], 3: [1, 1, 0, 0.6],
        4: [0, 0, 1, 0.6], 5: [1, 0, 1, 0.8], 6: [0, 1, 1, 0.6], 7: [1, 0.5, 0, 0.6],
        8: [0.5, 0, 0.5, 0.6], 9: [1, 0.75, 0.8, 0.6], 10: [0.5, 0.5, 0.5, 0.6],
        11: [0, 0.5, 0, 0.6], 12: [0.5, 0, 0, 0.6], 13: [0, 0, 0.5, 0.6]
    }
    cmap = ListedColormap([organ_colors[i] for i in range(14)])

    # -------- 原始图像 --------
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(10, 10), dpi=300)
    ax.imshow(ct_slice, cmap='gray', vmin=-100, vmax=300)
    ax.set_title(f"{basename} - Slice {best_slice} (Original)", color='white')
    ax.axis('off')
    original_image_path = os.path.join(OUTPUT_DIR, f"{basename}_original.png")
    plt.savefig(original_image_path, dpi=300, bbox_inches='tight', facecolor='black')
    plt.close()

    # -------- 叠加图像 --------
    fig, ax = plt.subplots(figsize=(10, 10), dpi=300)
    ax.imshow(ct_slice, cmap='gray', vmin=-100, vmax=300)
    colored_mask = np.zeros((*seg_slice.shape, 4))
    for label, color in organ_colors.items():
        colored_mask[seg_slice == label] = color
    ax.imshow(colored_mask, interpolation='nearest')
    ax.set_title(f"{basename} - Overlay", color='white')
    ax.axis('off')
    overlay_image_path = os.path.join(OUTPUT_DIR, f"{basename}_overlay.png")
    plt.savefig(overlay_image_path, dpi=300, bbox_inches='tight', facecolor='black')
    plt.close()

    return original_image_path, overlay_image_path

# --------------------------- 路由处理 ---------------------------
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        # 保存上传的文件
        filename = secure_filename(file.filename)
        ct_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(ct_path)
        
        # 获取对应的标签文件路径
        basename = os.path.basename(ct_path).replace("_0000.nii.gz", "")
        seg_path = os.path.join("labelsTr", f"{basename}.nii.gz")
        
        if not os.path.exists(seg_path):
            return jsonify({"error": "No corresponding label file found"}), 404
        
        # 加载数据
        ct_data, ct_img = load_nifti(ct_path)
        seg_data, _ = load_nifti(seg_path)
        
        # 取最佳切片（标签最多的）
        organ_voxels = np.sum(seg_data > 0, axis=(0, 1))
        best_slice = np.argmax(organ_voxels)
        
        # 处理图像并获取路径
        original_image, overlay_image = process_image(ct_data, seg_data, ct_img, basename, best_slice)
        
        # 确保图像保存路径正确
        original_image_path = f"/outputs/{os.path.basename(original_image)}"
        overlay_image_path = f"/outputs/{os.path.basename(overlay_image)}"
        
        # 返回图像路径
        return jsonify({
            "original_image": original_image_path,
            "overlay_image": overlay_image_path
        })
    return jsonify({"error": "Invalid file format"}), 400


@app.route('/processed/<filename>')
def processed_img(filename):
    try:
        return send_from_directory(PROCESSED_FOLDER, filename)
    except FileNotFoundError:
        abort(404)

@app.route('/reports/<filename>')
def download_pdf(filename):
    try:
        return send_from_directory(REPORT_FOLDER, filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

@app.route('/upload', methods=['POST'])
def upload_images():
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files found"}), 400

    processed_files = []
    upload_images = []
    for file in files:
        unique_filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        upload_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(upload_path)
        upload_images.append({"filename": file.filename, "path": upload_path})

        image = cv2.imread(upload_path)
        if image is None:
            return jsonify({"error": f"Failed to read image: {file.filename}"}), 400

        cv2.putText(image, "Hello", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        processed_filename = "processed_" + unique_filename
        processed_path = os.path.join(PROCESSED_FOLDER, processed_filename)
        cv2.imwrite(processed_path, image)

        file_url = f"http://localhost:5000/{PROCESSED_FOLDER}/{processed_filename}"
        processed_files.append({"filename": file.filename, "url": file_url})
    
    upload_images_dict = {index: value for index, value in enumerate(upload_images)}
    processed_files_dict = {index: value for index, value in enumerate(processed_files)}
    RecognitionRecord_item = RecognitionRecord(submitted_content=json.dumps(upload_images_dict), recognition_result=json.dumps(processed_files_dict))
    db.session.add(RecognitionRecord_item)
    db.session.commit()

    yuan_img_url = str(upload_images[0]["path"])
    res_img_url = str(processed_files[0]["url"].replace("http://localhost:5000/", ""))
    data = [
        {'name': '张三', 'conf': 65.0, 'info': '张三，男，1988年10月1日出生，身份证号码：110101198810010001'},
        {'name': '张三', 'conf': 60.0, 'info': '张三，男，1988年10月1日出生，身份证号码：110101198810010001'}
    ]
    IdentificationReportCreaterClass('tmp\\report.pdf', data, yuan_img_url, res_img_url).generate()

    return jsonify({"processed_files": processed_files, "report_url": "http://localhost:5000/reports/report.pdf"}), 200

@app.route('/upload_medical', methods=['POST'])
def upload_medical_image():
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files found"}), 400

    processed_files = []
    upload_images = []
    for file in files:
        if not file.filename.endswith('.nii.gz'):
            return jsonify({"error": "Only .nii.gz files are allowed"}), 400

        # Generate unique filename
        unique_filename = str(uuid.uuid4()) + '.nii.gz'
        upload_path = os.path.join(MEDICAL_UPLOAD_FOLDER, unique_filename)
        file.save(upload_path)
        upload_images.append({"filename": file.filename, "path": upload_path})

        # Load and process the NIfTI medical image file
        try:
            nifti_img = nib.load(upload_path)
            img_data = nifti_img.get_fdata()

            # You can process the img_data here, for example, apply image processing techniques
            # For now, just saving the processed file as a placeholder
            processed_filename = "processed_" + unique_filename
            processed_path = os.path.join(MEDICAL_PROCESSED_FOLDER, processed_filename)

            # Save the processed NIfTI file
            nib.save(nib.Nifti1Image(img_data, nifti_img.affine), processed_path)

            file_url = f"http://localhost:5000/{MEDICAL_PROCESSED_FOLDER}/{processed_filename}"
            processed_files.append({"filename": file.filename, "url": file_url})
        except Exception as e:
            return jsonify({"error": f"Failed to process NIfTI file: {e}"}), 400
    
    return jsonify({"processed_files": processed_files}), 200





# import openai
from openai import OpenAI
from functools import wraps 

client = OpenAI(api_key="sk-3eeb7df80233438597b6f2c018265611", base_url="https://api.deepseek.com")


# Simulated findings and suggestions
mock_findings = [
    "前列腺体积略大，形态不规则",
    "中央区见斑片状低信号区",
    "周边区显示一异常高信号结节",
    "前列腺体积正常，边缘平滑",
    "观察到疑似局灶性病灶，信号略高",
]

mock_suggestions = [
    "请生成详细影像学检查报告，并给出诊断建议。",
    "请评估此影像表现可能的病理情况。",
    "结合影像所见，生成专业报告以供医生参考。",
]
# Decorators
def handle_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}", exc_info=True)
            return jsonify({
                "status": "error",
                "message": "Internal server error",
                "details": str(e)
            }), 500
    return wrapper

def validate_api_key(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not client.api_key or client.api_key == "default-api-key":
            return jsonify({
                "status": "error",
                "message": "API key not properly configured"
            }), 500
        return f(*args, **kwargs)
    return wrapper

def validate_json_content(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return jsonify({
                "status": "error",
                "message": "Request must be JSON"
            }), 400
        return f(*args, **kwargs)
    return wrapper

# Routes
@app.route('/generate_report', methods=['POST'])
@validate_json_content
@validate_api_key
@handle_errors
def generate_report():
    """
    Generate a medical report based on findings
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({
                "status": "error",
                "message": "No data provided"
            }), 400
        
        # Get parameters with defaults
        finding = data.get('finding', random.choice(MEDICAL_FINDINGS))
        suggestion = data.get('suggestion', random.choice(MEDICAL_SUGGESTIONS))
        file_path = data.get('file_path')  # Use this if you need to process the file
        
        logger.info(f"Generating report for finding: {finding[:50]}...")
        
        # Generate the medical report
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一名医学影像分析专家，擅长生成前列腺核磁共振检查报告。"},
                {"role": "user", "content": f"影像所见：{finding}。\n{suggestion}"}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        if not response.choices:
            raise ValueError("Empty response from AI model")
        
        return jsonify({
            "status": "success",
            "data": {
                "finding": finding,
                "suggestion": suggestion,
                "generated_report": response.choices[0].message.content,
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                } if hasattr(response, 'usage') else None
            }
        })
        
    except Exception as e:
        logger.error(f"Report generation failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to generate report",
            "error": str(e)
        }), 500
@app.route('/health', methods=['GET'])
def health_check():
    """Service health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Medical Report Generator",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    app.run(host='0.0.0.0', port=port, debug=debug)
