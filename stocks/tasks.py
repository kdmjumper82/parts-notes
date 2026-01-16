"""
Celery tasks for stock scraping
"""
from celery import shared_task
from .scraper import StockIndustryScraper
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def scrape_stock_industries(self):
    """
    Celery task to scrape stock industry data
    This task is scheduled to run periodically
    """
    try:
        logger.info("Starting scheduled stock industry scrape task")
        scraper = StockIndustryScraper()
        scraper.run()
        logger.info(
            f"Scheduled scrape completed successfully. "
            f"Industries: {scraper.scrape_log.industries_scraped}, "
            f"Stocks: {scraper.scrape_log.stocks_scraped}"
        )
        return {
            'status': 'success',
            'industries': scraper.scrape_log.industries_scraped,
            'stocks': scraper.scrape_log.stocks_scraped,
        }
    except Exception as e:
        logger.error(f"Error in scheduled scrape task: {e}")
        # Retry the task with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))


@shared_task
def scrape_single_industry(industry_url, industry_id):
    """
    Task to scrape a single industry's stocks
    Can be called manually or as part of a chain
    """
    from .models import Industry

    try:
        industry = Industry.objects.get(id=industry_id)
        scraper = StockIndustryScraper()
        stocks_count = scraper.scrape_industry_stocks(industry_url, industry)
        logger.info(f"Scraped {stocks_count} stocks for {industry.name}")
        return stocks_count
    except Industry.DoesNotExist:
        logger.error(f"Industry with id {industry_id} not found")
        return 0
    except Exception as e:
        logger.error(f"Error scraping single industry: {e}")
        raise
