from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin

db = SQLAlchemy()

# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(255), nullable=False)
#     email = db.Column(db.String(255), unique=True, nullable=False)
#     password = db.Column(db.String(255), nullable=False)
#     fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
#     reg_info = db.Column(db.Boolean, default=False)
#     active = db.Column(db.Boolean, default=True)
#     roles = db.relationship('Role', secondary='user_roles', backref='users')
#     customer_service_requests = db.relationship(
#         "ServiceRequest",
#         foreign_keys="[ServiceRequest.customer_id]",
#         back_populates="customer"
#     )
#     professional_service_requests = db.relationship(
#         "ServiceRequest",
#         foreign_keys="[ServiceRequest.professional_id]",
#         back_populates="professional"
#     )

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    reg_info = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', secondary='user_roles', backref='users')

    # Add explicit relationships for service requests
    customer_service_requests = db.relationship(
        "ServiceRequest",
        foreign_keys="[ServiceRequest.customer_id]",
        back_populates="customer"
    )
    professional_service_requests = db.relationship(
        "ServiceRequest",
        foreign_keys="[ServiceRequest.professional_id]",
        back_populates="professional"
    )

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    pin_code = db.Column(db.String, nullable=False)
    verified = db.Column(db.Boolean, default=True)
    # service_requests = db.relationship("ServiceRequest", back_populates="customer")

class Service(db.Model):
    __tablename__ = 'service'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    base_price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, default=1)

    service_requests = db.relationship("ServiceRequest", back_populates="service")

class ServiceProfessional(db.Model):
    __tablename__ = 'service_professionals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    phone = db.Column(db.String, nullable=False)
    pin_code = db.Column(db.String, nullable=False)
    experience_years = db.Column(db.Integer, nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    service_number = db.Column(db.Integer, nullable=False, default=0)  #number of services provided.
    verified = db.Column(db.Boolean, default=False)
    doc_link = db.Column(db.String, nullable=True)
    # service_requests = db.relationship("ServiceRequest", back_populates="professional")

# class ServiceRequest(db.Model):
#     __tablename__ = 'service_requests'
#     id = db.Column(db.Integer, primary_key=True)
#     service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
#     customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
#     professional_id = db.Column(db.Integer, db.ForeignKey('service_professionals.id'), nullable=True)
#     time_of_request = db.Column(db.DateTime, index=True, default=datetime.now())
#     status = db.Column(db.String(255), nullable=False, default='pending')
#     remarks = db.Column(db.Text, nullable=True)

#     service = db.relationship("Service", back_populates="service_requests")
#     customer = db.relationship(
#         "User",
#         foreign_keys=[customer_id],
#         back_populates="customer_service_requests"
#     )
#     professional = db.relationship(
#         "User",
#         foreign_keys=[professional_id],
#         back_populates="professional_service_requests"
#     )

class ServiceRequest(db.Model):
    __tablename__ = 'service_requests'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    time_of_request = db.Column(db.DateTime, index=True, default=datetime.now())
    status = db.Column(db.String(255), nullable=False, default='pending')
    remarks = db.Column(db.Text, nullable=True)
    
    service = db.relationship("Service", back_populates="service_requests")
    customer = db.relationship(
        "User",
        foreign_keys=[customer_id],
        back_populates="customer_service_requests"
    )
    professional = db.relationship(
        "User",
        foreign_keys=[professional_id],
        back_populates="professional_service_requests"
    )