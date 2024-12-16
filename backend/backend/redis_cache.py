
from django.core.cache import cache
from django_redis import get_redis_connection

stats = get_redis_connection()


def user2key(user_id):
    return f'cb_st{user_id}'

def redis_save_last_activity(user_id, date_time):
    try:
        key = user2key(user_id)
        cache.set(key, str(date_time))
    except Exception as e:
        print(e)

def redis_get_last_activity(user_id):
    key = user2key(user_id)
    if date_time := cache.get(key):
        return date_time
    return None
