from flask import Flask
from backend.config import LocalDevolopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from backend.resources import api

def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevolopmentConfig)
    db.init_app(app)

    api.init_app(app)
    #flask security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()
    return app

app = create_app()


import backend.create_initial_data
import backend.routes

if __name__ == '__main__':
    app.run()