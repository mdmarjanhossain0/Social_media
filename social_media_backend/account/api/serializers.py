from rest_framework import serializers

from account.models import Account, FriendList, FriendRequest


class RegistrationSerializer(serializers.ModelSerializer):

	password2 				= serializers.CharField(style={'input_type': 'password'}, write_only=True)

	class Meta:
		model = Account
		fields = ['email', 'username', 'password', 'password2']
		extra_kwargs = {
				'password': {'write_only': True},
		}	


	def	save(self):

		account = Account(
					email=self.validated_data['email'],
					username=self.validated_data['username']
				)
		password = self.validated_data['password']
		password2 = self.validated_data['password2']
		if password != password2:
			raise serializers.ValidationError({'password': 'Passwords must match.'})
		account.set_password(password)
		account.save()
		return account


class AccountPropertiesSerializer(serializers.ModelSerializer):

	class Meta:
		model = Account
		fields = ['pk', 'email', 'username', ]
  






class AccountWithFriendsSerializer(serializers.ModelSerializer):
	
	is_friend = serializers.SerializerMethodField("get_is_friend")

	is_requested = serializers.SerializerMethodField("get_is_requested")
 
 
 
	is_request_send = serializers.SerializerMethodField("get_is_request_send")

	class Meta:
		model = Account
		fields = ['pk', 'email', 'username', "is_friend", "is_requested", "is_request_send"]

	def get_is_friend(self, obj):
		if FriendList.objects.filter(user=self.context["request"].user).exists():
			if obj in FriendList.objects.get(user=self.context["request"].user).friends.all():
				return True
			else:
				return False
		else:
			return False

	def get_is_requested(self, obj):
		return FriendRequest.objects.filter(receiver=self.context["request"].user, sender=obj).exists()



	def get_is_request_send(self, obj):
		
  
  
  
  
		return FriendRequest.objects.filter(receiver=obj, sender=self.context["request"].user).exists()
		




class ChangePasswordSerializer(serializers.Serializer):

	old_password 				= serializers.CharField(required=True)
	new_password 				= serializers.CharField(required=True)
	confirm_new_password 		= serializers.CharField(required=True)





