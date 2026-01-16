# Stock Industry Scraper - Backend Documentation

This Django application scrapes stock industry data from stockanalysis.com and stores it in a database with scheduled updates.

## Features

- Scrapes industry tables from stockanalysis.com
- Stores comprehensive stock and industry data
- Scheduled daily updates using Celery
- Django admin interface for data management
- Comprehensive logging and error tracking

## Project Structure

```
/home/user/parts-notes/
├── backend/              # Django project configuration
│   ├── __init__.py
│   ├── celery.py        # Celery configuration
│   ├── settings.py      # Django settings
│   ├── urls.py
│   └── wsgi.py
├── stocks/              # Stock scraping app
│   ├── admin.py         # Admin interface
│   ├── models.py        # Database models
│   ├── scraper.py       # Web scraping logic
│   ├── tasks.py         # Celery tasks
│   ├── management/
│   │   └── commands/
│   │       └── scrape_stocks.py  # Manual scraping command
│   └── migrations/
├── manage.py
└── requirements.txt
```

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install and Start Redis

Redis is required for Celery task queue.

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Windows:**
Download from https://redis.io/download or use WSL

### 3. Database Setup

Run migrations to create the database tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

To access the Django admin interface:

```bash
python manage.py createsuperuser
```

## Usage

### Manual Scraping

Run the scraper manually using the Django management command:

```bash
python manage.py scrape_stocks
```

This will scrape the industry table and save data to the database.

### Scheduled Scraping

The scraper runs automatically using Celery Beat.

#### Start Celery Worker

In one terminal window:

```bash
celery -A backend worker --loglevel=info
```

#### Start Celery Beat (Scheduler)

In another terminal window:

```bash
celery -A backend beat --loglevel=info
```

By default, the scraper runs **daily at midnight**. You can modify the schedule in `backend/celery.py`:

```python
app.conf.beat_schedule = {
    'scrape-stocks-daily': {
        'task': 'stocks.tasks.scrape_stock_industries',
        'schedule': crontab(hour=0, minute=0),  # Daily at midnight
        # Alternative schedules:
        # 'schedule': crontab(hour='*/6'),  # Every 6 hours
        # 'schedule': crontab(day_of_week=1, hour=0, minute=0),  # Weekly on Monday
    },
}
```

### Run Development Server

```bash
python manage.py runserver
```

Access the admin interface at: http://127.0.0.1:8000/admin/

## Data Models

### Industry Model

Stores industry-level data:
- Name, slug, description
- Stock count
- Market capitalization
- Performance metrics (1d, 1w, 1m, 3m, 6m, YTD, 1y, 3y, 5y)
- Average volume, P/E ratio, dividend yield
- URL and scrape timestamps

### Stock Model

Stores individual stock data within industries:
- Symbol, name
- Industry (foreign key)
- Price, change, change percentage
- Market cap, volume
- Valuation metrics (P/E, EPS, dividend yield, beta)
- Performance metrics
- Sector, exchange, URL
- Scrape timestamps

### ScrapeLog Model

Tracks scraping activities:
- Start and completion timestamps
- Status (started, success, failed, partial)
- Counts of industries and stocks scraped
- Error messages

## Monitoring

### View Logs in Django Admin

1. Access admin at http://127.0.0.1:8000/admin/
2. Navigate to "Scrape Logs" to see scraping history
3. Check Industries and Stocks for scraped data

### Check Celery Tasks

Monitor Celery tasks in real-time:

```bash
celery -A backend events
```

View active tasks:

```bash
celery -A backend inspect active
```

### Database Queries

Access Django shell for custom queries:

```bash
python manage.py shell
```

```python
from stocks.models import Industry, Stock, ScrapeLog

# Get all industries
industries = Industry.objects.all()

# Get recent scrapes
recent_scrapes = ScrapeLog.objects.filter(status='success').order_by('-started_at')[:5]

# Get stocks in a specific industry
tech_stocks = Stock.objects.filter(industry__name__icontains='technology')
```

## Customization

### Adjust Scraping Frequency

Edit `backend/celery.py` and modify the `beat_schedule`:

```python
# Every 6 hours
'schedule': crontab(hour='*/6')

# Twice daily (8 AM and 8 PM)
'schedule': crontab(hour='8,20', minute=0)

# Weekly on Monday at 3 AM
'schedule': crontab(day_of_week=1, hour=3, minute=0)
```

### Extend Data Fields

Add custom fields to models in `stocks/models.py`, then run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Customize Scraping Logic

Modify `stocks/scraper.py` to:
- Add additional data fields
- Scrape individual stock pages
- Implement custom parsing logic
- Add rate limiting or proxy support

## Troubleshooting

### 403 Forbidden Errors

If the scraper gets blocked:
1. The scraper already includes proper headers
2. Consider adding delays between requests in `scraper.py`
3. Use a proxy service if needed
4. Respect robots.txt and rate limits

### Redis Connection Errors

Ensure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### Migration Issues

Reset migrations (development only):
```bash
python manage.py migrate stocks zero
rm stocks/migrations/000*.py
python manage.py makemigrations stocks
python manage.py migrate
```

## Production Deployment

### Use PostgreSQL or MySQL

Update `backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'stocks_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Set Environment Variables

Create a `.env` file:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgres://user:password@localhost/dbname
REDIS_URL=redis://localhost:6379/0
```

### Use a Process Manager

For production, use systemd, supervisor, or Docker to manage processes:

```bash
# Celery worker
celery -A backend worker --loglevel=info

# Celery beat
celery -A backend beat --loglevel=info

# Django with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Setup Monitoring

Consider using:
- Flower for Celery monitoring: `pip install flower`
- Sentry for error tracking
- Prometheus + Grafana for metrics

## API Integration (Future Enhancement)

To expose data via REST API, add Django REST Framework:

```bash
pip install djangorestframework
```

Then create serializers and views in the stocks app.

## License

This project is for educational and research purposes. Ensure compliance with stockanalysis.com's terms of service and robots.txt when scraping.

## Support

For issues or questions:
1. Check the Django logs
2. Review Celery worker/beat logs
3. Examine ScrapeLog entries in Django admin
4. Verify Redis is running and accessible
