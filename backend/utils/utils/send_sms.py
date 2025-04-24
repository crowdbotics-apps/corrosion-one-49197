from twilio.rest import Client
from django.conf import settings

def send_sms(message, to):
    """
    Send an SMS message to a phone number.

    :param message: The message content.
    :param to: The recipient phone number.
    """
    try:
        # This special twilio client is needed for sending SMSs.
        twilio_client = Client(settings.TWILIO_API_KEY_SID, settings.TWILIO_API_KEY_SECRET,
                               settings.TWILIO_ACCOUNT_SID)

        twilio_client.messages.create(
            body=message,
            to=to,
            from_=settings.TWILIO_NUMBER,
        )
        # print(f'SMS sent to {to}: {message}')
    except Exception as e:
        print(f"Failed to send SMS: {e}")