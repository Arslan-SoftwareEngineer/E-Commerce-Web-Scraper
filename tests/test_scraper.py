"""
Unit and Integration Tests for E-Commerce Multi-Platform Scraper
"""

import unittest
import os
import pandas as pd
from scraper.amazon import scrape_amazon
from scraper.ebay import scrape_ebay
from scraper.alibaba import scrape_alibaba
from scraper.engine import search_products, save_results
from scraper.analysis import generate_market_summary
from scraper.fallback_data import (
    generate_fallback_amazon,
    generate_fallback_ebay,
    generate_fallback_alibaba,
)

class TestScrapers(unittest.TestCase):

    def test_fallback_amazon(self):
        results = generate_fallback_amazon("mechanical keyboard", count=3)
        self.assertEqual(len(results), 3)
        for item in results:
            self.assertEqual(item["source"], "Amazon")
            self.assertGreater(item["price"], 0)
            self.assertIn("https://", item["image_url"])
            self.assertIn("mechanical keyboard", item["title"].lower())
            self.assertTrue(len(item["colors"]) > 0)
            self.assertIn("quantity", item)
            self.assertIn("reviews_count", item)

    def test_fallback_ebay(self):
        results = generate_fallback_ebay("gaming mouse", count=3)
        self.assertEqual(len(results), 3)
        for item in results:
            self.assertEqual(item["source"], "eBay")
            self.assertGreater(item["price"], 0)
            self.assertIn("https://", item["image_url"])
            self.assertTrue(len(item["colors"]) > 0)

    def test_fallback_alibaba(self):
        results = generate_fallback_alibaba("smart watch", count=3)
        self.assertEqual(len(results), 3)
        for item in results:
            self.assertEqual(item["source"], "Alibaba")
            self.assertGreater(item["price"], 0)
            self.assertIn("MOQ", item["quantity"])
            self.assertTrue(len(item["colors"]) > 0)

    def test_unified_search_engine(self):
        df = search_products(query="wireless earbuds", platforms=["Amazon", "eBay", "Alibaba"], max_results_per_platform=3)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertFalse(df.empty)
        self.assertIn("source", df.columns)
        self.assertIn("price", df.columns)
        self.assertIn("title", df.columns)
        self.assertIn("image_url", df.columns)
        self.assertIn("colors", df.columns)
        self.assertIn("quantity", df.columns)
        
        # Verify platforms are present
        sources = df["source"].unique()
        self.assertTrue(len(sources) >= 1)

    def test_market_summary(self):
        df = search_products(query="laptop", platforms=["Amazon", "eBay", "Alibaba"], max_results_per_platform=2)
        summary = generate_market_summary(df)
        self.assertIn("total_products", summary)
        self.assertIn("overall_avg_price", summary)
        self.assertIn("platform_stats", summary)
        self.assertIn("cheapest_item", summary)

    def test_save_results(self):
        df = search_products(query="drone", platforms=["Amazon"], max_results_per_platform=2)
        test_path = "output/test_output"
        success = save_results(df, base_path=test_path)
        self.assertTrue(success)
        self.assertTrue(os.path.exists(f"{test_path}.csv"))
        self.assertTrue(os.path.exists(f"{test_path}.json"))
        # Clean up test files
        if os.path.exists(f"{test_path}.csv"):
            os.remove(f"{test_path}.csv")
        if os.path.exists(f"{test_path}.json"):
            os.remove(f"{test_path}.json")
        if os.path.exists(f"{test_path}.xlsx"):
            os.remove(f"{test_path}.xlsx")

if __name__ == "__main__":
    unittest.main()
