from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path, re_path
from .TokenAuthMiddleware import TokenAuthMiddleware

from chat.consumers import ChatConsumer


application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            URLRouter([

                path("chat/<room_id>/", ChatConsumer.as_asgi(), name="chat")
            ])
        )
    ),
})
