from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from datetime import datetime
from backend.models import ServiceRequest, db, Service, User, Customer, ServiceProfessional
from flask_security import auth_required, current_user


api = Api(prefix='/api')

from flask_restful import fields

service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,  
    'base_price': fields.Float,
}

class ServiceAPI(Resource):
    @marshal_with(service_fields)
    # @auth_required('token')
    def get(self, id):
        service = Service.query.get(id)
        if not service:
            return jsonify({'message': 'Service not found'}), 404
        return service

    @auth_required('token')
    def delete(self, id):
        service = Service.query.get(id)
        if not service:
            # Return a JSON response for "Service not found"
            return jsonify({'message': 'Service not found'})
        
        if service.user_id != current_user.id:
            # Return a JSON response for "Permission denied"
            return jsonify({'message': 'You do not have permission to delete this service'})
        
        try:
            db.session.delete(service)
            db.session.commit()
            return jsonify({'message': 'Service deleted successfully'})
        except Exception as e:
            db.session.rollback()
            # Return error message as JSON
            # return jsonify({'message': f'Error deleting service: {str(e)}'})
    
    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        service = Service.query.get(id)
        if not service:
            return jsonify({'message': 'Service not found'})

        # Check if the current user owns the service
        if service.user_id != current_user.id:
            return jsonify({'message': 'You do not have permission to update this service'})

        # Update service fields
        service.name = data.get('name', service.name)
        service.description = data.get('description', service.description)
        service.base_price = data.get('base_price', service.base_price)
        
        try:
            db.session.commit()
            return jsonify({"message": "Service updated successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error updating service: {str(e)}'})

class ServiceListAPI(Resource):
    @marshal_with(service_fields)
    def get(self):
        try:
            services = Service.query.all()
            return services
        except Exception as e:
            return jsonify({'message': f'Error fetching services: {str(e)}'})

    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        base_price = data.get('base_price')

        # Validate required fields
        if not name or not description or not base_price:
            return jsonify({'message': 'All fields are required'})

        # Check user permissions
        if current_user.id != 1:  # Replace with your admin logic if needed
            return jsonify({'message': 'You do not have permission to create this service'})
        
        # Create the service
        service = Service(name=name, description=description, base_price=base_price)
        try:
            db.session.add(service)
            db.session.commit()
            return jsonify({"message": "Service created successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Error creating service: {str(e)}'})

service_request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'time_of_request': fields.DateTime,
    'status': fields.String,
    'remarks': fields.String,
    'ratings': fields.Integer,
}

class ServiceRequestAPI(Resource):
    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self, id):
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}
        return service_request

    @auth_required('token')
    def delete(self, id):
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}

        if service_request.customer_id != current_user.id and not current_user.has_role('admin'):
            return {'message': 'You do not have permission to delete this service request'}

        try:
            db.session.delete(service_request)
            db.session.commit()
            return {"message": "Service request deleted successfully"}
        except:
            db.session.rollback()
            return {'message': 'An error occurred while deleting the service request'}

    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}

        if service_request.customer_id != current_user.id:
            return {'message': 'You do not have permission to update this service request'}
        
        if not Service.query.get(data.get('service_id')):
            return {'message': 'Service not found'}

        # service_request.service_id != data.get('service_id') and

        service_request.service_id = data.get('service_id', service_request.service_id)
        service_request.remarks = data.get('remarks', service_request.remarks)
        service_request.status = 'pending'
        service_request.professional_id = None        


        try:
            db.session.commit()
            return {"message": "Service request updated successfully"}
        except:
            db.session.rollback()
            return {'message': 'An error occurred while updating the service request'}

class ServiceRequestListAPI(Resource):
    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self):
        # Admin can view all, others can only view their own requests
        if current_user.has_role('admin'):
            service_requests = ServiceRequest.query.all()
        else:
            service_requests = ServiceRequest.query.filter_by(customer_id=current_user.id).all()
        return service_requests

    @auth_required('token')
    def post(self):
        data = request.get_json()
        service_id = data.get('service_id')
        remarks = data.get('remarks')

        if not service_id or not remarks:
            return {'message': 'All fields are required'}

        if not Service.query.get(service_id):
            return {'message': 'Service not found'}

        service_request = ServiceRequest(
            service_id=data['service_id'],
            customer_id=current_user.id,
            time_of_request=datetime.utcnow(),
            remarks=data.get('remarks'),
        )

        try:
            db.session.add(service_request)
            db.session.commit()
            return {"message": "Service request created successfully"}
        except:
            db.session.rollback()
            return {'message': 'An error occurred while creating the service request'}

