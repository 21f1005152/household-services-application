from celery import shared_task
from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import daily_reminder_task, email_reminder, monthly_report_task

celery_app = app.extensions["celery"]

# @celery_app.on_after_configure.connect
# def setup_periodic_tasks(sender, **kwargs):
#     sender.add_periodic_task(20.0, email_reminder.s('student@email.com', 'login reminder', '<h1>hii</h1>'), name='email 1'),
#     sender.add_periodic_task(
#         crontab(hour=17, minute=49, day_of_week=2),
#         email_reminder.s('student1@email.com', 'Happy Tuesday!', '<h1>helloo</h1>'),
#     )


from celery.schedules import crontab
from flask import current_app as app
from backend.models import ServiceRequest, User
from backend.celery.tasks import daily_reminder, monthly_report

celery_app = app.extensions["celery"]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=20, minute=55),daily_reminder_task.s(),name="Daily Reminder",)
    sender.add_periodic_task(crontab(day_of_month=3, hour=20, minute=55),monthly_report_task.s(),name="Monthly Activity Reports",)

# @shared_task(ignore_result=True)
# def daily_reminder_task():
#     pending_requests = ServiceRequest.query.filter_by(status="pending").all()
#     professionals = {}

#     for request in pending_requests:
#         if request.professional and request.professional.email:
#             if request.professional.email not in professionals:
#                 professionals[request.professional.email] = []
#             professionals[request.professional.email].append(request)

#     for email, requests in professionals.items():
#         daily_reminder.delay(email, requests)


# @shared_task(ignore_result=True)
# def monthly_report_task():
#     customers = User.query.filter(User.roles.any(name="customer")).all()

#     for customer in customers:
#         report_data = {
#             "name": customer.name,
#             "services_requested": len(customer.customer_service_requests),
#             "services_closed": len(
#                 [req for req in customer.customer_service_requests if req.status == "paid"]
#             ),
#         }
#         monthly_report.delay(customer.email, report_data)
