"""
Market Intelligence & Statistical Analysis Module
Provides cross-platform price comparisons, rating distributions, and deal detection.
"""

import os
import pandas as pd
import matplotlib.pyplot as plt
from typing import Dict, Any, Optional

def generate_market_summary(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Compute comprehensive market intelligence metrics across all scraped platforms.
    """
    if df.empty:
        return {}
        
    summary = {
        "total_products": len(df),
        "overall_avg_price": float(df["price"].mean()),
        "overall_min_price": float(df["price"].min()),
        "overall_max_price": float(df["price"].max()),
        "platform_counts": df["source"].value_counts().to_dict(),
        "platform_stats": {},
        "cheapest_item": None,
        "highest_rated_item": None,
        "best_value_item": None,
    }
    
    # Platform-specific stats
    for platform, group in df.groupby("source"):
        summary["platform_stats"][platform] = {
            "count": len(group),
            "avg_price": float(group["price"].mean()),
            "min_price": float(group["price"].min()),
            "max_price": float(group["price"].max()),
            "avg_rating": float(group["rating"].mean()),
            "total_reviews": int(group["reviews_count"].sum()),
        }
        
    # Best items
    cheapest_row = df.loc[df["price"].idxmin()]
    summary["cheapest_item"] = {
        "title": cheapest_row["title"],
        "price": cheapest_row["price"],
        "source": cheapest_row["source"],
        "url": cheapest_row["product_url"],
    }
    
    highest_rated_row = df.loc[df["rating"].idxmax()]
    summary["highest_rated_item"] = {
        "title": highest_rated_row["title"],
        "rating": highest_rated_row["rating"],
        "reviews": highest_rated_row["reviews_count"],
        "source": highest_rated_row["source"],
    }
    
    # Best Value: high rating, competitive price (rating / sqrt(price))
    valid_prices = df[df["price"] > 0].copy()
    if not valid_prices.empty:
        valid_prices["value_score"] = valid_prices["rating"] / (valid_prices["price"] ** 0.5)
        best_val_row = valid_prices.loc[valid_prices["value_score"].idxmax()]
        summary["best_value_item"] = {
            "title": best_val_row["title"],
            "price": best_val_row["price"],
            "rating": best_val_row["rating"],
            "source": best_val_row["source"],
            "url": best_val_row["product_url"],
        }
        
    return summary

def analyze_and_visualize(csv_path: str = "output/search_results.csv", output_img: str = "output/analysis_dashboard.png") -> None:
    """CLI/standalone visualization generator using matplotlib."""
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path)
    if df.empty:
        print("Dataframe is empty.")
        return
        
    summary = generate_market_summary(df)
    print("\n" + "="*50)
    print("📊 MARKET INTELLIGENCE REPORT")
    print("="*50)
    print(f"Total Products Extracted: {summary.get('total_products', 0)}")
    print(f"Overall Average Price:   ${summary.get('overall_avg_price', 0):.2f}")
    print(f"Floor Price:             ${summary.get('overall_min_price', 0):.2f}")
    print(f"Ceiling Price:           ${summary.get('overall_max_price', 0):.2f}")
    
    print("\n--- Platform Breakdown ---")
    for plat, stats in summary.get("platform_stats", {}).items():
        print(f"• {plat:8} | Items: {stats['count']:2} | Avg Price: ${stats['avg_price']:6.2f} | Avg Rating: {stats['avg_rating']:.1f}★")
        
    if summary.get("cheapest_item"):
        c = summary["cheapest_item"]
        print(f"\nLowest Price Item: ${c['price']:.2f} ({c['source']}) - {c['title'][:40]}...")
    if summary.get("best_value_item"):
        v = summary["best_value_item"]
        print(f"Best Value Pick:   ${v['price']:.2f} | {v['rating']}★ ({v['source']}) - {v['title'][:40]}...")
    print("="*50 + "\n")
    
    # Generate 4-panel Matplotlib dashboard
    fig, axs = plt.subplots(2, 2, figsize=(14, 10))
    fig.patch.set_facecolor("#111827")
    
    for ax in axs.flat:
        ax.set_facecolor("#1F2937")
        ax.tick_params(colors="#E5E7EB")
        ax.xaxis.label.set_color("#E5E7EB")
        ax.yaxis.label.set_color("#E5E7EB")
        ax.title.set_color("#F9FAFB")
        for spine in ax.spines.values():
            spine.set_color("#374151")
            
    # 1. Price Distribution
    axs[0, 0].hist(df["price"], bins=15, color="#3B82F6", edgecolor="#1E3A8A")
    axs[0, 0].set_title("Price Distribution across All Platforms")
    axs[0, 0].set_xlabel("Price ($)")
    axs[0, 0].set_ylabel("Number of Products")
    
    # 2. Average Price by Platform
    platform_avg = df.groupby("source")["price"].mean()
    colors = ["#FF9900" if s == "Amazon" else ("#0064D2" if s == "eBay" else "#FF6A00") for s in platform_avg.index]
    axs[0, 1].bar(platform_avg.index, platform_avg.values, color=colors, edgecolor="#111827")
    axs[0, 1].set_title("Average Price by Platform ($)")
    axs[0, 1].set_xlabel("Platform")
    axs[0, 1].set_ylabel("Avg Price ($)")
    
    # 3. Rating vs Price Scatter
    platform_palette = {"Amazon": "#FF9900", "eBay": "#0064D2", "Alibaba": "#FF6A00"}
    for plat in df["source"].unique():
        sub = df[df["source"] == plat]
        axs[1, 0].scatter(sub["price"], sub["rating"], color=platform_palette.get(plat, "#9CA3AF"), label=plat, s=50, alpha=0.8)
    axs[1, 0].set_title("Rating vs Price Correlation")
    axs[1, 0].set_xlabel("Price ($)")
    axs[1, 0].set_ylabel("Rating (0 - 5 Stars)")
    axs[1, 0].legend(facecolor="#1F2937", labelcolor="#F9FAFB")
    
    # 4. Platform Share
    counts = df["source"].value_counts()
    axs[1, 1].pie(counts.values, labels=counts.index, autopct="%1.1f%%",
                  colors=[platform_palette.get(p, "#9CA3AF") for p in counts.index],
                  textprops={"color": "#F9FAFB"})
    axs[1, 1].set_title("Product Distribution by Platform")
    
    plt.tight_layout()
    os.makedirs(os.path.dirname(output_img) or ".", exist_ok=True)
    plt.savefig(output_img, facecolor=fig.get_facecolor(), dpi=150)
    plt.close()
    print(f"Visualization saved to {output_img}")

if __name__ == "__main__":
    analyze_and_visualize()