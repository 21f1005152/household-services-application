# from smtplib import SMTP
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# SMTP_SERVER = 'localhost'
# SMTP_PORT = 1025
# SENDER_EMAIL = 'homefix@email.com'
# SENDER_PASSWORD = ''

# def send_email(to, subject, body):
#     msg = MIMEMultipart()
#     msg['From'] = SENDER_EMAIL
#     msg['To'] = to
#     msg['Subject'] = subject
#     msg.attach(MIMEText(body, 'html'))

#     with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as client:
#         # server.sendmail(SENDER_EMAIL, to, msg.as_string())
#         client.send_message(msg)
#         client.quit()

# send_email('yayayay@email.com', 'Hello', '<h1>Hello, this is a test email</h1>')


from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_SERVER = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'homefix@email.com'
SENDER_PASSWORD = ''

def send_email(to, subject, body):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    with SMTP(SMTP_SERVER, SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()