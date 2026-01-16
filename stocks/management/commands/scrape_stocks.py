"""
Django management command to scrape stock industry data
"""
from django.core.management.base import BaseCommand
from stocks.scraper import StockIndustryScraper
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class Command(BaseCommand):
    help = 'Scrape stock industry data from stockanalysis.com'

    def add_arguments(self, parser):
        parser.add_argument(
            '--include-stocks',
            action='store_true',
            help='Also scrape individual stock details for each industry (takes longer)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting stock industry scraper...'))

        try:
            scraper = StockIndustryScraper()
            scraper.run()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully scraped data!\n'
                    f'Industries: {scraper.scrape_log.industries_scraped}\n'
                    f'Stocks: {scraper.scrape_log.stocks_scraped}'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error during scraping: {str(e)}')
            )
            raise
