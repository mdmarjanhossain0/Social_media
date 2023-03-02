from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from django.contrib.auth import authenticate
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from account.api.serializers import (
	RegistrationSerializer,
	AccountPropertiesSerializer,
	ChangePasswordSerializer,
	AccountWithFriendsSerializer
)
from account.models import Account, FriendList, FriendRequest
from rest_framework.authtoken.models import Token
from blog.api.serializers import BlogPostSerializer
from blog.models import BlogPost

from rest_framework.pagination import PageNumberPagination

from rest_framework.filters import SearchFilter, OrderingFilter










from chat.models import PrivateChatRoom

# Register
# Response: https://gist.github.com/mitchtabian/c13c41fa0f51b304d7638b7bac7cb694
# Url: https://<your-domain>/api/account/register
@api_view(['POST', ])
@permission_classes([])
@authentication_classes([])
def registration_view(request):

	if request.method == 'POST':
		data = {}
		email = request.data.get('email', '0').lower()
		if validate_email(email) != None:
			data['error_message'] = 'That email is already in use.'
			data['response'] = 'Error'
			return Response(data)

		username = request.data.get('username', '0')
		if validate_username(username) != None:
			data['error_message'] = 'That username is already in use.'
			data['response'] = 'Error'
			return Response(data)

		serializer = RegistrationSerializer(data=request.data)
		
		if serializer.is_valid():
			account = serializer.save()
			data['response'] = 'successfully registered new user.'
			data['email'] = account.email
			data['username'] = account.username
			data['pk'] = account.pk
			token = Token.objects.get(user=account).key
			data['token'] = token
		else:
			data = serializer.errors
		return Response(data)

def validate_email(email):
	account = None
	try:
		account = Account.objects.get(email=email)
	except Account.DoesNotExist:
		return None
	if account != None:
		return email

def validate_username(username):
	account = None
	try:
		account = Account.objects.get(username=username)
	except Account.DoesNotExist:
		return None
	if account != None:
		return username


# Account properties
# Response: https://gist.github.com/mitchtabian/4adaaaabc767df73c5001a44b4828ca5
# Url: https://<your-domain>/api/account/
# Headers: Authorization: Token <token>
@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def account_properties_view(request):

	try:
		account = request.user
	except Account.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		data = {}
		serializer = AccountPropertiesSerializer(account)
		blog_list_serializer = BlogPostSerializer(
				BlogPost.objects.filter(author=account)[:10],
				many=True
		)
		data = serializer.data
		data["post_list"] = blog_list_serializer.data
		return Response(data)


class ApiAllAccountView(ListAPIView):
	# queryset = Account.objects.all()
	serializer_class = AccountWithFriendsSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)
	pagination_class = PageNumberPagination
	filter_backends = (SearchFilter, OrderingFilter)
	search_fields = ("username", "email")
 
 
class ApiFriendView(ListAPIView):
	# queryset = Account.objects.all()
	serializer_class = AccountWithFriendsSerializer
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)
	pagination_class = PageNumberPagination
	filter_backends = (SearchFilter, OrderingFilter)
	search_fields = ("username", "email")
	
 
	def get_queryset(self):
		try:
			return FriendList.objects.get(user=self.request.user).friends.all()
		except:
			friend_list = FriendList.objects.create(user=self.request.user)
			return friend_list.all()

@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def send_friend_request_view(request, pk):
	if request.method == 'GET':
		data = {}
		account = request.user
		try:
			if account.pk == pk:
				data["response"] = "Error"
				data["error_message"] = "error"
				return Response(data=data, status=404)
			if FriendRequest.objects.filter(receiver_id=pk, sender=account).exists():
				data["response"] = "Already requested"
				data["error_message"] = "error"
				return Response(data=data, status=400)
			FriendRequest.objects.create(receiver_id=pk, sender=account)
			data["response"] = "Request successfully"
			data["error_message"] = None
		except:
			data["response"] = "Account doesn't exist"
			data["error_message"] = "error"
			return Response(data=data, status=404)
		return Response(data)


@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def decline_request_view(request, pk):
	if request.method == 'GET':
		data = {}
		account = request.user
		try:
			FriendRequest.objects.get(receiver=account, sender_id=pk).delete()
			data["response"] = "Decline successfully"
			data["error_message"] = None
		except:
			data["response"] = "Error"
			data["error_message"] = "error"
			return Response(data=data, status=404)
		return Response(data)

@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def cancel_friend_view(request, pk):
	if request.method == 'GET':
		data = {}
		account = request.user
		try:
			friend_id = Account.objects.get(pk=pk)
			FriendList.objects.get(user=account).friends.remove(friend_id)
			FriendList.objects.get(user=friend_id).friends.remove(account)
			data["response"] = "Unfriend successfully"
			data["error_message"] = None
		except:
			data["response"] = "Error"
			data["error_message"] = "error"
			return Response(data=data, status=404)
		return Response(data)


