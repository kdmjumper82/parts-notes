from django.contrib import admin
from .models import Industry, Stock, ScrapeLog


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ['name', 'stock_count', 'market_cap', 'performance_1d', 'performance_1m', 'performance_1y', 'last_scraped']
    list_filter = ['last_scraped', 'created_at']
    search_fields = ['name', 'slug']
    readonly_fields = ['created_at', 'updated_at', 'last_scraped']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['symbol', 'name', 'industry', 'price', 'change_percent', 'market_cap', 'volume', 'last_scraped']
    list_filter = ['industry', 'exchange', 'last_scraped']
    search_fields = ['symbol', 'name']
    readonly_fields = ['created_at', 'updated_at', 'last_scraped']
    raw_id_fields = ['industry']


@admin.register(ScrapeLog)
class ScrapeLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'started_at', 'completed_at', 'industries_scraped', 'stocks_scraped']
    list_filter = ['status', 'started_at']
    readonly_fields = ['started_at', 'completed_at']
