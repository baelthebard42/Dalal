from django.urls import path
from .views import *

urlpatterns = [
     path('/register/recruiter', RegisterRecruiter.as_view(), name='register_recruiter'),
    path('/register/recruitee', RegisterRecruitee.as_view(), name='register_recruitee'),
]
