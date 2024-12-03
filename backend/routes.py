import os
from flask import Blueprint, current_app as app, jsonify, request, render_template, send_file, send_from_directory
from flask_login import current_user
from sqlalchemy import func
from backend.models import Customer, Service, ServiceProfessional, ServiceRequest, db, Role, User
from flask_security import auth_required, verify_password, hash_password, roles_required
from backend.models import db, User, Role
from datetime import datetime, time
from backend.celery.tasks import add, create_csv
from celery.result import AsyncResult



datastore = app.security.datastore
cache = app.cache

@app.route('/cache')
@cache.cached(timeout=3)
def cache():
    return {'tine':str(datetime.utcnow())}

@app.route('/celery')
def celery():
    task = add.delay(1,2)
    return {'message':'Task added to queue', 'task_id':task.id}

@app.route('/celery/result/<task_id>')
def celery_result(task_id):
    result = AsyncResult(task_id)
    if result.ready():
        return {'status':result.status, 'result':result.result}
    else:
        return {'status':result.status}

@app.get('/create-csv')
def createCSV():
    task = create_csv.delay()
    return {'message':'Task added to queue', 'task_id':task.id}

@app.get('/get-csv/<id>')
def getCSV(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}', as_attachment=True)
    else:
        return {'message':'File not ready yet'}

    





@app.get('/')   #used instead of app.route('/') so that only get method can use this.
def hello():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"})

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User not found"})

    if not verify_password(password, user.password):
        return jsonify({"message": "Incorrect password"})

    if not user.active:
        return jsonify({"message": "Account is inactive. Please contact support."})

    role = user.roles[0].name if user.roles else None

    token = user.get_auth_token()
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "email": user.email,
        "role": role,
        "id": user.id
    })



@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role')
    
    phone = data.get('phone')
    address = data.get('address')
    city = data.get('city')
    pin_code = data.get('pin_code')
    experience_years = data.get('experience_years')
    service_id = data.get('service_id')
    doc_link = data.get('doc_link')

    if not email or not password or not name or role not in ['customer', 'service_provider']:
        return jsonify({"message": "All fields are required"})

    if datastore.find_user(email=email):
        return jsonify({"message": "User already exists"})

    try:
        user = datastore.create_user(
            email=email,
            name=name,
            password=hash_password(password),
            roles=[role],
            active=True
        )
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({"message": f"Error creating user"})

    if role == 'customer':
        if not phone or not address or not city or not pin_code:
            return jsonify({'message': 'All customer fields are required'})

        if not phone.isdigit() or len(phone) != 10:
            return jsonify({'message': 'Invalid phone number'})

        if not pin_code.isdigit() or len(pin_code) != 6:
            return jsonify({'message': 'Invalid pin code'})

        new_customer = Customer(user_id=user.id,phone=phone,address=address,city=city,pin_code=pin_code,verified=True)
        try:
            db.session.add(new_customer)
            db.session.commit()
            return jsonify({'message': 'Customer profile registered successfully'})
        except:
            db.session.rollback()
            return jsonify({'message': "Error registering customer"})

    elif role == 'service_provider':
        # Validation for service provider-specific fields
        if not phone or not pin_code or not service_id:
            return jsonify({'message': 'Phone, Pin Code, and Service ID are required'})

        if not phone.isdigit() or len(phone) != 10:
            return jsonify({'message': 'Invalid phone number'})

        if not pin_code.isdigit() or len(pin_code) != 6:
            return jsonify({'message': 'Invalid pin code'})

        service = Service.query.get(service_id)
        if not service:
            return jsonify({'message': 'Invalid Service ID'})

        user.active = False  # Deactivate user until verification
        # Create ServiceProfessional
        new_professional = ServiceProfessional(
            user_id=user.id,
            phone=phone,
            pin_code=pin_code,
            experience_years=experience_years,
            service_id=service_id,
            doc_link=doc_link,
            verified=False  # Default to false; change as per requirements
        )
        try:
            db.session.add(new_professional)
            db.session.commit()
            return jsonify({'message': 'Service professional profile registered successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f"Error registering service professional: {str(e)}"})


@app.route('/api/users/search', methods=['GET'])
@auth_required('token')
def search_users():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'message': 'Query parameter is required'})

    # Perform the search
    users = User.query.filter(
        (User.name.ilike(f'%{query}%')) | 
        (User.email.ilike(f'%{query}%'))
    ).all()

    return jsonify([user.to_dict() for user in users])


# @app.route('/api/stats', methods=['GET'])
# @auth_required('token')
# def stats():
#     # User roles distribution
#     user_roles = {
#         'admin': User.query.filter(User.roles.any(name='admin')).count(),
#         'customer': User.query.filter(User.roles.any(name='customer')).count(),
#         'serviceProvider': User.query.filter(User.roles.any(name='service_provider')).count(),
#     }

#     # Service requests by status
#     service_requests_by_status = {
#         'pending': ServiceRequest.query.filter_by(status='pending').count(),
#         'accepted': ServiceRequest.query.filter_by(status='accepted').count(),
#         'paid': ServiceRequest.query.filter_by(status='paid').count(),
#         'cancelled': ServiceRequest.query.filter_by(status='cancelleduser').count(),
#     }

#     # Monthly service requests
#     monthly_requests = ServiceRequest.query.with_entities(
#         func.strftime('%Y-%m', ServiceRequest.time_of_request).label('month'),
#         func.count(ServiceRequest.id).label('count')
#     ).group_by('month').all()

#     monthly_requests_data = {month: count for month, count in monthly_requests}

