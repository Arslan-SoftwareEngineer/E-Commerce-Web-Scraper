"""
Fallback and synthetic data generator for e-commerce search results.
Provides high-fidelity, query-tailored fallback data with realistic images,
pricing, ratings, review counts, colors, quantities/MOQ, and direct store links
when live platforms throttle or block automated requests.
"""

import random
import re
from typing import List, Dict, Any
from urllib.parse import quote_plus

# Curated high quality product images categorized by common product keywords
KEYWORD_IMAGES = {
    "laptop": [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
    ],
    "phone": [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
    ],
    "headphone": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    ],
    "earbud": [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
    ],
    "watch": [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    ],
    "shoe": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    ],
    "camera": [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
    ],
    "keyboard": [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
    ],
    "bag": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    ],
    "generic": [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
    ]
}

def get_image_for_query(query: str, index: int = 0) -> str:
    """Get a relevant product image URL based on query keyword matching."""
    q_lower = query.lower()
    for kw, urls in KEYWORD_IMAGES.items():
        if kw in q_lower:
            return urls[index % len(urls)]
    generics = KEYWORD_IMAGES["generic"]
    return generics[index % len(generics)]

def get_colors_for_product() -> List[str]:
    """Generate realistic available colors."""
    palette = [
        ["Midnight Black", "Space Gray", "Silver", "Alpine Green"],
        ["Matte Black", "Pure White", "Navy Blue"],
        ["Carbon Black", "Platinum Gray", "Ocean Blue", "Rose Gold"],
        ["Phantom Black", "Glacier White", "Burgundy"],
        ["Titanium Gray", "Deep Purple", "Starlight"],
        ["Onyx Black", "Forest Green", "Sunset Orange"]
    ]
    return random.choice(palette)

def get_price_baseline(query: str) -> float:
    """Estimate a baseline retail price based on product category keywords."""
    q_lower = query.lower()
    if any(k in q_lower for k in ["laptop", "macbook", "notebook", "computer"]):
        return random.uniform(499.0, 1499.0)
    elif any(k in q_lower for k in ["phone", "iphone", "smartphone", "galaxy"]):
        return random.uniform(299.0, 999.0)
    elif any(k in q_lower for k in ["camera", "dslr", "drone"]):
        return random.uniform(250.0, 850.0)
    elif any(k in q_lower for k in ["tv", "monitor", "display"]):
        return random.uniform(180.0, 650.0)
    elif any(k in q_lower for k in ["watch", "smartwatch"]):
        return random.uniform(49.0, 320.0)
    elif any(k in q_lower for k in ["headphone", "earbud", "audio", "speaker"]):
        return random.uniform(29.0, 249.0)
    elif any(k in q_lower for k in ["keyboard", "mouse"]):
        return random.uniform(19.0, 129.0)
    elif any(k in q_lower for k in ["shoe", "sneaker", "boot"]):
        return random.uniform(39.0, 160.0)
    elif any(k in q_lower for k in ["shirt", "jacket", "hoodie", "bag", "backpack"]):
        return random.uniform(25.0, 95.0)
    else:
        return random.uniform(15.0, 89.0)

def generate_fallback_amazon(query: str, count: int = 8) -> List[Dict[str, Any]]:
    """Generate realistic fallback Amazon product listings."""
    base_price = get_price_baseline(query)
    clean_q = query.strip().title()
    results = []
    
    adjectives = ["Pro", "Ultra", "Max", "Elite Edition", "Next-Gen", "Wireless", "Smart", "Compact"]
    brands = ["PrimeTech", "AeroWave", "NovaBrand", "Lumina", "Vanguard", "ApexGear", "ZenithCore"]
    
    for i in range(count):
        brand = brands[i % len(brands)]
        adj = adjectives[i % len(adjectives)]
        price = round(base_price * random.uniform(0.85, 1.35), 2)
        rating = round(random.uniform(3.9, 4.9), 1)
        reviews = random.randint(45, 14800)
        stock_qty = random.choice([
            "In Stock",
            "In Stock (Only 4 left - order soon)",
            "In Stock (Only 2 left)",
            "In Stock (Ships in 24 hours)",
            "In Stock (Prime 1-Day Delivery)"
        ])
        colors = get_colors_for_product()
        asin = f"B0{random.randint(10000000, 99999999)}"
        encoded_q = quote_plus(query)
        
        results.append({
            "id": f"amz_{asin}",
            "title": f"{brand} {adj} {clean_q} - High Performance Model with Enhanced Durability",
            "source": "Amazon",
            "price": price,
            "price_str": f"${price:.2f}",
            "rating": rating,
            "reviews_count": reviews,
            "image_url": get_image_for_query(query, i),
            "product_url": f"https://www.amazon.com/s?k={encoded_q}",
            "description": f"Official {brand} {clean_q}. Features premium ergonomic build, cutting-edge chip architecture, extended battery life, and universal multi-device compatibility.",
            "quantity": stock_qty,
            "colors": colors,
            "shipping": "Free Prime Delivery" if price > 25 else "$3.99 Standard Shipping",
            "badge": "Amazon's Choice" if i == 0 else ("Best Seller" if i == 1 else "Prime"),
            "is_live": False
        })
    return results

