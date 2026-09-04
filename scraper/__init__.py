"""
E-Commerce Multi-Platform Scraper Package
Unified search and scraping across Amazon, eBay, and Alibaba.
"""

from scraper.engine import search_products, save_results, scrape_ecommerce, process_and_save
from scraper.amazon import scrape_amazon
from scraper.ebay import scrape_ebay
from scraper.alibaba import scrape_alibaba
from scraper.analysis import generate_market_summary, analyze_and_visualize

__all__ = [
    "search_products",
    "save_results",
    "scrape_ecommerce",
    "process_and_save",
    "scrape_amazon",
    "scrape_ebay",
    "scrape_alibaba",
    "generate_market_summary",
    "analyze_and_visualize",
]
