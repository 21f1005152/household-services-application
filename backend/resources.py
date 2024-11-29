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

# class ServiceAPI(Resource):
#     @marshal_with(service_fields)
#     @auth_required('token')
#     def get(self, id):
#         service = Service.query.get(id)
#         if not service:
#             return {'message': 'Service not found'}, 404
#         return service

#     # @auth_required('token')
#     def delete(self, id):
#         service = Service.query.get(id)
#         if not service:
#             return {'message': 'Service not found'}, 404
        
#         if service.user_id != current_user.id:
#             return {'message': 'You do not have permission to delete this service'}, 403
        
#         try:
#             db.session.delete(service)
#             db.session.commit()
#             return {"message": "Service deleted successfully"}, 200
#         except:
#             db.session.rollback()
#             return {'message': 'Service deleted'}, 200    
        
#     @auth_required('token')
#     def put(self, id):
#         data = request.get_json()
#         service = Service.query.get(id)
#         if not service:
#             return jsonify({'message': 'Service not found'})
#         if service.user_id != current_user.id:
#             return jsonify({'message': 'You do not have permission to update this service'})
#         service.name = data.get('name', service.name)
#         service.description = data.get('description', service.description)
#         service.base_price = data.get('base_price', service.base_price)
#         try:
#             db.session.commit()
#             return jsonify({"message": "Service updated successfully"})
#         except:
#             db.session.rollback()
#             return jsonify({'message': 'Error updating service'})

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
            # Return success message as JSON
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

# class ServiceListAPI(Resource):
#     @marshal_with(service_fields)
#     # @auth_required('token')
#     def get(self):
#         services = Service.query.all()
#         return services

#     def post(self):
#         data = request.get_json()
#         name = data.get('name')
#         description = data.get('description')
#         base_price = data.get('base_price')
#         if not name or not description or not base_price:
#             return {'message': 'All fields are required'}, 400
#         if 1 != current_user.id:
#             return {'message': 'You do not have permission to create this service'}, 403
#         service = Service(name=name, description=description, base_price=base_price)
#         try:
#             db.session.add(service)
#             db.session.commit()
#             return {"message": "Service created successfully"}, 200
#         except:
#             db.session.rollback()
#             return {'message': 'Error creating service'}, 400

class ServiceListAPI(Resource):
    @marshal_with(service_fields)
    def get(self):
        try:
            services = Service.query.all()
            return services, 200
        except Exception as e:
            return jsonify({'message': f'Error fetching services: {str(e)}'}), 500

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


# ServiceRequest
service_request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'time_of_request': fields.DateTime,
    'status': fields.String,
    'remarks': fields.String,
}

class ServiceRequestAPI(Resource):
    @marshal_with(service_request_fields)
    @auth_required('token')
    def get(self, id):
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}, 404
        return service_request

    @auth_required('token')
    def delete(self, id):
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}, 404

        if service_request.customer_id != current_user.id and not current_user.has_role('admin'):
            return {'message': 'You do not have permission to delete this service request'}, 403

        try:
            db.session.delete(service_request)
            db.session.commit()
            return {"message": "Service request deleted successfully"}, 200
        except:
            db.session.rollback()
            return {'message': 'An error occurred while deleting the service request'}, 500

    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        service_request = ServiceRequest.query.get(id)
        if not service_request:
            return {'message': 'Service request not found'}, 404

        if service_request.customer_id != current_user.id:
            return {'message': 'You do not have permission to update this service request'}, 403
        
        if not Service.query.get(data.get('service_id')):
            return {'message': 'Service not found'}, 404

        # service_request.service_id != data.get('service_id') and

        service_request.service_id = data.get('service_id', service_request.service_id)
        service_request.remarks = data.get('remarks', service_request.remarks)
        service_request.status = 'pending'
        service_request.professional_id = None        


        try:
            db.session.commit()
            return {"message": "Service request updated successfully"}, 200
        except:
            db.session.rollback()
            return {'message': 'An error occurred while updating the service request'}, 500

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
            return {'message': 'All fields are required'}, 400

        if not Service.query.get(service_id):
            return {'message': 'Service not found'}, 404

        service_request = ServiceRequest(
            service_id=data['service_id'],
            customer_id=current_user.id,
            time_of_request=datetime.now(),
            remarks=data.get('remarks'),
        )

        try:
            db.session.add(service_request)
            db.session.commit()
            return {"message": "Service request created successfully"}, 201
        except:
            db.session.rollback()
            return {'message': 'An error occurred while creating the service request'}, 500



api.add_resource(ServiceAPI, '/services/<int:id>')
api.add_resource(ServiceListAPI, '/services')

api.add_resource(ServiceRequestAPI, '/service-requests/<int:id>')
api.add_resource(ServiceRequestListAPI, '/service-requests')






# Fields for customer and service provider details
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

# class UserListAPI(Resource):
#     @marshal_with(user_fields)
#     def get(self):
#         """
#         Return a list of all users with their details (including customer or service provider).
#         """
#         users = User.query.all()
#         user_list = []

#         for user in users:
#             customer = Customer.query.filter_by(user_id=user.id).first()
#             service_provider = ServiceProfessional.query.filter_by(user_id=user.id).first()

#             user_data = {
#                 'id': user.id,
#                 'name': user.name,
#                 'email': user.email,
#                 'active': user.active,
#                 'roles': user.roles,
#                 'customer_details': customer,  
#                 'service_provider_details': service_provider,  
#             }

#             user_list.append(user_data)

#         return user_list, 200

# api.add_resource(UserListAPI, '/users')

#below code is for without admin user list


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
        return user_list, 200
api.add_resource(UserListAPI, '/users')




class VerifyServiceProviderAPI(Resource):
    # @auth_required('token')
    def put(self, user_id):
        print(f"Verifying service provider with user_id: {user_id}")  # Debug log

        # Find the service provider entry
        service_provider = ServiceProfessional.query.filter_by(user_id=user_id).first()

        if not service_provider:
            print("Service provider not found.")  # Debug log
            return {'message': 'Service provider not found'}, 404

        # Check if the service provider is already verified
        if service_provider.verified:
            print("Service provider is already verified.")  # Debug log
            return {'message': 'Service provider is already verified'}, 400

        # Update the verified status
        service_provider.verified = True
        try:
            db.session.commit()
            print("Service provider verified successfully.")  # Debug log
            return {'message': 'Service provider verified successfully'}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error verifying service provider: {str(e)}")  # Debug log
            return {'message': f'An error occurred: {str(e)}'}, 500


api.add_resource(VerifyServiceProviderAPI, '/users/<int:user_id>/verify')