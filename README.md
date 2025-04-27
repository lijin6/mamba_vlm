# mamba_vlm
这个项目是基于 [Mamba-VLM](https://github.com/OpenGVLab/MambaVLM) 的多模态视觉语言模型，包括图像问答与报告生成功能。

---

```markdown
# Mamba-VLM

🚀 An open-source multi-modal visual-language model based on [Mamba](https://arxiv.org/abs/2312.00752).  
Supports image captioning, visual question answering (VQA), and image-based report generation.

## 🔧 Features

- 🔍 Visual Question Answering (VQA)
- 📝 Medical or Remote-Sensing Report Generation
- 🧠 Efficient inference using Mamba structured state-space model
- 📦 Modular & extensible architecture

## 🖼 Example

```bash
# Example: Ask a question about an image
python inference.py --image_path ./example.jpg --question "What is the main object in this image?"
```

## 📁 Project Structure

```
mamba_vlm/
├── models/            # Model architecture (Mamba encoder/decoder, vision encoder)
├── data/              # Dataset loading and preprocessing
├── scripts/           # Training / inference scripts
├── utils/             # Utility functions
├── checkpoints/       # Pretrained or fine-tuned weights
├── inference.py       # Main entrypoint for demo
└── README.md
```

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/lijin6/mamba_vlm.git
cd mamba_vlm
```

### 2. Create virtual environment and install dependencies

```bash
conda create -n mamba_vlm python=3.10 -y
conda activate mamba_vlm
pip install -r requirements.txt
```

### 3. Download or prepare model checkpoints

Put your model checkpoint (`.pt` or `.pth`) under `checkpoints/`.

### 4. Run Demo

```bash
python inference.py --image_path ./example.jpg --question "Describe the image."
```

## 📊 Datasets (Optional)

- [VQA v2](https://visualqa.org/)
- [MIMIC-CXR](https://physionet.org/content/mimic-cxr/2.0.0/)
- [RSICD](https://github.com/ucas-vg/RSICD_opt)

## 🧠 Model Details

The project combines:

- 🔵 **Mamba**: A linear-time state-space model for long-range sequence modeling.
- 🟠 **Vision Encoder**: Supports CLIP, BLIP, or ViT for visual feature extraction.
- 🔴 **Language Decoder**: Based on Mamba or LLaMA decoder blocks.

## 💡 TODO

- [ ] Upload pre-trained checkpoints
- [ ] Add training instructions
- [ ] Release web demo (Gradio / Flask)

## 📄 License

MIT License. See `LICENSE` for details.

---

### 👤 Author

Made with ❤️ by [lijin6](https://github.com/lijin6)
```
