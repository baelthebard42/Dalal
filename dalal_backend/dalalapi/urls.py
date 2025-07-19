from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
     path('/register/recruiter', RegisterRecruiter.as_view(), name='register_recruiter'),
    path('/register/recruitee', RegisterRecruitee.as_view(), name='register_recruitee'),
      path('/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('/token/refresh', TokenRefreshView.as_view(), name='token_refresh'), 
    path('/logout', LogoutView.as_view(), name='logout'),  
]
