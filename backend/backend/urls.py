"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from startupbackend.views import RegisterView,ProjectViewSet,InvestorViewSet,WishlistViewSet,StartupGrowthViewSet,SiteContentViewSet,TeamMemberViewSet,StartupRequestViewSet,MyStartupViewSet
from startupbackend.views import InvestmentViewSet,ChatRoomViewSet,MessageViewSet,ProfileView,ChangePasswordView
from startupbackend.views import startup_stats,user_growth

# startupbackend/urls.py

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'investors', InvestorViewSet, basename='investors')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

# Queryset-гүй эсвэл динамик шүүлтүүртэй бүх ViewSet-д basename нэмэх:
router.register(r'startup-growth', StartupGrowthViewSet, basename='startup-growth')
router.register(r'contents', SiteContentViewSet, basename='contents')
router.register(r'team-members', TeamMemberViewSet, basename='team-members')
router.register(r"startup-requests", StartupRequestViewSet, basename='startup-requests')
router.register(r'my-projects', MyStartupViewSet, basename='my-startup')

# Энэ мөр өмнө нь алдаа зааж байсан хэсэг:
router.register(r'investments', InvestmentViewSet, basename='investment')

router.register(r'rooms', ChatRoomViewSet, basename='chatmessage')
router.register(r'messages', MessageViewSet, basename='message')


urlpatterns = [
    path('admin/', admin.site.urls),

    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('projects/stats/', startup_stats, name='project-stats'),
    path('projects/user-growth/', user_growth),

    path("profile", ProfileView.as_view()),
    path("change-password", ChangePasswordView.as_view()),

    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
