from rest_framework import serializers
from .models import User, RecruiterProfile, RecruiteeProfile
from .utils import encode_new_recruitee, encode_new_recruiter

class RecruiterRegistrationSerializer(serializers.ModelSerializer):
    organization = serializers.CharField()
    looking_for = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'organization', 'looking_for', 'password']

    def create(self, validated_data):
        first_name = validated_data['first_name']
        username_base = f"recruiter_{first_name.lower()}"
        username = username_base
        counter = 1

      
        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            user_type='recruiter'
        )
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()

        recruiter = RecruiterProfile.objects.create(
            user=user,
            organization=validated_data['organization'],
            looking_for=validated_data['looking_for']
        )

        encode_new_recruiter(looking_for=recruiter.looking_for, user_id=recruiter.id)
        return user


class RecruiteeRegistrationSerializer(serializers.ModelSerializer):
    dob = serializers.DateField()
    interests = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    cv = serializers.FileField()

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'dob', 'interests', 'description', 'cv', 'password']

    def create(self, validated_data):
        first_name = validated_data['first_name']
        username_base = f"recruitee_{first_name.lower()}"
        username = username_base
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{username_base}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            password=validated_data['password'],
            user_type='recruitee'
        )
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()

        recruitee = RecruiteeProfile.objects.create(
            user=user,
            dob=validated_data['dob'],
            interests=validated_data['interests'],
            description=validated_data.get('description', ''),
            cv=validated_data['cv']
        )

        encode_new_recruitee(f"./cvs/cv_{recruitee.user.username}.pdf", description=recruitee.description, user_id=recruitee.id )

        
        return user



