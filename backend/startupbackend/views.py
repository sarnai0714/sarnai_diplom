import anthropic
from .models import *
from rest_framework import generics,viewsets,permissions,status,serializers,parsers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import CustomUserCreateSerializer,ProjectSerializer,InvestorSerializer,WishlistSerializer,StartupGrowthSerializer,SiteContentSerializer,TeamMemberSerializer
from .serializers import StartupRequestSerializer,InvestmentSerializer,MessageSerializer,ChatRoomSerializer,CustomUserSerializer
from django.contrib.auth import get_user_model
from .permissions import IsStartup,IsAdmin,IsInvestor
from django.db import transaction
from rest_framework.exceptions import PermissionDenied,ValidationError
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action, api_view,permission_classes
from django.db.models import Count, Sum  # <--- Үүнийг нэм
import datetime
from django.utils.timezone import now
from django.conf import settings
from rest_framework.views import APIView
from django.db.models.functions import TruncMonth
from django.db.models import Q

User = get_user_model()

@csrf_exempt
def image_upload(request):
    if request.method == "POST":
        file = request.FILES['file'] # TinyMCE 'file' гэж явуулдаг
        file_name = default_storage.save(f"tinymce/{file.name}", file)
        file_url = default_storage.url(file_name)
        
        # TinyMCE-д заавал 'location' гэсэн түлхүүрээр хариу өгөх ёстой
        return JsonResponse({'location': f"http://127.0.0.1:8000{file_url}"})
    

