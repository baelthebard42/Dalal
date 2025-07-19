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

     path('/update/recruitee/description', UpdateRecruiteeDescription.as_view()),
    
    path('/update/recruitee/address', UpdateRecruiteeAddress.as_view()),
    path('/update/recruitee/preferences', UpdateRecruiteePreferences.as_view()),

        path('/update/recruiter/address', UpdateRecruiterAddress.as_view()),
    path('/update/recruiter/preferences', UpdateRecruiterPreferences.as_view()),
    path('/update/recruiter/needs', UpdateRecruiterNeeds.as_view()),
    path('/response', Dalal.as_view())

]
