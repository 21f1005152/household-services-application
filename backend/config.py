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
    WTF_CSRF_ENABLED = False 
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "1234567"
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'thisisasecretsalt'
    SECURITY_TOKEN_AUTHENTHICATION_HEADER = 'Authentication-Token'
    CACHE_TYPE = 'RedisCache'
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379



