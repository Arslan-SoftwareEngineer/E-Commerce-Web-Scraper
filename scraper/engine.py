"""
Core Search Engine Orchestrator
Concurrently dispatches scrapers across Amazon, eBay, and Alibaba,
standardizes product schemas, cleans datasets, and manages storage.
"""

import os
import json
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Optional
import pandas as pd

from scraper.amazon import scrape_amazon
from scraper.ebay import scrape_ebay
from scraper.alibaba import scrape_alibaba

# Configure root logger
logging.basicConfig(
    filename="scraper.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger("ScraperEngine")

SCRAPER_REGISTRY = {
    "Amazon": scrape_amazon,
    "eBay": scrape_ebay,
    "Alibaba": scrape_alibaba,
}

def search_products(
    query: str,
    platforms: Optional[List[str]] = None,
    max_results_per_platform: int = 10
) -> pd.DataFrame:
    """
    Search products across multiple e-commerce platforms concurrently.
    
    Args:
        query: Search keyword or phrase.
        platforms: List of platforms to search ('Amazon', 'eBay', 'Alibaba').
        max_results_per_platform: Max number of items per platform.
        
    Returns:
        Cleaned, standardized pandas DataFrame.
    """
    if not query or not query.strip():
        logger.warning("Empty search query provided.")
        return pd.DataFrame()
        
    clean_query = query.strip()
    if platforms is None or len(platforms) == 0:
        platforms = ["Amazon", "eBay", "Alibaba"]
        
    logger.info(f"Executing multi-platform search for '{clean_query}' across {platforms}")
    all_products: List[Dict[str, Any]] = []
    
    with ThreadPoolExecutor(max_workers=len(platforms)) as executor:
        future_to_platform = {
            executor.submit(SCRAPER_REGISTRY[plat], clean_query, max_results_per_platform): plat
            for plat in platforms if plat in SCRAPER_REGISTRY
        }
        
        for future in as_completed(future_to_platform):
            plat = future_to_platform[future]
            try:
                platform_results = future.result()
                if platform_results:
                    all_products.extend(platform_results)
                    logger.info(f"Platform [{plat}] returned {len(platform_results)} items.")
                else:
                    logger.warning(f"Platform [{plat}] returned 0 items.")
            except Exception as e:
                logger.error(f"Scraper error on platform [{plat}]: {e}", exc_info=True)
                
    if not all_products:
        logger.warning(f"No products found for query '{clean_query}'.")
        return pd.DataFrame()
        
    df = pd.DataFrame(all_products)
    
    # Data Cleaning & Normalization
    df.drop_duplicates(subset=["id"], inplace=True)
    df.drop_duplicates(subset=["title", "source"], inplace=True)
    
    # Ensure all required columns exist
    expected_cols = [
        "id", "title", "source", "price", "price_str", "rating",
        "reviews_count", "image_url", "product_url", "description",
        "quantity", "colors", "shipping", "badge", "is_live"
    ]
    for col in expected_cols:
        if col not in df.columns:
            df[col] = None
            
    # Clean numeric types
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0.0)
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(4.5)
    df["reviews_count"] = pd.to_numeric(df["reviews_count"], errors="coerce").fillna(0).astype(int)
    
    # Automatically save search results
    save_results(df)
    return df

def save_results(df: pd.DataFrame, base_path: str = "output/search_results") -> bool:
    """Save dataframe to CSV, JSON, and Excel formats in the output directory."""
    if df.empty:
        logger.warning("Empty dataframe, skipping save.")
        return False
        
    os.makedirs("output", exist_ok=True)
    try:
        # Save CSV
        df.to_csv(f"{base_path}.csv", index=False)
        
        # Save JSON (handles list columns like colors nicely)
        json_data = df.to_dict(orient="records")
        with open(f"{base_path}.json", "w", encoding="utf-8") as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
            
        # Save Excel
        # Convert lists to strings for Excel compatibility
        excel_df = df.copy()
        if "colors" in excel_df.columns:
            excel_df["colors"] = excel_df["colors"].apply(lambda x: ", ".join(x) if isinstance(x, list) else str(x))
        excel_df.to_excel(f"{base_path}.xlsx", index=False)
        
        logger.info(f"Saved {len(df)} search results to {base_path}.csv / .json / .xlsx")
        return True
    except Exception as e:
        logger.error(f"Failed to save search results: {e}")
        return False

# Legacy adapter for backwards compatibility
def scrape_ecommerce(max_pages: int = 2) -> pd.DataFrame:
    """Legacy wrapper that performs a default multi-platform search."""
    return search_products(query="Wireless Headphones", max_results_per_platform=max_pages * 5)

def process_and_save(df: pd.DataFrame) -> bool:
    """Legacy wrapper for saving dataframes."""
    return save_results(df, base_path="output/products")