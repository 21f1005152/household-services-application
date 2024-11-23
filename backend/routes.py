from flask import current_app as app, jsonify, request, render_template
from backend.models import db, Role, User
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



@app.route('/protected')
@auth_required()
def protected():
    return 'This is a protected route'


