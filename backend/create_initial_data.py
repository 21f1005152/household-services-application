from flask import current_app as app
from backend.models import db, Role, User
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='admin', description='Administrator; only 1 allowed')
    userdatastore.find_or_create_role(name='customer', description='User; can be multiple; can request services')
    userdatastore.find_or_create_role(name='service_provider', description='Service-Provider; can be multiple; Responsible for providing the requested services')
    
    if(not userdatastore.find_user(email = 'admin@email.com')):
        userdatastore.create_user(email='admin@email.com', name='a', password=hash_password('password'), roles=['admin'])
    if(not userdatastore.find_user(email = 'user@email.com')):
        userdatastore.create_user(email='user@email.com', name='b', password=hash_password('password'), roles=['customer'])
    if(not userdatastore.find_user(email = 'provider@email.com')):
        userdatastore.create_user(email='provider@email.com', name='c', password=hash_password('password'), roles=['service_provider'])
    
    db.session.commit()