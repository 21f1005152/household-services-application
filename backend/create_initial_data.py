from flask import current_app as app
from backend.models import Service, db, Role, User
from flask_security import SQLAlchemyUserDatastore, hash_password


def create_initial_services():
    services = [
        {
            "name": "Plumbing",
            "description": "Fix leaks, install pipes, and other plumbing services.",
            "base_price": 50.0
        },
        {
            "name": "Electrical",
            "description": "Electrical installations, repairs, and maintenance.",
            "base_price": 70.0
        },
        {
            "name": "Cleaning",
            "description": "Residential and commercial cleaning services.",
            "base_price": 40.0
        }
    ]
    
    for service_data in services:
        # Check if the service already exists
        service = Service.query.filter_by(name=service_data["name"]).first()
        if not service:
            # Create the service if it doesn't exist
            service = Service(
                name=service_data["name"],
                description=service_data["description"],
                base_price=service_data["base_price"]
            )
            db.session.add(service)
    
    db.session.commit()

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='admin', description='Administrator; only 1 allowed')
    userdatastore.find_or_create_role(name='customer', description='User; can be multiple; can request services')
    userdatastore.find_or_create_role(name='service_provider', description='Service-Provider; can be multiple; Responsible for providing the requested services')
    
    if(not userdatastore.find_user(email = 'admin@email.com')):
        userdatastore.create_user(email='admin@email.com', name='a', password=hash_password('pass'), roles=['admin'])
    if(not userdatastore.find_user(email = 'customer@email.com')):
        userdatastore.create_user(email='customer@email.com', name='b', password=hash_password('pass'), roles=['customer'])
    if(not userdatastore.find_user(email = 'provider@email.com')):
        userdatastore.create_user(email='provider@email.com', name='c', password=hash_password('pass'), roles=['service_provider'])
    
    create_initial_services()

    db.session.commit()