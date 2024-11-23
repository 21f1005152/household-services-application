from dotenv import load_dotenv
import os


load_dotenv()

class config():
    DEBUG = False
    WTF_CSRF_ENABLED = False   #usually not disabled, but since different framework are used for frontend and backend, fe - js and be - js client(flask?)

    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')

    SECURITY_PASSWORD_HASH = os.getenv('SECURITY_PASSWORD_HASH')
    SECURITY_PASSWORD_SALT = os.getenv('SECURITY_PASSWORD_SALT')
    SECURITY_TOKEN_AUTHENTHICATION_HEADER = os.getenv('SECURITY_TOKEN_AUTHENTHICATION_TOKEN')

class LocalDevolopmentConfig(config):
    DEBUG = True



