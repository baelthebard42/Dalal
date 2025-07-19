from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, user_type=None):
        if not username or not user_type:
            raise ValueError("Username and user_type are required")
        user = self.model(username=username, user_type=user_type)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password):
        user = self.create_user(username=username, password=password, user_type='admin')
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    USER_TYPES = (
        ('recruiter', 'Recruiter'),
        ('recruitee', 'Recruitee'),
    )
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
    
    @property
    def is_staff(self):
        return self.is_admin


class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.CharField(max_length=255)
    looking_for = models.TextField()

    def __str__(self):
        return self.user.username


class RecruiteeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dob = models.DateField()
    interests = models.TextField()
    description = models.TextField()

    def __str__(self):
        return self.user.username
