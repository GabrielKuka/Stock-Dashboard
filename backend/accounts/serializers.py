from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers

import requests


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for the user object """
    
    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'name', 'phone', 'birthday')
        extra_kwargs = { 'password': {'write_only': True, 'min_length': 6}}

    def create(self, validated_data):
        """ Create a new user with encrypted password and return it """
        user =  get_user_model().objects.create_user(**validated_data) 

        r = requests.post(url='http://localhost:8000/api/lists/toplist/createtoplist', data={'user_email':user})
        print(r.json()['status'])

        return user

    def update(self, instance, validated_data):
        """ Update a user, setting the password correctly and return it """
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user
        

class AuthTokenSerializer(serializers.Serializer):
    """ Serializer for the user authentication obejct """
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    
    def validate(self, attrs):
        """ Validate and authenticate the user """
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request = self.context.get('request'),
            username = email,
            password = password
        )

        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs