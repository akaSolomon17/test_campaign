from common.constants.media import IMAGE_ALLOWED_EXTENSIONS
from PIL import Image


# from Pillow import Image
from io import BytesIO
import os

# def save_preview(_image):
#     try:
#         filename = photos.save(_image)
#         file_url = photos.url(filename)
#         return file_url
#     except:
#         return None

# Lấy đường dẫn thư mục hiện tại
current_directory = os.getcwd()

# Tạo đường dẫn cho thư mục lưu trữ ảnh tạm thời
temp_images_directory = os.path.join(current_directory, 'temp_images')

# Tạo thư mục nếu nó chưa tồn tại
if not os.path.exists(temp_images_directory):
    os.makedirs(temp_images_directory)

def save_preview(_image):
    try:
        img = Image.open(BytesIO(_image))
        # Xử lý ảnh ở đây (ví dụ: thay đổi kích thước, cắt, v.v.)
        file_url = os.path.join(temp_images_directory, 'image.jpg')
        img.save(file_url)
        return file_url  # Trả về đường dẫn tới ảnh đã lưu
    except Exception as e:
        print(f"Đã xảy ra lỗi: {e}")
        return None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGE_ALLOWED_EXTENSIONS

    
