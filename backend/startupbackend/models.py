from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
# ===================================================================
# I. ХЭРЭГЛЭГЧИЙН УДИРДЛАГА (USERS & ROLES)
# ===================================================================

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('startup', 'Startup Founder'),
        ('investor', 'Investor'),
        ('admin','Admin')
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='startup',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


# ===================================================================
# II. STARTUP MODEL
# ===================================================================

class Startup(models.Model):

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="startups"
    )

    startup_name = models.CharField(
        max_length=255,
        verbose_name="Стартапын нэр"
    )

    industry = models.CharField(
        max_length=255,
        verbose_name="Салбар"
    )

    STAGE_CHOICES = [
        ('Idea', 'Idea'),
        ('MVP', 'MVP'),
        ('Growth', 'Growth'),
    ]

    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        verbose_name="Хөгжүүлэлтийн шат"
    )

    pitch_deck_link = models.FileField(
        upload_to='description/',
        max_length=500,
        verbose_name="Pitch Deck Link",
        null=True,
        blank=True
    )
    demo_link = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Demo / Website"
    )

    equity_offered = models.DecimalField(
        max_digits=5, decimal_places=2,
        verbose_name="Эзэмшил хувь (%)"
    )


    fund_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name="Татах дүн ($)"
    )

    raised_amount = models.DecimalField(
        max_digits=15, decimal_places=2, default=0,
        verbose_name="Цугласан хөрөнгө"
    )

    fund_purpose = models.TextField(
        verbose_name="Ашиглах зорилго"
    )

    description = models.TextField(
        verbose_name="Дэлгэрэнгүй тайлбар"
    )

    image_url = models.FileField(
        upload_to='images/',
        max_length=500,
        verbose_name="Images",
        null=True,
        blank=True)

    founder_name = models.CharField(
        max_length=255,
        verbose_name="Үүсгэн байгуулагчийн нэр"
    )

    email = models.EmailField(
        verbose_name="Email хаяг"
    )

    linkedin_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="LinkedIn Profile"
    )

    phone_number = models.CharField(
        max_length=20,
        verbose_name="Утасны дугаар"
    )

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Стартап хүсэлт"
        verbose_name_plural = "Стартап хүсэлтүүд"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.startup_name} - {self.status}"


# ===================================================================
# III. TEAM MEMBERS
# ===================================================================

class TeamMember(models.Model):

    ROLE_CHOICES = (
        ('leader', 'Ахлагч'),
        ('member', 'Гишүүн'),
    )

    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name="team_members"
    )

    name = models.CharField(max_length=255)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='member',
        verbose_name="Төрөл"
    )
    image = models.FileField(upload_to='team_members/')
    linkedin_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()}) - {self.startup.startup_name}"


# ===================================================================
# IV. INVESTOR PROFILE 
# ===================================================================

class Investor(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="investor_profile"
    )

    # Step 1: Байгууллагын үндсэн мэдээлэл
    company_name = models.CharField(
        max_length=255, 
        verbose_name="Байгууллагын нэр"
    )
    registration_number = models.CharField(
        max_length=20, 
        unique=True, 
        verbose_name="Регистрийн дугаар"
    )
    website = models.URLField(
        max_length=500, 
        blank=True, 
        null=True, 
        verbose_name="Вэбсайт"
    )

    # Step 2: Төлөөлөгчийн мэдээлэл
    representative_name = models.CharField(
        max_length=255, 
        verbose_name="Төлөөлөх албан тушаалтан"
    )
    contact_email = models.EmailField(
        verbose_name="Холбоо барих мэйл"
    )

    # Нэмэлт (Таны хуучин моделд байсан салбар болон хөрөнгө оруулалтын дүн)
    investment_range = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Хөрөнгө оруулалтын хэмжээ"
    )
    focus_industry = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Сонирхдог салбар"
    )

    # Step 3: Баримт бичиг
    certificate_file = models.FileField(
        upload_to='investor_certificates/',
        null=True,
        blank=True,
        verbose_name="Гэрчилгээний хуулбар"
    )

    is_verified = models.BooleanField(
        default=False, 
        verbose_name="Баталгаажсан эсэх"
    )
    # Газрын зурагт зориулсан координатууд
    address = models.CharField(max_length=500,default='Talbai') # Текст хаяг
    latitude = models.FloatField(null=True, blank=True) # Газрын зургийн координат
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.registration_number})"

    class Meta:
        verbose_name = "Хөрөнгө оруулагч"
        verbose_name_plural = "Хөрөнгө оруулагчид"


# ===================================================================
# V. INVESTMENTS
# ===================================================================

