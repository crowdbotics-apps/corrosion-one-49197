from django.utils.deprecation import MiddlewareMixin
from threading import local
from django.utils import timezone
from datetime import timedelta


from corrosion_one_49197.redis_cache import redis_save_last_activity

TIMEZONE_ATTR_NAME = "_current_timezone"

_thread_locals = local()


def get_current_timezone():
    """
   Get current timezone to thread local storage.
   """
    return getattr(_thread_locals, TIMEZONE_ATTR_NAME, None)


class ThreadLocalMiddleware(MiddlewareMixin):
    """
   Middleware that gets timezone from the
   request and saves it in thread local storage.
   """

    def process_request(self, request):
        # Handles current user timezone.
        current_timezone = request.META.get("HTTP_CLIENT_LOCATION", "UTC")
        setattr(_thread_locals, TIMEZONE_ATTR_NAME, current_timezone)



class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        user = request.user
        if user.is_authenticated:
            current_time = timezone.now()
            # Check if more than an hour has passed since the last activity
            redis_save_last_activity(user.id, current_time)
            if not user.last_activity or (current_time - user.last_activity) > timedelta(hours=1):
                user.last_activity = current_time
                user.save()
        return response