@api_view(['GET'])
@permission_classes([AllowAny])  # Энэ мөр "Authentication credentials were not provided" алдааг арилгана
def startup_stats(request):
    # 1. Үндсэн тоонууд
    startup_count = Startup.objects.count()
    user_count = CustomUser.objects.count() 
    investor_count = Investor.objects.count()

    # 2. Нийт санхүүжилтийг DB түвшинд тооцоолох
    # s.fund_amount-ийг float болгож заавал хөрвүүлэх шаардлагагүй, DB Sum илүү хурдан
    total_funding_data = Startup.objects.aggregate(total=Sum('fund_amount'))
    total_funding = total_funding_data['total'] or 0

    # 3. Салбараар нь ангилж тоолох (Frontend-ийн BarChart-д зориулсан)
    industry_data = (
        Startup.objects.values('industry')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # Жагсаалтыг React-д ойлгомжтой формат руу хөрвүүлэх
    categories = [
        {"name": item['industry'], "count": item['count']} 
        for item in industry_data
    ]

    return Response({
        "startup_count": startup_count,
        "investor_count": investor_count,
        "user_count": user_count,
        "total_funding": total_funding,
        "categories": categories  # Графикийн өгөгдөл
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def user_growth(request):
    data = (
        User.objects
        .annotate(month=TruncMonth('date_joined'))
        .values('month')
        .annotate(user_count=Count('id'))
        .order_by('month')
    )

    # dict болгох (lookup хурдан)
    data_dict = {
        item["month"].strftime("%Y-%m"): item["user_count"]
        for item in data
    }

    result = []
    total = 0

    current = now().replace(day=1)
    start = current - datetime.timedelta(days=180)  # сүүлийн 6 сар

    while start <= current:
        key = start.strftime("%Y-%m")
        count = data_dict.get(key, 0)

        total += count

        result.append({
            "month": f"{start.month}-р сар",
            "user_count": total
        })

        # дараагийн сар
        if start.month == 12:
            start = start.replace(year=start.year + 1, month=1)
        else:
            start = start.replace(month=start.month + 1)

    return Response(result)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomUserCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Хэрэглэгч амжилттай бүртгэгдлээ",
                "user": CustomUserCreateSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )
    
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # profile авах
    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

    # profile update
    def put(self, request):

        serializer = CustomUserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response(
                {"error": "Хуучин нууц үг буруу байна"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({"message": "Нууц үг амжилттай солигдлоо"})

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Startup.objects.all()

        # ----------------------------
        # 1. ROLE FILTER (existing logic)
        # ----------------------------
        if not (user.is_authenticated and hasattr(user, 'role') and user.role == 'admin'):
            queryset = queryset.filter(status="accepted")

        # ----------------------------
        # 2. QUERY PARAM FILTERS
        # ----------------------------
        industry = self.request.query_params.get("industry")
        min_fund = self.request.query_params.get("min_fund")
        max_fund = self.request.query_params.get("max_fund")

        # Industry filter
        if industry:
            queryset = queryset.filter(industry=industry)

        # Fund range filter
        if min_fund:
            queryset = queryset.filter(fund_amount__gte=min_fund)

        if max_fund:
            queryset = queryset.filter(fund_amount__lte=max_fund)

        return queryset

    # ----------------------------
    # PERMISSIONS (unchanged)
    # ----------------------------
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        elif self.action == 'create':
            permission_classes = [IsStartup]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    # ----------------------------
    # CREATE (unchanged)
    # ----------------------------
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            "message": "Таны стартап бүртгүүлэх хүсэлт амжилттай илгээгдлээ.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    # ----------------------------
    # STATUS UPDATE (unchanged)
    # ----------------------------
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        startup = self.get_object()
        new_status = request.data.get('status')

        valid_statuses = [choice[0] for choice in Startup.STATUS_CHOICES]

        if new_status not in valid_statuses:
            return Response(
                {
                    "error": f"Буруу төлөв. Дараах утгууд: {', '.join(valid_statuses)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        startup.status = new_status
        startup.save()

        return Response({
            "message": f"Төлөв '{new_status}' болж өөрчлөгдлөө.",
            "status": startup.status
        })
class MyStartupViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Startup.objects.filter(user=self.request.user)
class InvestorViewSet(viewsets.ModelViewSet):
    serializer_class = InvestorSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        return Investor.objects.annotate(
            invested_count=Count('investments', distinct=True)
        )

    def create(self, request, *args, **kwargs):
        reg_num = request.data.get('registration_number')

        # 1 user = 1 investor only
        if Investor.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Та аль хэдийн investor profile үүсгэсэн байна."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Investor.objects.filter(registration_number=reg_num).exists():
            return Response(
                {"detail": "Энэ регистрийн дугаар бүртгэлтэй байна."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(
            {
                "message": "Investor амжилттай үүсгэлээ",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    def perform_create(self, serializer):
        user = self.request.user

        # role зөв тохируулах
        if user.role != "investor":
            user.role = "investor"
            user.save()

        with transaction.atomic():
            serializer.save(user=user)
class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all().order_by('-created_at')
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Investment.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        try:
            investor_profile = self.request.user.investor_profile
        except Investor.DoesNotExist:
            raise ValidationError("Танд хөрөнгө оруулагчийн профиль алга.")

        serializer.save(investor=investor_profile)
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != "investor":
            raise PermissionDenied(
                "Зөвхөн хөрөнгө оруулагч хэрэглэгч төсөл хадгалах боломжтой."
            )

        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(
            {
                "message": "Төсөл амжилттай хадгалагдлаа ❤️",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

class ListView(serializers.ModelSerializer):
    """Хэрэглэгч өөрийн илгээсэн хүсэлтүүдийг харах хэсэг"""
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Startup.objects.filter(user=self.request.user)

class StartupGrowthViewSet(viewsets.ModelViewSet):
    queryset = StartupGrowth.objects.all()
    serializer_class = StartupGrowthSerializer
    permission_classes = [AllowAny]

    # Сүүлийн 6 сарын өгөгдлийг шүүж авах нэмэлт функц (сонголтоор)
    def get_queryset(self):
        startup_id = self.request.query_params.get('startup_id')
        if startup_id:
            return StartupGrowth.objects.filter(startup_id=startup_id).order_by('created_at')[:6]
        return super().get_queryset()
    
class SiteContentViewSet(viewsets.ModelViewSet):
    queryset = SiteContent.objects.all()
    serializer_class = SiteContentSerializer
    permission_classes = [AllowAny]
    # id-аар биш slug-аар (content_key) хандах тохиргоо
    lookup_field = 'content_key'


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = TeamMember.objects.all()
        startup_id = self.request.query_params.get('startup_id')
        if startup_id is not None:
            queryset = queryset.filter(startup_id=startup_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {
                "message": "Гишүүн амжилттай нэмэгдлээ",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
class StartupRequestViewSet(viewsets.ModelViewSet):
    queryset = StartupRequest.objects.all()
    serializer_class = StartupRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ✅ ROLE-BASED DATA FILTERING
    def get_queryset(self):
        user = self.request.user

        # Investor → зөвхөн өөрт хамаарах request
        if getattr(user, "role", None) == "investor":
            return StartupRequest.objects.filter(investor__user=user)

        # Startup → өөрийн илгээсэн request
        if getattr(user, "role", None) == "startup":
            return StartupRequest.objects.filter(startup__user=user)

        return StartupRequest.objects.none()
    

    # ✅ STARTUP ONLY CREATE REQUEST
    def perform_create(self, serializer):
        user = self.request.user

        if getattr(user, "role", None) != "startup":
            raise PermissionDenied("Зөвхөн startup хүсэлт илгээж болно")

        serializer.save()

    # ✅ CUSTOM RESPONSE (optional)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response(
            {
                "message": "Хүсэлт амжилттай илгээгдлээ",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    

class ChatRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Модел дээр investor нь Investor модел учраас investor__user гэж шүүнэ
        return ChatRoom.objects.filter(
            Q(startup__user=user) | Q(investor__user=user)
        )

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != 'investor':
            raise PermissionDenied("Зөвхөн investor room үүсгэнэ")

        try:
            investor = user.investor_profile
        except Investor.DoesNotExist:
            raise ValidationError("Investor profile олдсонгүй")

        serializer.save(investor=investor)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Зөвхөн тухайн өрөөний (room_id) мессежүүдийг авах
        room_id = self.request.query_params.get('room')
        if room_id:
            return Message.objects.filter(room_id=room_id)
        return Message.objects.none()

    def perform_create(self, serializer):
        room_id = self.request.data.get('room')
        room = ChatRoom.objects.get(id=room_id)
        # Мессеж илгээгчийг одоогийн хэрэглэгчээр тохируулах
        serializer.save(sender=self.request.user, room=room)
    
    