#     return jsonify({
#         'userRoles': user_roles,
#         'serviceRequestsByStatus': service_requests_by_status,
#         'monthlyServiceRequests': monthly_requests_data,
#     })

@app.route('/api/stats/user-roles', methods=['GET'])
def get_user_roles():
    roles = ['admin', 'customer', 'service_provider']
    data = {role: len(User.query.filter(User.roles.any(name=role)).all()) for role in roles}
    return jsonify(data)

@app.route('/api/stats/service-requests', methods=['GET'])
def get_service_requests():
    statuses = ['pending', 'accepted', 'paid']
    data = {status: ServiceRequest.query.filter_by(status=status).count() for status in statuses}
    return jsonify(data)

@app.route('/api/service-requests/<int:request_id>/rating', methods=['POST'])
@auth_required('token')
def update_rating(request_id):
    data = request.get_json()
    rating = data.get('ratings')
    if not rating or not (1 <= int(rating) <= 5):
        return {'message': 'Invalid rating. It must be between 1 and 5.'}, 400

    service_request = ServiceRequest.query.get(request_id)
    if not service_request:
        return {'message': 'Service request not found.'}, 404

    # Update the rating
    service_request.ratings = rating
    db.session.commit()
    return {'message': 'Rating updated successfully.'}
    

@app.route('/api/ratings/stats', methods=['GET'])
@auth_required('token')
def get_ratings_stats():
    ratings = db.session.query(
        ServiceRequest.rating, db.func.count(ServiceRequest.rating)
    ).filter(ServiceRequest.rating.isnot(None)).group_by(ServiceRequest.rating).all()

    stats = [{"rating": r[0], "count": r[1]} for r in ratings]
    return jsonify(stats)

@app.route('/protected')
@auth_required()
def protected():
    return 'This is a protected route'

@app.route('/api/service-requests/provider/accepted', methods=['GET'])
@auth_required('token')
def get_accepted_requests():
    try:
        # Ensure the user is a service provider
        if not current_user.has_role('service_provider'):
            return jsonify({'message': 'Unauthorized access'})

        # Fetch accepted requests for the current service provider
        accepted_requests = ServiceRequest.query.filter_by(
            professional_id=current_user.id,
            status='accepted'
        ).all()

        # Convert to dictionary format for JSON response
        response = []
        for request in accepted_requests:
            request_data = {
                'id': request.id,
                'remarks': request.remarks,
                'time_of_request': request.time_of_request,
                'status': request.status,
                'customer_id': request.customer_id,
            }
            response.append(request_data)

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)})
    
@app.route('/api/service-requests/provider/<int:request_id>/cancel', methods=['PUT'])
@auth_required('token')
def cancel_service_request(request_id):
    try:
        # Fetch the service request by ID
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return jsonify({'message': 'Service request not found'})

        # Ensure the current user is the assigned service provider
        if service_request.professional_id != current_user.id:
            return jsonify({'message': 'Unauthorized to cancel this request'})

        # Update the status to 'cancelledprovider'
        service_request.status = 'cancelledprovider'
        db.session.commit()

        return jsonify({'message': 'Service request cancelled successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred', 'error': str(e)})


@app.route('/api/service-requests/<int:request_id>/status', methods=['PUT'])
@auth_required('token')
def process_payment(request_id):
    # Fetch the service request
    service_request = ServiceRequest.query.get(request_id)
    if not service_request:
        return jsonify({'message': 'Service request not found'})

    # Ensure the user is authorized
    if service_request.customer_id != current_user.id:
        return jsonify({'message': 'Unauthorized access'})

    # Validate input
    data = request.json
    card_number = data.get('card_number')
    cvv = data.get('cvv')
    card_name = data.get('card_name')

    # if not card_number or not cvv or not card_name:
    #     return jsonify({'message': 'Incomplete payment details provided'})

    # if len(card_number) != 16 or not card_number.isdigit():
    #     return jsonify({'message': 'Invalid card number'})
    # if len(cvv) != 3 or not cvv.isdigit():
    #     return jsonify({'message': 'Invalid CVV'})

    # Mark the service request as paid
    service_request.status = 'paid'
    try:
        db.session.commit()
        return jsonify({'message': 'Payment successful'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error processing payment: {str(e)}'})
    



service_provider_api = Blueprint('service_provider_api', __name__)

@service_provider_api.route('/api/service-requests/provider/completed', methods=['GET'])
@auth_required('token')
def get_completed_service_requests():
    try:
        # Ensure the user is a service provider
        if not current_user.has_role('service_provider'):
            return jsonify({'message': 'Unauthorized access'}), 403

        # Fetch all completed (paid) service requests for the current service provider
        completed_requests = ServiceRequest.query.filter_by(
            professional_id=current_user.id,
            status='paid'
        ).all()

        # Format the response with additional details
        requests_data = []
        for request in completed_requests:
            service = Service.query.get(request.service_id)
            customer = User.query.get(request.customer_id)

            requests_data.append({
                'id': request.id,
                'service_id': request.service_id,
                'service_name': service.name if service else 'Unknown Service',
                'remarks': request.remarks,
                'time_of_request': request.time_of_request,
                'customer_id': request.customer_id,
                'customer': {
                    'name': customer.name if customer else 'N/A',
                    'email': customer.email if customer else 'N/A',
                    'customer_details': {
                        'phone': customer.customer_details.phone if customer and customer.customer_details else 'N/A',
                        'address': customer.customer_details.address if customer and customer.customer_details else 'N/A',
                    } if customer else None
                } if customer else None,
                'rating': request.rating  # Assuming `rating` is a field in the ServiceRequest model
            })

        return jsonify(requests_data), 200
    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500