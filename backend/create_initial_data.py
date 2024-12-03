# from flask import current_app as app
# from backend.models import Service, db, Role, User, Customer, ServiceProfessional
# from flask_security import SQLAlchemyUserDatastore, hash_password


# def create_initial_services():
#     services = [
#         {
#             "name": "Plumbing",
#             "description": "Fix leaks, install pipes, and other plumbing services.",
#             "base_price": 50.0
#         },
#         {
#             "name": "Electrical",
#             "description": "Electrical installations, repairs, and maintenance.",
#             "base_price": 70.0
#         },
#         {
#             "name": "Cleaning",
#             "description": "Residential and commercial cleaning services.",
#             "base_price": 40.0
#         }
#     ]
    
#     for service_data in services:
#         # Check if the service already exists
#         service = Service.query.filter_by(name=service_data["name"]).first()
#         if not service:
#             # Create the service if it doesn't exist
#             service = Service(
#                 name=service_data["name"],
#                 description=service_data["description"],
#                 base_price=service_data["base_price"]
#             )
#             db.session.add(service)
    
#     db.session.commit()


# def create_user_with_role(userdatastore, email, name, password, roles):
#     user = userdatastore.find_user(email=email)
#     if not user:
#         user = userdatastore.create_user(email=email, name=name, password=hash_password(password), roles=roles)
#         db.session.commit()  # Ensure the user is committed before creating related instances

#         # Create Customer or ServiceProfessional based on the role
#         if 'customer' in roles:
#             customer = Customer(user_id=user.id, phone="1234567890", address="123 Main St", city="City", pin_code="123456", verified=True)
#             db.session.add(customer)
#         elif 'service_provider' in roles:
#             service_provider = ServiceProfessional(user_id=user.id, phone="0987654321", pin_code="654321", experience_years=5, service_number=0, service_id=1, verified=False, doc_link="http://example.com/doc")
#             db.session.add(service_provider)
#         db.session.commit()


# with app.app_context():
#     db.create_all()

#     userdatastore: SQLAlchemyUserDatastore = app.security.datastore

#     # Create roles if they don't exist
#     userdatastore.find_or_create_role(name='admin', description='Administrator; only 1 allowed')
#     userdatastore.find_or_create_role(name='customer', description='User; can be multiple; can request services')
#     userdatastore.find_or_create_role(name='service_provider', description='Service-Provider; can be multiple; Responsible for providing the requested services')

#     # Create users with roles
#     create_user_with_role(userdatastore, 'admin@email.com', 'a', 'pass', ['admin'])
#     create_user_with_role(userdatastore, 'customer@email.com', 'b', 'pass', ['customer'])
#     create_user_with_role(userdatastore, 'provider@email.com', 'c', 'pass', ['service_provider'])

#     # Create initial services
#     create_initial_services()

#     db.session.commit()


from flask import current_app as app
from backend.models import Service, db, Role, User, Customer, ServiceProfessional, ServiceRequest
from flask_security import SQLAlchemyUserDatastore, hash_password
from random import choice, randint
from datetime import datetime, timedelta


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
        service = Service.query.filter_by(name=service_data["name"]).first()
        if not service:
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
        db.session.commit()

        if 'customer' in roles:
            customer = Customer(user_id=user.id, phone="9" + str(randint(100000000, 999999999)), address="123 Main St", city="Mumbai", pin_code="400001", verified=True)
            db.session.add(customer)
        elif 'service_provider' in roles:
            service_id = randint(1, 3)  # Randomly assign service ID
            service_provider = ServiceProfessional(user_id=user.id, phone="9" + str(randint(100000000, 999999999)), pin_code="400002", experience_years=randint(1, 10), service_number=0, service_id=service_id, verified=True, doc_link="http://example.com/doc")
            db.session.add(service_provider)
        db.session.commit()


def create_service_requests():
    customers = Customer.query.all()
    service_providers = ServiceProfessional.query.all()
    statuses = ["paid", "accepted", "pending", "cancelled"]

    remarks_list = [
        "Urgent repair required.",
        "Follow-up needed.",
        "Quick response expected.",
        "Customer awaiting confirmation.",
        "Pending payment verification.",
        "Service scheduled successfully.",
        "Delay in service delivery.",
        "Request cancelled by customer.",
        "Work completed on time.",
        "Feedback pending."
    ]

    for i in range(10):  # Create 10 service requests
        customer = choice(customers)
        service_provider = choice(service_providers)
        service = Service.query.get(service_provider.service_id)

        if not service:
            continue

        status = choice(statuses)
        time_of_request = datetime.now() - timedelta(days=randint(1, 30))

        request = ServiceRequest(
            service_id=service.id,
            customer_id=customer.user_id,
            professional_id=service_provider.user_id,
            time_of_request=time_of_request,
            status=status,
            remarks=choice(remarks_list)
        )
        db.session.add(request)

    db.session.commit()


with app.app_context():
    db.create_all()

    userdatastore: SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name='admin', description='Administrator; only 1 allowed')
    userdatastore.find_or_create_role(name='customer', description='User; can be multiple; can request services')
    userdatastore.find_or_create_role(name='service_provider', description='Service-Provider; can be multiple; Responsible for providing the requested services')

    create_user_with_role(userdatastore, 'admin@email.com', 'Rajesh Kumar', 'pass', ['admin'])

    customer_names = ["Amit Sharma", "Sunita Verma", "Ravi Patel", "Priya Singh", "Neha Kapoor"]
    for name in customer_names:
        email = f"{name.split()[0].lower()}@customer.com"
        create_user_with_role(userdatastore, email, name, 'pass', ['customer'])

    provider_names = ["Suresh Yadav", "Meena Desai", "Arjun Nair"]
    for name in provider_names:
        email = f"{name.split()[0].lower()}@service.com"
        create_user_with_role(userdatastore, email, name, 'pass', ['service_provider'])


    create_initial_services()

    create_service_requests()

    db.session.commit()