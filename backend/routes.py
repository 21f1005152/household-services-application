from flask import current_app as app, jsonify, request, render_template
from flask_login import current_user
from backend.models import Customer, Service, ServiceProfessional, db, Role, User
from flask_security import auth_required, verify_password, hash_password
from backend.models import db, User, Role


datastore = app.security.datastore

@app.get('/')   #used instead of app.route('/') so that only get method can use this.
def hello():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() #gets the data, initially in string format, and converts it to json format.
    email = data.get('email') #we use this instead of [] method because, in the block method if key is not present it will throw an error, but in this method it will return None.
    password = data.get('password')

    if(not email or not password):
        return jsonify({"message": "Email and password are required"}), 404

    user = datastore.find_user(email=email)
    if(not user):
        return jsonify({"message": "User not found"}), 404
    
    if verify_password(password, user.password):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "id":user.id}), 200

    return jsonify({"message": "password wrong"}), 404


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role')

    if(not email or not password or not name or not role in ['customer', 'service_provider']):
        return jsonify({"message": "All fields are required"}), 404

    if(datastore.find_user(email=email)):
        return jsonify({"message": "User already exists"}), 404

    try:
        datastore.create_user(email=email, name=name, password=hash_password(password), roles=[role], active=True)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 200
    
    except:
        db.session.rollback()
        return jsonify({"message": "Error creating user"}), 404
    


@app.route('/register/customer', methods=['POST'])
@auth_required('token')
def register_customer():
    data = request.get_json()

    phone = data.get('phone')
    address = data.get('address')
    city = data.get('city')
    pin_code = data.get('pin_code')

    if not phone or not address or not city or not pin_code:
        return jsonify({'message': 'All fields are required'}), 400

    if phone.isdigit() == False or len(phone) != 10:
        return jsonify({'message': 'Invalid phone number'}), 400
    
    if pin_code.isdigit() == False or len(pin_code) != 6:
        return jsonify({'message': 'Invalid pin code'}), 400

    if not current_user.has_role('customer'):
        return jsonify({'message': 'User is not authorized as a customer'}), 403

    user = User.query.get(current_user.id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not user.name or not user.email or not user.password:
        return jsonify({'message': 'User profile is incomplete'}), 400

    user.reg_info = True

    new_customer = Customer(
        user_id=current_user.id,
        phone=phone,
        address=address,
        city=city,
        pin_code=pin_code, 
        verified=True 
    )

    try:
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({'message': 'Customer profile updated'}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'An error has occurred'}), 500


@app.route('/register/service-professional', methods=['POST'])
@auth_required('token')
def register_service_professional():
    data = request.get_json()

    phone = data.get('phone')
    pin_code = data.get('pin_code')
    experience_years = data.get('experience_years')
    service_id = data.get('service_id')
    doc_link = data.get('doc_link')

    if not phone or not pin_code or not service_id:
        return jsonify({'message': 'Phone, Pin Code, and Service ID are required'}), 400

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({'message': 'Invalid phone number'}), 400

    if not pin_code.isdigit() or len(pin_code) != 6:
        return jsonify({'message': 'Invalid pin code'}), 400

    service = Service.query.get(service_id)
    if not service:
        return jsonify({'message': 'Invalid Service ID'}), 400

    if not current_user.has_role('service_provider'):
        return jsonify({'message': 'User is not authorized as a service professional'}), 403

    user = User.query.get(current_user.id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    user.reg_info = True

    existing_professional = ServiceProfessional.query.filter_by(user_id=current_user.id).first()
    if existing_professional:
        return jsonify({'message': 'User is already registered as a service professional'}), 400

    # Create new ServiceProfessional
    new_professional = ServiceProfessional(
        user_id=current_user.id,
        phone=phone,
        pin_code=pin_code,
        experience_years=experience_years,
        service_id=service_id,
        doc_link=doc_link,
        verified=False
    )

    try:
        db.session.add(new_professional)
        db.session.commit()
        return jsonify({'message': 'Service professional profile registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500



@app.route('/protected')
@auth_required()
def protected():
    return 'This is a protected route'


