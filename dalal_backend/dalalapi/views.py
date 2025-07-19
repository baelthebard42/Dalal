from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecruiterRegistrationSerializer, RecruiteeRegistrationSerializer

class RegisterRecruiter(APIView):
    def post(self, request):
        serializer = RecruiterRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Recruiter registered successfully",
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterRecruitee(APIView):
    def post(self, request):
        serializer = RecruiteeRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Recruitee registered successfully",
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