api.add_resource(ServiceAPI, '/services/<int:id>')
api.add_resource(ServiceListAPI, '/services')
api.add_resource(ServiceRequestAPI, '/service-requests/<int:id>')
api.add_resource(ServiceRequestListAPI, '/service-requests')


customer_fields = {
    'phone': fields.String,
    'address': fields.String,
    'city': fields.String,
    'pin_code': fields.String,
    'verified': fields.Boolean,
}

service_provider_fields = {
    'phone': fields.String,
    'pin_code': fields.String,
    'experience_years': fields.Integer,
    'service_number': fields.Integer,
    'service_id': fields.Integer,
    'verified': fields.Boolean,
    'doc_link': fields.String,
}

user_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
    'roles': fields.List(fields.String(attribute='name')),
    'customer_details': fields.Nested(customer_fields, allow_null=True),
    'service_provider_details': fields.Nested(service_provider_fields, allow_null=True),
}

class FlagUnflagUsers(Resource):
    def put(self, user_id):
       
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        # Toggle the current active state
        user.active = not user.active
        try:
            db.session.commit()
            return {"message": f"User active state updated to {user.active}"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}, 500

api.add_resource(FlagUnflagUsers, '/users/<int:user_id>/flag-unflag')

class UserListAPI(Resource):
    @marshal_with(user_fields)
    def get(self):
        users = User.query.filter(~User.roles.any(name='admin')).all()
        user_list = []
        for user in users:
            customer = Customer.query.filter_by(user_id=user.id).first()
            service_provider = ServiceProfessional.query.filter_by(user_id=user.id).first()

            user_data = {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'active': user.active,
                'roles': user.roles,  
                'customer_details': customer,  
                'service_provider_details': service_provider, 
            }
            user_list.append(user_data)
        return user_list

api.add_resource(UserListAPI, '/users')

class VerifyServiceProviderAPI(Resource):
    # @auth_required('token')
    def put(self, user_id):
        print(f"Verifying service provider with user_id: {user_id}")  # Debug log

        # Find the service provider entry
        service_provider = ServiceProfessional.query.filter_by(user_id=user_id).first()

        if not service_provider:
            print("Service provider not found.")  # Debug log
            return {'message': 'Service provider not found'}

        # Check if the service provider is already verified
        if service_provider.verified:
            print("Service provider is already verified.")  # Debug log
            return {'message': 'Service provider is already verified'}

        # Update the verified status
        service_provider.verified = True
        try:
            db.session.commit()
            print("Service provider verified successfully.")  # Debug log
            return {'message': 'Service provider verified successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error verifying service provider: {str(e)}")  # Debug log
            return {'message': f'An error occurred: {str(e)}'}

api.add_resource(VerifyServiceProviderAPI, '/users/<int:user_id>/verify')

class UserProfileAPI(Resource):
    @auth_required('token')
    def get(self, id):
        # Fetch the user by ID
        user = User.query.get(id)
        if not user:
            return jsonify({'message': 'User not found'})

        # Ensure the authenticated user is requesting their own profile
        # if current_user.id != id:
        #     return jsonify({'message': 'Unauthorized access'})

        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'roles': [role.name for role in user.roles],
            'customer_details': None,
            'service_provider_details': None,
        }

        # Include customer details if the user is a customer
        if user.has_role('customer'):
            customer = Customer.query.filter_by(user_id=user.id).first()
            if customer:
                user_data['customer_details'] = {
                    'phone': customer.phone,
                    'address': customer.address,
                    'city': customer.city,
                    'pin_code': customer.pin_code,
                    'verified': customer.verified,
                }

        # Include service provider details if the user is a service provider
        if user.has_role('service_provider'):
            service_provider = ServiceProfessional.query.filter_by(user_id=user.id).first()
            if service_provider:
                user_data['service_provider_details'] = {
                    'phone': service_provider.phone,
                    'pin_code': service_provider.pin_code,
                    'experience_years': service_provider.experience_years,
                    'service_number': service_provider.service_number,
                    'service_id': service_provider.service_id,
                    'verified': service_provider.verified,
                    'doc_link': service_provider.doc_link,
                }

        return jsonify(user_data)

# Add this API endpoint to your routes
api.add_resource(UserProfileAPI, '/users/<int:id>')


