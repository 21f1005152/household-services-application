import os
from celery import shared_task
from time import sleep
import flask_excel
from backend.models import db, User, Role, Service, Customer, ServiceProfessional, ServiceRequest



@shared_task(ignore_result=False)
def add(x, y):
    sleep(15)
    return x + y

@shared_task(ignore_result=False)
def create_csv():
    resource = ServiceRequest.query.all()

    column_names = [column.name for column in ServiceRequest.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type='csv')
    print(csv_out.data)
    with open('./backend/celery/user-downloads/servicerequest.csv', 'wb') as f:
        f.write(csv_out.data)
    
    return 'servicerequest.csv'
