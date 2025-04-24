from datetime import datetime
from database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class RecognitionRecord(db.Model):
    __tablename__ = 'recognition_records'

    id = db.Column(db.Integer, primary_key=True)  # 主键
    submitted_content = db.Column(db.Text, nullable=False)  # 提交内容
    recognition_result = db.Column(db.Text, nullable=True)  # 识别结果
    created_at = db.Column(db.DateTime, default=datetime.utcnow())  # 创建时间，默认为当前时间
    tag = db.Column(db.String(50), nullable=True)  # 标签（可选）

    def __repr__(self):
        # 返回RecognitionRecord对象的字符串表示，包括id和submitted_content属性
        return f'<RecognitionRecord {self.id}: {self.submitted_content}>'