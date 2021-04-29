from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
                                        PermissionsMixin


class UserManager(BaseUserManager):
    
    def create_user(self, name,email, phone, birthday, password=None, **extra_fields):
        """ Creates and saves a new user """
        
        if not email:
            raise ValueError("Users must have an email address")
        if not phone:
            raise ValueError('Not a valid phone number')
        if not birthday:
            raise ValueError("Not a valid birthday")

        user = self.model(email=email,name=name, phone=phone, birthday=birthday, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, phone='+355698567597'):
        """ Creates and saves a new superuser """
        user = self.model(email=email, phone=phone, birthday='1998-03-24')
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


  
class User(AbstractBaseUser, PermissionsMixin):
    """ Custom user model that supports email instead of username """
    email = models.EmailField(max_length=255, unique=True,null=False)
    name = models.CharField(max_length=255, null=False)
    phone = models.CharField(max_length=15, null=False)
    birthday = models.DateField(null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = 'email'

    def age(self):
        import datetime
        dob = self.birthday
        tod = datetime.date.today()
        age = (tod.year - dob.year) - int((tod.month, tod.day)<(dob.month, dob.day))
        return age