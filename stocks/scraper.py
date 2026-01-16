"""
Web scraper for stockanalysis.com industry tables
"""
import time
import requests
from bs4 import BeautifulSoup
from django.utils import timezone
from django.utils.text import slugify
from decimal import Decimal, InvalidOperation
from .models import Industry, Stock, ScrapeLog
import logging

logger = logging.getLogger(__name__)


class StockIndustryScraper:
    """Scraper for stock industry data from stockanalysis.com"""

    BASE_URL = "https://stockanalysis.com/stocks/industry/"

    # Headers to avoid 403 errors
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
    }

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)
        self.scrape_log = None

    def clean_number(self, value):
        """Clean and convert string numbers to Decimal"""
        if not value or value == '-' or value == 'N/A':
            return None

        try:
            # Remove common formatting
            cleaned = value.strip().replace(',', '').replace('$', '').replace('%', '')

            # Handle billions (B) and millions (M)
            multiplier = 1
            if 'B' in cleaned.upper():
                multiplier = 1_000_000_000
                cleaned = cleaned.upper().replace('B', '')
            elif 'M' in cleaned.upper():
                multiplier = 1_000_000
                cleaned = cleaned.upper().replace('M', '')
            elif 'K' in cleaned.upper():
                multiplier = 1_000
                cleaned = cleaned.upper().replace('K', '')

            # Convert to Decimal
            num = Decimal(cleaned) * multiplier
            return num
        except (InvalidOperation, ValueError) as e:
            logger.warning(f"Could not convert '{value}' to number: {e}")
            return None

    def start_scrape_log(self):
        """Create a new scrape log entry"""
        self.scrape_log = ScrapeLog.objects.create(status='started')
        logger.info(f"Started scrape log {self.scrape_log.id}")
        return self.scrape_log

    def update_scrape_log(self, status, industries_count=0, stocks_count=0, error=None):
        """Update the scrape log with results"""
        if self.scrape_log:
            self.scrape_log.status = status
            self.scrape_log.industries_scraped = industries_count
            self.scrape_log.stocks_scraped = stocks_count
            self.scrape_log.completed_at = timezone.now()
            if error:
                self.scrape_log.error_message = str(error)
            self.scrape_log.save()
            logger.info(f"Updated scrape log {self.scrape_log.id}: {status}")

    def fetch_page(self, url, max_retries=3):
        """Fetch a page with retry logic"""
        for attempt in range(max_retries):
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                logger.info(f"Successfully fetched {url}")
                return response
            except requests.RequestException as e:
                logger.warning(f"Attempt {attempt + 1}/{max_retries} failed for {url}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    raise
        return None

    def scrape_industries_table(self):
        """Scrape the main industries table"""
        logger.info("Starting to scrape industries table")
        self.start_scrape_log()

        try:
            response = self.fetch_page(self.BASE_URL)
            soup = BeautifulSoup(response.content, 'lxml')

            # Find the table - adjust selectors based on actual page structure
            table = soup.find('table')

            if not table:
                logger.error("Could not find table on page")
                self.update_scrape_log('failed', error="Table not found on page")
                return

            # Extract table headers
            headers = []
            header_row = table.find('thead')
            if header_row:
                headers = [th.get_text(strip=True) for th in header_row.find_all('th')]
            logger.info(f"Found headers: {headers}")

            # Extract table rows
            tbody = table.find('tbody')
            if not tbody:
                logger.error("Could not find tbody")
                self.update_scrape_log('failed', error="Table body not found")
                return

            rows = tbody.find_all('tr')
            industries_count = 0
            stocks_count = 0

            for row in rows:
                try:
                    cells = row.find_all('td')
                    if len(cells) < 2:
                        continue

                    # Extract industry data (adjust indices based on actual table structure)
                    # Common structure: Industry Name | Stock Count | Market Cap | Performance metrics
                    industry_name_cell = cells[0]
                    industry_link = industry_name_cell.find('a')

                    if not industry_link:
                        continue

                    industry_name = industry_link.get_text(strip=True)
                    industry_url = industry_link.get('href', '')
                    if industry_url and not industry_url.startswith('http'):
                        industry_url = f"https://stockanalysis.com{industry_url}"

                    # Extract other data from cells
                    stock_count = self.clean_number(cells[1].get_text(strip=True)) if len(cells) > 1 else None
                    market_cap = self.clean_number(cells[2].get_text(strip=True)) if len(cells) > 2 else None

                    # Create or update industry
                    industry, created = Industry.objects.update_or_create(
                        name=industry_name,
                        defaults={
                            'slug': slugify(industry_name),
                            'stock_count': int(stock_count) if stock_count else 0,
                            'market_cap': market_cap,
                            'url': industry_url,
                            'last_scraped': timezone.now(),
                        }
                    )

                    # Extract performance metrics if available (adjust indices)
                    if len(cells) > 3:
                        # Try to map remaining cells to performance metrics
                        # This is an example - adjust based on actual table structure
                        performance_mapping = {
                            3: 'performance_1d',
                            4: 'performance_1w',
                            5: 'performance_1m',
                            6: 'performance_ytd',
                            7: 'performance_1y',
                        }

                        for idx, field_name in performance_mapping.items():
                            if idx < len(cells):
                                value = self.clean_number(cells[idx].get_text(strip=True))
                                if value is not None:
                                    setattr(industry, field_name, value)

                        industry.save()

                    industries_count += 1
                    logger.info(f"Processed industry: {industry_name}")

                    # Optionally scrape individual industry pages for stock details
                    # Uncomment below to scrape detailed stock data for each industry
                    # time.sleep(1)  # Be respectful with rate limiting
                    # stocks = self.scrape_industry_stocks(industry_url, industry)
                    # stocks_count += stocks

                except Exception as e:
                    logger.error(f"Error processing row: {e}")
                    continue

            logger.info(f"Scraping completed: {industries_count} industries, {stocks_count} stocks")
            self.update_scrape_log('success', industries_count, stocks_count)

        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            self.update_scrape_log('failed', error=str(e))
            raise

    def scrape_industry_stocks(self, industry_url, industry):
        """Scrape individual stocks from an industry page"""
        if not industry_url:
            return 0

        try:
            logger.info(f"Scraping stocks for {industry.name} from {industry_url}")
            response = self.fetch_page(industry_url)
            soup = BeautifulSoup(response.content, 'lxml')

            # Find the stocks table
            table = soup.find('table')
            if not table:
                logger.warning(f"No table found for {industry.name}")
                return 0

            tbody = table.find('tbody')
            if not tbody:
                return 0

            rows = tbody.find_all('tr')
            stocks_count = 0

            for row in rows:
                try:
                    cells = row.find_all('td')
                    if len(cells) < 2:
                        continue

                    # Extract stock data (adjust based on actual table structure)
                    symbol_cell = cells[0]
                    symbol_link = symbol_cell.find('a')

                    if not symbol_link:
                        continue

                    symbol = symbol_link.get_text(strip=True)
                    name = cells[1].get_text(strip=True) if len(cells) > 1 else symbol

                    # Extract additional stock data
                    price = self.clean_number(cells[2].get_text(strip=True)) if len(cells) > 2 else None
                    change_percent = self.clean_number(cells[3].get_text(strip=True)) if len(cells) > 3 else None
                    market_cap = self.clean_number(cells[4].get_text(strip=True)) if len(cells) > 4 else None
                    volume = self.clean_number(cells[5].get_text(strip=True)) if len(cells) > 5 else None

                    stock_url = symbol_link.get('href', '')
                    if stock_url and not stock_url.startswith('http'):
                        stock_url = f"https://stockanalysis.com{stock_url}"

                    # Create or update stock
                    Stock.objects.update_or_create(
                        symbol=symbol,
                        defaults={
                            'name': name,
                            'industry': industry,
                            'price': price,
                            'change_percent': change_percent,
                            'market_cap': market_cap,
                            'volume': int(volume) if volume else None,
                            'url': stock_url,
                            'last_scraped': timezone.now(),
                        }
                    )

                    stocks_count += 1

                except Exception as e:
                    logger.error(f"Error processing stock row: {e}")
                    continue

            logger.info(f"Processed {stocks_count} stocks for {industry.name}")
            return stocks_count

        except Exception as e:
            logger.error(f"Error scraping industry stocks: {e}")
            return 0

    def run(self):
        """Main method to run the scraper"""
        logger.info("=" * 50)
        logger.info("Starting Stock Industry Scraper")
        logger.info("=" * 50)
        self.scrape_industries_table()
        logger.info("Scraping completed")
        logger.info("=" * 50)