class Investment(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name="investments"
    )

    investor = models.ForeignKey(
        Investor,
        on_delete=models.CASCADE,
        related_name="investments"
    )

    amount = models.DecimalField(max_digits=15, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.investor.company_name} → {self.startup.startup_name} (${self.amount})"


# ===================================================================
# VI. STARTUP Growth
# ===================================================================

class StartupGrowth(models.Model):
    startup = models.ForeignKey(
        'Startup', 
        on_delete=models.CASCADE,
        related_name="growth_metrics"
    )
    # Аль сарын өгөгдөл болох
    label = models.CharField(max_length=20) # Жишээ нь: "1-р сар", "Feb"
    # График дээрх өндөр (0-100 хувиар)
    percentage = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="График дээр харуулах өсөлтийн хувь"
    )
    # Хэзээ бүртгэгдсэн
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Хамгийн сүүлийн 6 сарын өгөгдлийг дарааллаар нь авахын тулд
        ordering = ['created_at']

    def __str__(self):
        return f"{self.startup.startup_name} - {self.label}: {self.percentage}%"


# ===================================================================
# VII. WISHLIST (ХАДГАЛСАН ТӨСЛҮҮД)
# ===================================================================

class Wishlist(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="wishlist_items",
        verbose_name="Хэрэглэгч"
    )
    startup = models.ForeignKey(
        Startup,
        on_delete=models.CASCADE,
        related_name="saved_by_users",
        verbose_name="Стартап"
    )
    
    # Хэзээ хадгалсан хугацаа
    added_at = models.DateTimeField(
        auto_now_add=True, 
        verbose_name="Хадгалсан огноо"
    )

    class Meta:
        # Нэг хэрэглэгч нэг төслийг олон дахин хадгалах боломжгүй болгох
        unique_together = ('user', 'startup')
        verbose_name = "Хадгалсан төсөл"
        verbose_name_plural = "Хадгалсан төслүүд"
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.user.username} - {self.startup.startup_name} ({self.added_at.strftime('%Y-%m-%d')})"
    
# ===================================================================
# VIII. PLATFORM / ABOUT INFO
# ===================================================================

class PlatformStats(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()
    icon = models.CharField(max_length=50, help_text="lucide icon name")

    def __str__(self):
        return f"{self.label}: {self.value}"


class PlatformInfo(models.Model):
    title = models.CharField(max_length=255, verbose_name="Гарчиг")
    subtitle = models.TextField(verbose_name="Дэд тайлбар")

    mission = models.TextField(verbose_name="Зорилго")
    vision = models.TextField(verbose_name="Алсын хараа")

    def __str__(self):
        return self.title


class Core(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    items = models.JSONField(default=list)   
    images = models.JSONField(default=list)  

    def __str__(self):
        return self.title
    
# ===================================================================
# IX.  Content
# ===================================================================

class SiteContent(models.Model):
    page_name = models.CharField(max_length=100, verbose_name="Хуудасны нэр")
    content_key = models.SlugField(unique=True, verbose_name="Түлхүүр үг (Slug)")
    text_content = models.TextField(verbose_name="HTML Агуулга")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.page_name} - {self.content_key}"

    class Meta:
        verbose_name = "Сайтын контент"
        verbose_name_plural = "Сайтын контентууд"


class StartupRequest(models.Model):
    startup_name = models.CharField(max_length=255, verbose_name="Стартап нэр")
    description = models.TextField(verbose_name="Танилцуулга")

    # Хэн илгээв
    startup = models.ForeignKey(
    "Startup",
    on_delete=models.CASCADE,
    related_name="requests_sent"
)

    investor = models.ForeignKey(
        "Investor",
        on_delete=models.CASCADE,
        related_name="requests_received"
    )

    meeting_requested = models.BooleanField(default=False, verbose_name="Уулзалт хүссэн эсэх")

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Хүлээгдэж байна"),
            ("approved", "Зөвшөөрсөн"),
            ("rejected", "Татгалзсан"),
        ],
        default="pending",
        verbose_name="Төлөв"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.startup_name} → {self.investor}"

    class Meta:
        verbose_name = "Стартап хүсэлт"
        verbose_name_plural = "Стартап хүсэлтүүд"


##################chat##############################
# models.py (нэмэх/солих хэсэг)

class ChatRoom(models.Model):
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name="chat_rooms")
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE, related_name="chat_rooms")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('startup', 'investor') # Нэг стартап, нэг хөрөнгө оруулагч хоёрын дунд зөвхөн 1 өрөө байна

    def __str__(self):
        return f"Chat: {self.startup.startup_name} & {self.investor.company_name}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at'] # Мессежүүд хугацааны дарааллаар харагдана

    def __str__(self):
        return f"{self.sender.username}: {self.text[:20]}"