def generate_fallback_ebay(query: str, count: int = 8) -> List[Dict[str, Any]]:
    """Generate realistic fallback eBay product listings."""
    base_price = get_price_baseline(query)
    clean_q = query.strip().title()
    results = []
    
    conditions = ["Brand New", "Open Box", "Certified Refurbished", "Brand New in Box"]
    sellers = ["TopRated_TechUSA", "GlobalDeals_Direct", "ElectroHub_Pro", "GadgetVault", "PrimeOutlet_Store"]
    
    for i in range(count):
        price = round(base_price * random.uniform(0.70, 1.15), 2)
        rating = round(random.uniform(4.0, 5.0), 1)
        reviews = random.randint(12, 3400)
        cond = conditions[i % len(conditions)]
        seller = sellers[i % len(sellers)]
        available_units = random.randint(3, 85)
        colors = get_colors_for_product()
        item_id = f"{random.randint(110000000000, 399999999999)}"
        encoded_q = quote_plus(query)
        
        results.append({
            "id": f"ebay_{item_id}",
            "title": f"[{cond}] {clean_q} | Fast Shipping | Authenticity Guaranteed",
            "source": "eBay",
            "price": price,
            "price_str": f"${price:.2f}",
            "rating": rating,
            "reviews_count": reviews,
            "image_url": get_image_for_query(query, i + 2),
            "product_url": f"https://www.ebay.com/sch/i.html?_nkw={encoded_q}",
            "description": f"Seller: {seller} (99.4% positive feedback). Guaranteed authentic {clean_q} in {cond.lower()} condition with full manufacturer warranty and 30-day hassle-free returns.",
            "quantity": f"{available_units} Available / {random.randint(20, 300)} Sold",
            "colors": colors,
            "shipping": "Free 2-Day Shipping" if i % 2 == 0 else "$4.50 Expedited",
            "badge": "Top Rated Plus" if i == 0 else ("Authenticity Guarantee" if i == 1 else "Great Price"),
            "is_live": False
        })
    return results

def generate_fallback_alibaba(query: str, count: int = 8) -> List[Dict[str, Any]]:
    """Generate realistic fallback Alibaba B2B wholesale product listings."""
    base_price = get_price_baseline(query)
    wholesale_price = round(base_price * random.uniform(0.25, 0.55), 2)
    clean_q = query.strip().title()
    results = []
    
    manufacturers = [
        "Shenzhen Nova Electronics Co., Ltd.",
        "Guangzhou Apex Smart Industry Co., Ltd.",
        "Zhejiang Precision Technology Corp.",
        "Dongguan Global Manufacturing Ltd.",
        "Yiwu Premier Trading Co., Ltd."
    ]
    
    for i in range(count):
        unit_price = round(wholesale_price * random.uniform(0.85, 1.25), 2)
        moq = random.choice([2, 5, 10, 20, 50, 100])
        years = random.randint(3, 16)
        mfr = manufacturers[i % len(manufacturers)]
        rating = round(random.uniform(4.5, 5.0), 1)
        reviews = random.randint(15, 820)
        colors = get_colors_for_product()
        ali_id = f"{random.randint(160000000000, 189999999999)}"
        encoded_q = quote_plus(query)
        
        results.append({
            "id": f"ali_{ali_id}",
            "title": f"OEM/ODM Custom {clean_q} Factory Direct Wholesale - High Precision Quality",
            "source": "Alibaba",
            "price": unit_price,
            "price_str": f"${unit_price:.2f}/piece",
            "rating": rating,
            "reviews_count": reviews,
            "image_url": get_image_for_query(query, i + 4),
            "product_url": f"https://www.alibaba.com/trade/search?SearchText={encoded_q}",
            "description": f"Supplier: {mfr} ({years} yrs on Alibaba). Certified ISO9001/CE/FCC manufacturer offering custom logo, custom packaging, and bulk wholesale logistics.",
            "quantity": f"Min. Order (MOQ): {moq} pieces | Supply Ability: 50,000 pcs/mo",
            "colors": colors,
            "shipping": "Sea / Air Express Freight Available",
            "badge": "Verified Supplier" if i % 2 == 0 else "Trade Assurance",
            "is_live": False
        })
    return results
