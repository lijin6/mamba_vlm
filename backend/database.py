from flask_sqlalchemy import SQLAlchemy

# 创建 SQLAlchemy 实例
db = SQLAlchemy()

# 初始化数据库
def init_db(app):
    """
    初始化数据库配置。
    :param app: Flask 应用实例
    """
    db.init_app(app)  # 将数据库绑定到 Flask 应用
    with app.app_context():
        db.create_all()  # 创建所有表（如果不存在）