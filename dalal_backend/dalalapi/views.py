from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RecruiterRegistrationSerializer, RecruiteeRegistrationSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser


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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist() 
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        
    
class UpdateRecruiteeDescription(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruitee':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiteeprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        desc = request.data.get("description")
        if not desc:
            return Response({"error": "Description required"}, status=400)
        profile.description = desc
        profile.save()
        return Response({"message": "Description updated"})

    
class UpdateRecruiteeInterests(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruitee':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiteeprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        interests = request.data.get("interests")
        if not interests:
            return Response({"error": "Interests required"}, status=400)
        profile.interests = interests 
        profile.save()
        return Response({"message": "Interest updated"})





class UpdateRecruiteeAddress(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruitee':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiteeprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        address = request.data.get("address")
        if not address:
            return Response({"error": "Address required"}, status=400)
        profile.address = address
        profile.save()
        return Response({"message": "Address updated"})


class UpdateRecruiteePreferences(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruitee':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiteeprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        prefs = request.data.get("preferences")
        if not prefs:
            return Response({"error": "Preferences required"}, status=400)
        
        if profile.preferences is None:
            profile.preferences='' 
        profile.preferences = prefs
        profile.save()
        return Response({"message": "Preferences updated"})
    
class UpdateRecruiterAddress(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruiter':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiterprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        address = request.data.get("address")
        if not address:
            return Response({"error": "Address required"}, status=400)
        profile.address = address
        profile.save()
        return Response({"message": "Address updated"})


class UpdateRecruiterPreferences(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruiter':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiterprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        prefs = request.data.get("preferences")
        if not prefs:
            return Response({"error": "Preferences required"}, status=400)
        
        if profile.preferences is None:
            profile.preferences='' 

        profile.preferences = prefs
        profile.save()
        return Response({"message": "Preferences updated"})


class UpdateRecruiterNeeds(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        if request.user.user_type != 'recruiter':
            return Response({"error": "Unauthorized"}, status=403)
        try:
            profile = request.user.recruiterprofile
        except:
            return Response({"error": "Profile not found"}, status=404)

        needs = request.data.get("needs")
        if not needs:
            return Response({"error": "Looking_for required"}, status=400)
        profile.needs = needs
        profile.save()
        return Response({"message": "Looking for (exact needs) updated"})

