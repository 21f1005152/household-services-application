from flask import Flask
from backend.config import LocalDevolopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_caching import Cache
from backend.celery.celery_factory import celery_init_app
import flask_excel as excel



def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevolopmentConfig)
    db.init_app(app)
    cache = Cache(app)
    
    #flask security
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.cache = cache
    app.app_context().push()

    from backend.resources import api
    api.init_app(app)
    return app

app = create_app()

celery_app = celery_init_app(app)

import backend.create_initial_data
import backend.routes


excel.init_excel(app)
if __name__ == '__main__':
    app.run()



# def create_app():
#     app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
#     app.config.from_object(LocalDevolopmentConfig)
#     db.init_app(app)
#     cache = Cache(app)
    
#     # Flask-Security
#     datastore = SQLAlchemyUserDatastore(db, User, Role)
#     app.security = Security(app, datastore=datastore, register_blueprint=False)
#     app.cache = cache
#     app.app_context().push()

#     # Flask-Excel
#     excel.init_excel(app)

#     # Flask-RESTful API
#     from backend.resources import api
#     api.init_app(app)

#     return app

# app = create_app()

# celery_app = celery_init_app(app)

# import backend.create_initial_data
# import backend.routes

# if __name__ == '__main__':
#     app.run()