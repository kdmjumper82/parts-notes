"""
Celery configuration for scheduled tasks
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Load configuration from Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Configure periodic tasks
app.conf.beat_schedule = {
    'scrape-stocks-daily': {
        'task': 'stocks.tasks.scrape_stock_industries',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
        # Alternative schedules:
        # 'schedule': crontab(hour='*/6'),  # Every 6 hours
        # 'schedule': crontab(day_of_week=1, hour=0, minute=0),  # Weekly on Monday
    },
}


@app.task(bind=True)
def debug_task(self):
    """Debug task for testing"""
    print(f'Request: {self.request!r}')