@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def accept_friend_request_view(request, pk):
	if request.method == 'GET':
		data = {}
		account = request.user
		try:
			
   
   
			friend_id = Account.objects.get(pk=pk)
			if FriendList.objects.filter(user=account).exists():
				FriendList.objects.get(user=account).friends.add(friend_id)
			else:
				friend_list = FriendList.objects.create(user=account)
				friend_list.friends.add(friend_id)


			if FriendList.objects.filter(user=friend_id).exists():
				FriendList.objects.get(user=friend_id).friends.add(account)
			else:
				friend_list = FriendList.objects.create(user=friend_id)
				friend_list.friends.add(account)
			FriendRequest.objects.get(receiver=account, sender=friend_id).delete()

			data["response"] = "Accept successfully"
			data["error_message"] = None
		except:
			data["response"] = "Account doesn't exist"
			data["error_message"] = "error"
			return Response(data=data, status=404)
		return Response(data)
	
	


# Account update properties
# Response: https://gist.github.com/mitchtabian/72bb4c4811199b1d303eb2d71ec932b2
# Url: https://<your-domain>/api/account/properties/update
# Headers: Authorization: Token <token>
@api_view(['PUT',])
@permission_classes((IsAuthenticated, ))
def update_account_view(request):

	try:
		account = request.user
	except Account.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
		
	if request.method == 'PUT':
		serializer = AccountPropertiesSerializer(account, data=request.data)
		data = {}
		if serializer.is_valid():
			serializer.save()
			data['response'] = 'Account update success'
			return Response(data=data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# LOGIN
# Response: https://gist.github.com/mitchtabian/8e1bde81b3be342853ddfcc45ec0df8a
# URL: http://127.0.0.1:8000/api/account/login
class ObtainAuthTokenView(APIView):

	authentication_classes = []
	permission_classes = []

	def post(self, request):
		context = {}

		email = request.POST.get('username')
		password = request.POST.get('password')
		account = authenticate(email=email, password=password)
		if account:
			try:
				token = Token.objects.get(user=account)
			except Token.DoesNotExist:
				token = Token.objects.create(user=account)
			context['response'] = 'Successfully authenticated.'
			context['pk'] = account.pk
			context['email'] = email.lower()
			context['token'] = token.key
		else:
			context['response'] = 'Error'
			context['error_message'] = 'Invalid credentials'

		return Response(context)




@api_view(['GET', ])
@permission_classes([])
@authentication_classes([])
def does_account_exist_view(request):

	if request.method == 'GET':
		email = request.GET['email'].lower()
		data = {}
		try:
			account = Account.objects.get(email=email)
			data['response'] = email
		except Account.DoesNotExist:
			data['response'] = "Account does not exist"
		return Response(data)



class ChangePasswordView(UpdateAPIView):

	serializer_class = ChangePasswordSerializer
	model = Account
	permission_classes = (IsAuthenticated,)
	authentication_classes = (TokenAuthentication,)

	def get_object(self, queryset=None):
		obj = self.request.user
		return obj

	def update(self, request, *args, **kwargs):
		self.object = self.get_object()
		serializer = self.get_serializer(data=request.data)

		if serializer.is_valid():
			# Check old password
			if not self.object.check_password(serializer.data.get("old_password")):
				return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

			# confirm the new passwords match
			new_password = serializer.data.get("new_password")
			confirm_new_password = serializer.data.get("confirm_new_password")
			if new_password != confirm_new_password:
				return Response({"new_password": ["New passwords must match"]}, status=status.HTTP_400_BAD_REQUEST)

			# set_password also hashes the password that the user will get
			self.object.set_password(serializer.data.get("new_password"))
			self.object.save()
			return Response({"response":"successfully changed password"}, status=status.HTTP_200_OK)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




def find_or_create_private_chat(user1, user2):
	try:
		chat = PrivateChatRoom.objects.get(user1=user1, user2=user2)
	except PrivateChatRoom.DoesNotExist:
		try:
			chat = PrivateChatRoom.objects.get(user1=user2, user2=user1)
		except PrivateChatRoom.DoesNotExist:
			chat = PrivateChatRoom(user1=user1, user2=user2)
			chat.save()
	return chat

@api_view(['GET', ])
@permission_classes((IsAuthenticated, ))
def get_private_chat_room_view(request, pk):
	if request.method == 'GET':
		data = {}
		account = request.user

		user2 = Account.objects.get(pk=pk)
		room = find_or_create_private_chat(account, user2)
		data["response"] = "Successfully"
		data["error_message"] = None
		data["room"] = room.pk
		return Response(data)