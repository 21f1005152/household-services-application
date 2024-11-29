from flask import current_app as app
from backend.models import Service, db, Role, User, Customer, ServiceProfessional
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


def create_user_with_role(userdatastore, email, name, password, roles):
    user = userdatastore.find_user(email=email)
    if not user:
        user = userdatastore.create_user(email=email, name=name, password=hash_password(password), roles=roles)
        db.session.commit()  # Ensure the user is committed before creating related instances

        # Create Customer or ServiceProfessional based on the role
        if 'customer' in roles:
            customer = Customer(user_id=user.id, phone="1234567890", address="123 Main St", city="City", pin_code="123456", verified=True)
            db.session.add(customer)
        elif 'service_provider' in roles:
            service_provider = ServiceProfessional(user_id=user.id, phone="0987654321", pin_code="654321", experience_years=5, service_number=0, service_id=1, verified=False, doc_link="http://example.com/doc")
            db.session.add(service_provider)
        db.session.commit()


with app.app_context():
    db.create_all()

    userdatastore: SQLAlchemyUserDatastore = app.security.datastore

    # Create roles if they don't exist
    userdatastore.find_or_create_role(name='admin', description='Administrator; only 1 allowed')
    userdatastore.find_or_create_role(name='customer', description='User; can be multiple; can request services')
    userdatastore.find_or_create_role(name='service_provider', description='Service-Provider; can be multiple; Responsible for providing the requested services')

    # Create users with roles
    create_user_with_role(userdatastore, 'admin@email.com', 'a', 'pass', ['admin'])
    create_user_with_role(userdatastore, 'customer@email.com', 'b', 'pass', ['customer'])
    create_user_with_role(userdatastore, 'provider@email.com', 'c', 'pass', ['service_provider'])

    # Create initial services
    create_initial_services()

    db.session.commit()