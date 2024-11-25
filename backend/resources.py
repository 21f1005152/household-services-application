from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from datetime import datetime
from backend.models import ServiceRequest, db, Service
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
    @auth_required('token')
    def get(self, id):
        service = Service.query.get(id)
        if not service:
            return {'message': 'Service not found'}, 404
        return service

    @auth_required('token')
    def delete(self, id):
        service = Service.query.get(id)
        if not service:
            return {'message': 'Service not found'}, 404
        
        if service.user_id != current_user.id:
            return {'message': 'You do not have permission to delete this service'}, 403
        
        try:
            db.session.delete(service)
            db.session.commit()
            return {"message": "Service deleted successfully"}, 200
        except:
            db.session.rollback()
            return {'message': 'Service deleted'}, 200    
        
    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        service = Service.query.get(id)
        if not service:
            return jsonify({'message': 'Service not found'})
        if service.user_id != current_user.id:
            return jsonify({'message': 'You do not have permission to update this service'})
        service.name = data.get('name', service.name)
        service.description = data.get('description', service.description)
        service.base_price = data.get('base_price', service.base_price)
        try:
            db.session.commit()
            return jsonify({"message": "Service updated successfully"})
        except:
            db.session.rollback()
            return jsonify({'message': 'Error updating service'})

class ServiceListAPI(Resource):
    @marshal_with(service_fields)
    @auth_required('token')
    def get(self):
        services = Service.query.all()
        return services

    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        base_price = data.get('base_price')
        if not name or not description or not base_price:
            return {'message': 'All fields are required'}, 400
        if 1 != current_user.id:
            return {'message': 'You do not have permission to create this service'}, 403
        service = Service(name=name, description=description, base_price=base_price)
        try:
            db.session.add(service)
            db.session.commit()
            return {"message": "Service created successfully"}, 200
        except:
            db.session.rollback()
            return {'message': 'Error creating service'}, 400



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