class UpdateUserDetailsAPI(Resource):
    @auth_required('token')
    def put(self):
        user = current_user
        if not user:
            return jsonify({'message': 'User not found'})

        data = request.get_json()

        # Update customer details if the user has the 'customer' role
        if user.has_role('customer'):
            customer = Customer.query.filter_by(user_id=user.id).first()
            if not customer:
                return jsonify({'message': 'Customer details not found'})

            customer.phone = data.get('phone', customer.phone)
            customer.address = data.get('address', customer.address)
            customer.city = data.get('city', customer.city)
            customer.pin_code = data.get('pin_code', customer.pin_code)

        # Update service provider details if the user has the 'service_provider' role
        elif user.has_role('service_provider'):
            service_provider = ServiceProfessional.query.filter_by(user_id=user.id).first()
            if not service_provider:
                return jsonify({'message': 'Service provider details not found'})

            service_provider.phone = data.get('phone', service_provider.phone)
            service_provider.pin_code = data.get('pin_code', service_provider.pin_code)
            service_provider.experience_years = data.get('experience_years', service_provider.experience_years)
            service_provider.doc_link = data.get('doc_link', service_provider.doc_link)

        else:
            return jsonify({'message': 'User role not supported for updates'})

        # Commit changes to the database
        try:
            db.session.commit()
            return jsonify({'message': 'User details updated successfully'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'An error occurred: {str(e)}'})

api.add_resource(UpdateUserDetailsAPI, '/users/update-details')


class ServiceProviderRequestsAPI(Resource):
    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self):
        # Ensure the user is a service provider
        if not current_user.has_role('service_provider'):
            return {'message': 'Unauthorized'}

        # Get the service provider's service ID
        service_provider = ServiceProfessional.query.filter_by(user_id=current_user.id).first()
        if not service_provider:
            return {'message': 'Service provider details not found'}

        # Fetch service requests matching the provider's service ID and pending status
        service_requests = ServiceRequest.query.filter_by(service_id=service_provider.service_id, status='pending').all()
        return service_requests

    @auth_required('token')
    def put(self, request_id):
        # Find the service request
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {'message': 'Service request not found'}

        # Ensure the service provider is authorized to accept it
        service_provider = ServiceProfessional.query.filter_by(user_id=current_user.id).first()
        if not service_provider or service_request.service_id != service_provider.service_id:
            return {'message': 'Unauthorized'}

        # Update the service request
        service_request.status = 'accepted'
        service_request.professional_id = current_user.id
        try:
            db.session.commit()
            return {'message': 'Service request accepted successfully'}
        except Exception as e:
            db.session.rollback()
            return {'message': f'An error occurred: {str(e)}'}
api.add_resource(ServiceProviderRequestsAPI, '/service-requests/provider', '/service-requests/provider/<int:request_id>')




class ServiceProviderProfileAPI(Resource):
    @auth_required('token')
    def get(self, professional_id):
        # Fetch the service provider details using professional_id
        service_provider = ServiceProfessional.query.filter_by(user_id=professional_id).first()
        if not service_provider:
            return {'message': 'Service provider not found'}, 404

        # Fetch the corresponding user details
        user = User.query.get(professional_id)
        if not user:
            return {'message': 'User not found'}, 404

        # Prepare the response
        response = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'service_provider_details': {
                'phone': service_provider.phone,
                'pin_code': service_provider.pin_code,
                'experience_years': service_provider.experience_years,
                'service_number': service_provider.service_number,
                'service_id': service_provider.service_id,
                'verified': service_provider.verified,
                'doc_link': service_provider.doc_link,
            }
        }
        return response, 200


api.add_resource(ServiceProviderProfileAPI, '/service-provider/<int:professional_id>')




# class ServiceProviderInfoPublicAPI(Resource):
#     @marshal_with(service_provider_fields)
#     def get(self, user_id):
#         service_provider = ServiceProfessional.query.filter_by(user_id=user_id, verified=True).first()
#         if not service_provider:
#             return {'message': 'Service provider not found or not verified'}
#         return service_provider

# api.add_resource(ServiceProviderInfoPublicAPI, '/service-providers/<int:user_id>')

class UpdateServiceRequestStatusAPI(Resource):
    @auth_required('token')
    def put(self, id):
        # Fetch the service request by ID
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {"message": "Service request not found"}, 404

        # Ensure the authenticated user owns the service request
        if service_request.customer_id != current_user.id:
            return {"message": "You do not have permission to update this service request"},

        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ['paid', 'cancelleduser']:
            return {"message": "Invalid status value"}

        # Validate card details if status is 'paid'
        if new_status == 'paid':
            card_details = data.get('cardDetails', {})
            card_number = card_details.get('cardNumber', '')
            cvv = card_details.get('cvv', '')

            if not card_number.isdigit() or len(card_number) != 16:
                return {"message": "Invalid card number. Must be a 16-digit number."}
            if not cvv.isdigit() or len(cvv) != 3:
                return {"message": "Invalid CVV. Must be a 3-digit number."}

        # Update the status of the service request
        service_request.status = new_status

        try:
            db.session.commit()
            return {"message": f"Service request updated to '{new_status}' successfully"}
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}
        
api.add_resource(UpdateServiceRequestStatusAPI, '/service-requests/<int:id>/update-status')


