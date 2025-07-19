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
from sentence_transformers import SentenceTransformer
import faiss
import json
from .models import *
from .utils import get_ai_response

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


class Dalal(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.user.first_name
        original_user_prompt = request.data.get('prompt')
        model = SentenceTransformer("all-MiniLM-L6-v2")
        dimension = 384
        TOP = 5

        if request.user.user_type == 'recruitee':
            index = faiss.read_index('recruiter.index')
            json_file = 'chunk_to_recruiter.json'
        else:
            index = faiss.read_index('recruitee.index')
            json_file = 'chunk_to_recruitee.json'

        prompt_embedding = model.encode([original_user_prompt]).astype('float32')
        faiss.normalize_L2(prompt_embedding)
        D, I = index.search(prompt_embedding, k=300)

        with open(json_file, 'r') as f:
            index_to_user_text_mapping = json.load(f)

        user_ids = []
        combined_infos = []

        for each_index in I[0]:
            each_index_str = str(each_index)
            if each_index_str not in index_to_user_text_mapping:
                continue

            user_id = index_to_user_text_mapping[each_index_str]['user_id']
            chunk = index_to_user_text_mapping[each_index_str]['chunk']

            if user_id in user_ids:
                continue

            user_ids.append(user_id)

            if request.user.user_type == 'recruitee':
                profile = RecruiterProfile.objects.get(id=user_id)
                user_info = f"""
Recruiter:
Name: {profile.user.first_name} {profile.user.last_name}
Organization: {profile.organization}
Preferences: {profile.preferences or 'Not specified'}
Needs: {profile.needs or 'Not specified'}
"""
            else:
                profile = RecruiteeProfile.objects.get(id=user_id)
                user_info = f"""
Recruitee:
Name: {profile.user.first_name} {profile.user.last_name}
Interests: {profile.interests}
Description: {profile.description}
Preferences: {profile.preferences or 'Not specified'}

"""

            combined_text = f"{user_info.strip()}\n\nMatched Content: {chunk}"
            combined_infos.append(combined_text)

            if len(user_ids) >= TOP:
                break

     
        additional_info = "\n\n---\n\n".join(combined_infos)
        formatted_prompt = f"""
        Prompter information: Name: {name}, account_type: {request.user.user_type}
Original User Prompt: {original_user_prompt}

Additional Information (Retrieved Data from database):
{additional_info}
"""

    
        response_from_dalal = get_ai_response(formatted_prompt)

        return Response({
            "response": response_from_dalal
        })