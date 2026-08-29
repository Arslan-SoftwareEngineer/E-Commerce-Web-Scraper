import requests
from bs4 import BeautifulSoup
import pandas as pd
import logging

# Configure logging
logging.basicConfig(
    filename='scraper.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def scrape_ecommerce(max_pages=2):
    base_url = "http://books.toscrape.com/catalogue/page-{}.html"
    data = []

    for page in range(1, max_pages + 1):
        logging.info(f"Scraping page {page}...")
        try:
            response = requests.get(base_url.format(page), timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            items = soup.find_all('article', class_='product_pod')
            if not items:
                print(f"DEBUG: No items found on page {page}. First 500 chars of response:\n{response.text[:500]}")
                logging.warning(f"No products found on page {page}.")
                continue

            for item in items:
                try:
                    data.append({
                        'name': item.h3.a['title'],
                        'price': float(''.join(c for c in item.find('p', class_='price_color').text if c.isdigit() or c == '.')),
                        'rating': item.p['class'][1],
                        'availability': 'In Stock',
                        'url': "http://books.toscrape.com/catalogue/" + item.h3.a['href']
                    })
                except (AttributeError, ValueError) as e:
                    logging.error(f"Missing HTML element or data format error: {e}")
                    continue

        except requests.exceptions.RequestException as e:
            logging.error(f"Connection/HTTP error on page {page}: {e}")
            continue

    return pd.DataFrame(data)

def process_and_save(df):
    if df.empty:
        logging.warning("No data scraped. Aborting save.")
        return False
    
    try:
        df.drop_duplicates(inplace=True)
        df.dropna(subset=['name', 'price'], inplace=True)
        
        df.to_csv('output/products.csv', index=False)
        df.to_excel('output/products.xlsx', index=False)
        logging.info(f"Successfully saved {len(df)} products to output folder.")
        return True
    except Exception as e:
        logging.error(f"Failed to process and save data: {e}")
        return False