import os
from celery import shared_task
from time import sleep
import flask_excel
from backend.models import db, User, Role, Service, Customer, ServiceProfessional, ServiceRequest
from backend.celery.mail_service import send_email
from flask import render_template


@shared_task(ignore_result=False)
def add(x, y):
    sleep(15)
    return x + y

@shared_task(bind=True ,ignore_result=False)
def create_csv(self):
    resource = ServiceRequest.query.all()
    task_id = self.request.id
    filename = f'servicerequest_{task_id}.csv'

    column_names = [column.name for column in ServiceRequest.__table__.columns]
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names=column_names, file_type='csv')
    print(csv_out.data)
    with open(f'./backend/celery/user-downloads/{filename}', 'wb') as f:
        f.write(csv_out.data)
    
    return filename

@shared_task(ignore_result=True)
def email_reminder(to, subject, content):
    send_email(to, subject, content)

@shared_task(ignore_result=True)
def daily_reminder(professional_email, pending_requests):
    """
    Sends a daily reminder email to a professional.
    """
    content = render_template("emails/daily_reminder.html", pending_requests=pending_requests)
    send_email(professional_email, "Daily Reminder: Pending Service Requests", content)

@shared_task(ignore_result=True)
def daily_reminder_task():
    """
    Queries pending service requests and triggers email reminders for professionals.
    """
    pending_requests = ServiceRequest.query.filter_by(status="pending").all()

    # Organize requests by professional email
    professionals = {}
    for request in pending_requests:
        if request.professional and request.professional.email:
            if request.professional.email not in professionals:
                professionals[request.professional.email] = []

            # Serialize the request data
            professionals[request.professional.email].append({
                "id": request.id,
                "customer_name": request.customer.name if request.customer else "N/A",
                "service_name": request.service.name if request.service else "N/A",
                "time_of_request": request.time_of_request.isoformat(),
                "remarks": request.remarks,
            })

    # Trigger daily reminders for each professional
    for email, requests in professionals.items():
        daily_reminder.delay(email, requests)

# @shared_task(ignore_result=True)
# def monthly_report(customer_email, report_data):
#     content = render_template("email/monthly_reminder.html",report_data=report_data,)
#     send_email(customer_email, "Your Monthly Activity Report", content)
    
# @shared_task(ignore_result=True)
# def monthly_report_task():
#     """Task to generate and send monthly activity reports to customers."""
#     customers = User.query.filter(User.roles.any(name="customer")).all()

#     for customer in customers:
#         if customer.email:
#             # Get all service requests for the customer
#             service_requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()

#             # Serialize the data for the email template
#             requests_data = [
#                 {
#                     "id": request.id,
#                     "service_name": request.service.name if request.service else "N/A",
#                     "professional_name": request.professional.name if request.professional else "N/A",
#                     "status": request.status,
#                     "time_of_request": request.time_of_request.strftime("%Y-%m-%d %H:%M:%S"),
#                     "remarks": request.remarks or "No remarks",
#                 }
#                 for request in service_requests
#             ]

#             # Render the HTML content using the template
#             content = render_template(
#                 "monthly_reminder.html",
#                 customer_name=customer.name,
#                 service_requests=requests_data,
#             )

#             # Send the email
#             send_email(
#                 customer.email,
#                 "Monthly Activity Report",
#                 content,
#             )


@shared_task(ignore_result=True)
def monthly_report(customer_email, report_data):
    """Send a single customer's monthly report email."""
    try:
        content = render_template("emails/monthly_reminder.html", report_data=report_data)
        send_email(customer_email, "Your Monthly Activity Report", content)
        print(f"Successfully sent report to {customer_email}")
    except Exception as e:
        print(f"Error sending report to {customer_email}: {e}")


@shared_task(ignore_result=True)
def monthly_report_task():
    customers = User.query.filter(User.roles.any(name="customer")).all()

    for customer in customers:
        if customer.email:
            service_requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()

            requests_data = [
                {
                    "id": request.id,
                    "service_name": request.service.name if request.service else "N/A",
                    "professional_name": request.professional.name if request.professional else "N/A",
                    "status": request.status,
                    "time_of_request": request.time_of_request.strftime("%Y-%m-%d %H:%M:%S"),
                    "remarks": request.remarks or "No remarks",
                    "ratings": request.ratings,
                }
                for request in service_requests
            ]

            # Log the data being sent
            print(f"Customer: {customer.email}, Data: {requests_data}")

            content = render_template(
                "emails/monthly_reminder.html",
                customer_name=customer.name,
                service_requests=requests_data,
            )

            send_email(
                customer.email,
                "Monthly Activity Report",
                content,
            )