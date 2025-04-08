import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.cache import cache

from asgiref.sync import sync_to_async
from rest_framework.exceptions import AuthenticationFailed


def jwt_auth_userid(user_id, jwt_token):
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from users.models import User
    if usero := User.objects.filter(pk=user_id).first():
        auth = JWTAuthentication()
        # try:
        token = auth.get_validated_token(jwt_token)
        if usero != auth.get_user(token):
            raise AuthenticationFailed()
    else:
        raise AuthenticationFailed()

    return usero


async def async_jwt_auth_userid(user_id, jwt_token):
    return await sync_to_async(jwt_auth_userid)(user_id, jwt_token)


PUBSUB_CHANNEL_NAME = 'pubsub'


def send_message_to_backchannels(topic, message, retain=False):
    async_to_sync(get_channel_layer().group_send)(PUBSUB_CHANNEL_NAME, dict(
        type='pubsub',
        topic=topic,
        data=message,
    ))
    if retain:
        cache.set(f'{topic}_retained', message)


async def asend_message_to_backchannels(topic, message, retain=False):
    await get_channel_layer().group_send(PUBSUB_CHANNEL_NAME, dict(
        type='pubsub',
        topic=topic,
        data=message,
    ))
    if retain:
        cache.set(f'{topic}_retained', message)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    debug = True

    user = None
    student = None
    teacher = None
    meeting = None

    subscriptions = None

    async def connect(self):
        await self.accept()
        kwargs = self.scope['url_route']['kwargs']
        # room = kwargs['room']
        user = kwargs['user_id']
        token = kwargs['access_token']
        # print('room: ', room)
        print('user: ', user)
        print('token: ', token)

        # from student.models import Student
        # from teacher.models import Teacher

        self.user = await async_jwt_auth_userid(user, token)
        # self.student = await Student.objects.filter(user=user).afirst()
        # self.teacher = await Teacher.objects.filter(user=user).afirst()
        self.meeting = None

        self.subscriptions = set()
        await self.channel_layer.group_add(PUBSUB_CHANNEL_NAME, self.channel_name)

        await self.send_json({'type': 'welcome'})

    async def receive_json(self, content, **kwargs):
        topic = content.get('topic')
        match content.get('type'):
            case 'subscribe':
                await self.subscribe(topic)
            case 'unsubscribe':
                await self.unsubscribe(topic)
            # no one can publish from websocket in this app
            # case 'publish':
            #     await self.publish_message(topic,
            #                                content.get('payload'),
            #                                content.get('retain', False))
            case 'meetingId':
                try:
                    # todo filter user meetings
                    # from course.models import CourseMeeting
                    # meeting = await CourseMeeting.objects.aget(id=content.get('payload'))
                    # self.meeting = meeting
                    await self.notify_student_status(True)
                except Exception as exc:
                    pass

    async def notify_student_status(self, status):
        if self.student and self.meeting:
            topic = f'meeting/{self.meeting.id}/{self.student.user_id}/status'
            data = json.dumps(status)
            await asend_message_to_backchannels(topic, data, retain=True)

    async def disconnect(self, close_code):
        await self.notify_student_status(False)
        self.channel_layer.group_discard(PUBSUB_CHANNEL_NAME, self.channel_name)

    async def subscribe(self, topic):
        # await self.pubsub.subscribe(topic, **{topic: channel_callable})
        self.subscriptions.add(topic)
        if retained := cache.get(f'{topic}_retained'):
            if self.debug: print('sending json')
            await self.send_json({'type': 'message', 'topic': topic, 'payload': retained})

        if self.debug: await self.send_json({'type': 'log', 'payload': f'You are subscribed to {topic}'})

    async def unsubscribe(self, topic):
        self.subscriptions.remove(topic)
        if self.debug: await self.send_json({'type': 'log', 'payload': f'You are unsubscribed from {topic}'})

    async def publish_message(self, topic, message, retain=False):
        await asend_message_to_backchannels(topic, message, retain=retain)

        if self.debug: await self.send_json({'type': 'log', 'payload': f'Message published to {topic}'})
        if self.debug and retain: await self.send_json(
            {'type': 'log', 'payload': f'Message retained in {topic}_retained'})

    async def pubsub(self, event):
        topic, data = event.get('topic'), event.get('data')
        if topic and topic in self.subscriptions:
            if self.debug: print(f"(Reader) Message Received: {event}")
            if self.debug: print('sending json')
            await self.send_json(dict(
                type='message',
                topic=topic,
                payload=data
            ))
