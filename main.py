"""
E-Commerce Multi-Platform Search Engine & Scraper CLI
Command line interface for querying products across Amazon, eBay, and Alibaba.
"""

import argparse
import sys
from scraper.engine import search_products, save_results
from scraper.analysis import generate_market_summary, analyze_and_visualize

def main():
    parser = argparse.ArgumentParser(
        description="⚡ Multi-Platform E-Commerce Search Engine & Web Scraper (Amazon, eBay, Alibaba)"
    )
    parser.add_argument(
        "-q", "--query",
        type=str,
        default="Wireless Noise Cancelling Headphones",
        help="Search keyword or product name (e.g. 'gaming laptop', 'mechanical keyboard')"
    )
    parser.add_argument(
        "-p", "--platforms",
        nargs="+",
        default=["Amazon", "eBay", "Alibaba"],
        choices=["Amazon", "eBay", "Alibaba"],
        help="Platforms to scrape (default: Amazon eBay Alibaba)"
    )
    parser.add_argument(
        "-l", "--limit",
        type=int,
        default=6,
        help="Maximum results per platform (default: 6)"
    )
    parser.add_argument(
        "--no-viz",
        action="store_true",
        help="Skip generating the Matplotlib analysis dashboard chart"
    )
    
    args = parser.parse_args()
    
    print("\n" + "="*70)
    print(f"🛒 E-COMMERCE SEARCH ENGINE: Searching for '{args.query}'")
    print(f"🌐 Platforms: {', '.join(args.platforms)} | Limit per site: {args.limit}")
    print("="*70)
    
    df = search_products(
        query=args.query,
        platforms=args.platforms,
        max_results_per_platform=args.limit
    )
    
    if df.empty:
        print("\n❌ No products found. Check scraper.log for details.")
        sys.exit(1)
        
    print(f"\n✅ Successfully extracted {len(df)} products across {len(df['source'].unique())} platforms.\n")
    
    # Display product table
    for i, row in df.iterrows():
        source_badge = f"[{row['source'].upper()}]"
        colors_str = ", ".join(row['colors']) if isinstance(row['colors'], list) else str(row['colors'])
        print(f"{i+1:2d}. {source_badge:10} | {row['title'][:45]:45} | {row['price_str']:12} | {row['rating']}★ ({row['reviews_count']} revs)")
        print(f"    📦 Qty: {row['quantity'][:35]:35} | 🎨 Colors: {colors_str[:30]}")
        print(f"    🔗 Link: {row['product_url']}")
        print("-" * 70)
        
    # Generate market analysis
    summary = generate_market_summary(df)
    print("\n📊 QUICK MARKET SUMMARY:")
    print(f"• Average Market Price: ${summary.get('overall_avg_price', 0):.2f}")
    print(f"• Floor Price:           ${summary.get('overall_min_price', 0):.2f} ({summary.get('cheapest_item', {}).get('source', 'N/A')})")
    print(f"• Ceiling Price:         ${summary.get('overall_max_price', 0):.2f}")
    if summary.get("best_value_item"):
        b = summary["best_value_item"]
        print(f"• Top Value Recommendation: {b['title'][:40]}... (${b['price']:.2f} on {b['source']})")
        
    if not args.no_viz:
        print("\n📈 Generating analysis visualization...")
        analyze_and_visualize(csv_path="output/search_results.csv")
        print("💾 Files saved in 'output/' folder (CSV, JSON, XLSX, PNG).")
        
    print("\n💡 Tip: Launch the full interactive GUI by running: streamlit run app.py\n")

if __name__ == "__main__":
    main()