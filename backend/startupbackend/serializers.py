from .models import *
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers

class CustomUserSerializer(UserSerializer):

    class Meta:
        model = CustomUser
        fields = ("id", "username", "first_name","last_name","email","password","role")
        extra_kwargs = {'password': {'write_only': True}}

class CustomUserCreateSerializer(UserCreateSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ("id", "username", "first_name","last_name", "email", "password","role")

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
        first_name=validated_data.get("first_name", ""),
        last_name=validated_data.get("last_name", ""),
        email=validated_data["email"],
        password=validated_data["password"],
        role=validated_data.get("role"),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    def to_representation(self, instance):
        return CustomUserSerializer(instance, context=self.context).data
    

class TeamMemberSerializer(serializers.ModelSerializer):
    # Ролийн тайлбарыг (Ахлагч, Гишүүн) уншигдахуйц байдлаар авах
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    team_members = TeamMemberSerializer(many=True, read_only=True)
    class Meta:
        model = Startup
        # Хэрэглэгч бөглөх шаардлагагүй талбаруудыг read_only болгоно
        read_only_fields = ['user', 'status', 'created_at', 'updated_at']
        fields = '__all__'

    def validate_phone_number(self, value):
        # Утасны дугаар зөвхөн тоо байх эсвэл формат шалгах логик нэмж болно
        if not value.isdigit():
            raise serializers.ValidationError("Утасны дугаар зөвхөн тооноос бүрдэх ёстой.")
        return value
    
class InvestorSerializer(serializers.ModelSerializer):
    invested_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Investor
        # Бүх талбарыг авахын оронд талбаруудыг нэрлэж өгөх нь аюулгүй байдалд тустай
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def validate_registration_number(self, value):
        """
        Регистрийн дугаарын давхцлыг шалгах логик
        """
        # 1. Хоосон утга эсвэл формат шалгах (нэмэлтээр)
        if not value:
            raise serializers.ValidationError("Регистрийн дугаар заавал байх ёстой.")

        # 2. Өөрийгөө оролцуулахгүйгээр (Update үед) давхцлыг шалгах
        # self.instance байгаа эсэхийг шалгаад, байвал түүний ID-г хасна
        queryset = Investor.objects.filter(registration_number=value)
        
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Энэ регистрийн дугаартай байгууллага аль хэдийн бүртгэгдсэн байна."
            )
            
        return value

    def create(self, validated_data):
        """
        Шинээр үүсгэх үед context-оос хэрэглэгчийг авах боломжтой
        """
        # Жишээ: Хэрэв request.user-ийг investor-той холбох бол
        # validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    

class InvestmentSerializer(serializers.ModelSerializer):
    # Уншихад хялбар болгох үүднээс нэмэлт талбаруудыг харуулж болно
    startup_details = ProjectSerializer(source='startup', read_only=True)
    investor_name = serializers.ReadOnlyField(source='investor.company_name')

    def __init__(self, *args, **kwargs):
        super(InvestmentSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Investment
        fields = '__all__'
        read_only_fields = ['status', 'created_at','investor'] #
    
class WishlistSerializer(serializers.ModelSerializer):
    startup_details = ProjectSerializer(source='startup', read_only=True)
    class Meta:
        model = Wishlist
        fields = '__all__'
        read_only_fields = ['added_at','user']

        
    def validate(self, data):
        user = self.context['request'].user
        startup = data.get('startup')

        if Wishlist.objects.filter(user=user, startup=startup).exists():
            raise serializers.ValidationError("Та энэ стартапыг аль хэдийн хадгалсан байна.")

        return data
    
class StartupGrowthSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupGrowth
        fields = '__all__'
        read_only_fields = ['created_at']

class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = '__all__'


class StartupRequestSerializer(serializers.ModelSerializer):
    startup_detail = ProjectSerializer(source='startup', read_only=True)
    investor_detail = InvestorSerializer(source='investor', read_only=True)

    class Meta:
        model = StartupRequest
        fields = "__all__"
        # startup_name-ийг энд read_only болгочихвол Frontend-ээс заавал явуулах албагүй болно
        read_only_fields = ["status", "created_at", "startup_name"]

    def create(self, validated_data):
        # Хэрэв startup холбоос байгаа бол түүний нэрийг startup_name-д оноох
        startup_obj = validated_data.get('startup')
        if startup_obj:
            validated_data['startup_name'] = startup_obj.startup_name
        
        return super().create(validated_data)
    
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'sender_name', 'text', 'is_read', 'created_at']
        read_only_fields = ['sender', 'room']

class ChatRoomSerializer(serializers.ModelSerializer):
    startup_name = serializers.ReadOnlyField(source='startup.startup_name')
    investor_name = serializers.ReadOnlyField(source='investor.company_name')
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = '__all__'
        read_only_fields = ['investor']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None