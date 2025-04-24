import os

def rename_images_in_folder(folder_path, output_prefix="/bg_img"):
    # 获取文件夹中的所有文件
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    
    # 过滤出图片文件（可以根据需要扩展支持的图片格式）
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
    image_files = [f for f in files if os.path.splitext(f)[1].lower() in image_extensions]
    
    # 按文件名排序（确保顺序一致）
    image_files.sort()
    
    # 用于存储输出路径
    output_paths = []
    
    # 遍历图片文件并重命名
    for index, old_name in enumerate(image_files, start=1):
        # 构造新文件名
        new_name = f"image{index}.jpg"
        old_path = os.path.join(folder_path, old_name)
        new_path = os.path.join(folder_path, new_name)
        
        # 重命名文件
        os.rename(old_path, new_path)
        
        # 构造输出路径并添加到列表
        output_paths.append(f"{output_prefix}/{new_name}")
    
    # 打印输出路径
    for path in output_paths:
        print('"' + path + '",')

# 使用示例
if __name__ == "__main__":
    # 替换为你的目标文件夹路径
    folder_path = "./IndexImg"  # 当前目录下的 myImg 文件夹
    rename_images_in_folder(folder_path)