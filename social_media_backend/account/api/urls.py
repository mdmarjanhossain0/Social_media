from django.urls import path
from account.api.views import(
	registration_view,
	ObtainAuthTokenView,
	account_properties_view,
	update_account_view,
	does_account_exist_view,
	ChangePasswordView,
 	ApiAllAccountView,
	send_friend_request_view,
	decline_request_view,
	cancel_friend_view,
	accept_friend_request_view,
	get_private_chat_room_view,
 	ApiFriendView
)
from rest_framework.authtoken.views import obtain_auth_token

app_name = 'account'

urlpatterns = [
	path('check_if_account_exists/', does_account_exist_view, name="check_if_account_exists"),
	path('change_password/', ChangePasswordView.as_view(), name="change_password"),
	path('properties', account_properties_view, name="properties"),
	path('properties/update', update_account_view, name="update"),
 	path('login', ObtainAuthTokenView.as_view(), name="login"), 
	path('register', registration_view, name="register"),
	path("account_list", ApiAllAccountView.as_view(), name="account"),
	path("friend_request/<pk>", send_friend_request_view, name="friend_request"),
	path("decline_request/<pk>", decline_request_view, name="decline_request"),
	path("unfriend/<pk>", cancel_friend_view, name="cancel_friend_request"),
	path("accept_friend_request/<pk>", accept_friend_request_view, name="accept_freind_request"),
	path("get_private_room_id/<pk>", get_private_chat_room_view, name="get_private_room"),
 
 	path("friend_list", ApiFriendView.as_view(), name="friend_list"),
]