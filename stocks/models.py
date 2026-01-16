from django.db import models
from django.utils import timezone


class Industry(models.Model):
    """Model to store stock industry information"""
    name = models.CharField(max_length=200, unique=True, db_index=True)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    stock_count = models.IntegerField(default=0)
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)

    # Performance metrics
    performance_1d = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="1 day performance %")
    performance_1w = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="1 week performance %")
    performance_1m = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="1 month performance %")
    performance_3m = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="3 month performance %")
    performance_6m = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="6 month performance %")
    performance_ytd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Year to date performance %")
    performance_1y = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="1 year performance %")
    performance_3y = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="3 year performance %")
    performance_5y = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="5 year performance %")

    # Additional metrics that might be available
    average_volume = models.BigIntegerField(null=True, blank=True)
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dividend_yield = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Metadata
    url = models.URLField(max_length=500, blank=True, null=True)
    last_scraped = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Industry"
        verbose_name_plural = "Industries"
        ordering = ['-market_cap', 'name']

    def __str__(self):
        return self.name


class Stock(models.Model):
    """Model to store individual stock information within industries"""
    symbol = models.CharField(max_length=10, unique=True, db_index=True)
    name = models.CharField(max_length=200)
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE, related_name='stocks')

    # Stock details
    price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    change = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price change")
    change_percent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Price change %")
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    volume = models.BigIntegerField(null=True, blank=True)

    # Valuation metrics
    pe_ratio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    eps = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dividend_yield = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    beta = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)

    # Performance metrics
    performance_1d = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    performance_1w = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    performance_1m = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    performance_ytd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    performance_1y = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # Additional data
    sector = models.CharField(max_length=200, blank=True, null=True)
    exchange = models.CharField(max_length=50, blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)

    # Metadata
    last_scraped = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Stock"
        verbose_name_plural = "Stocks"
        ordering = ['-market_cap', 'symbol']

    def __str__(self):
        return f"{self.symbol} - {self.name}"


class ScrapeLog(models.Model):
    """Model to track scraping activities"""
    STATUS_CHOICES = [
        ('started', 'Started'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('partial', 'Partial Success'),
    ]

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='started')
    industries_scraped = models.IntegerField(default=0)
    stocks_scraped = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Scrape Log"
        verbose_name_plural = "Scrape Logs"
        ordering = ['-started_at']

    def __str__(self):
        return f"Scrape {self.id} - {self.status} at {self.started_at}"
