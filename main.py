import logging
from scraper.engine import scrape_ecommerce, process_and_save
from scraper.analysis import analyze_and_visualize

def main():
    print("Starting scraper... Check scraper.log for background processes.")
    
    # 1. Scrape
    df_products = scrape_ecommerce(max_pages=3)
    
    # 2. Process and Save
    success = process_and_save(df_products)
    
    # 3. Analyze
    if success:
        print("Scraping complete. Launching analysis dashboard...")
        analyze_and_visualize(csv_path="output/products.csv")
    else:
        print("Scraping failed. Check scraper.log for errors.")

if __name__ == "__main__":
    main()