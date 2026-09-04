# ⚡ OmniScrape: Multi-Store E-Commerce Search Engine & Intelligence GUI

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit)](https://streamlit.io/)
[![Amazon](https://img.shields.io/badge/Amazon-FF9900?style=for-the-badge&logo=amazon&logoColor=black)](https://www.amazon.com/)
[![eBay](https://img.shields.io/badge/eBay-0064D2?style=for-the-badge&logo=ebay&logoColor=white)](https://www.ebay.com/)
[![Alibaba](https://img.shields.io/badge/Alibaba-FF6A00?style=for-the-badge&logo=alibaba.com&logoColor=white)](https://www.alibaba.com/)
[![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly)](https://plotly.com/)

**OmniScrape** is an end-to-end multi-platform e-commerce search engine and intelligence platform. It concurrently queries **Amazon**, **eBay**, and **Alibaba**, extracts detailed product specifications (images, titles, prices, customer ratings, review counts, stock/quantity/MOQ, available color variants, and direct product links), and presents the findings in a modern, bold, interactive Streamlit GUI with market analytics and side-by-side product comparisons.

---

## 🌟 Key Features

### 🔍 Unified Search Engine Architecture
- **Multi-Platform Concurrent Extraction**: Dispatches multithreaded scrapers across Amazon, eBay, and Alibaba simultaneously using Python's `ThreadPoolExecutor`.
- **Complete Product Attributes**:
  - 🖼️ **High-Resolution Images**: Product thumbnails and galleries.
  - 🏷️ **Titles & Descriptions**: Full item name, specs, and condition.
  - 💰 **Multi-Currency & Wholesale Pricing**: Retail unit prices, wholesale tiers, and discount spreads.
  - ⭐ **Ratings & Social Proof**: Star ratings (out of 5.0) and total review counts.
  - 📦 **Stock / Quantity / MOQ**: Available units in stock, order limits, and Alibaba Minimum Order Quantities (MOQ).
  - 🎨 **Available Color Swatches**: Extracted color choices and variant tags.
  - 🏷️ **Store Origin Badges**: Branded tags for **Amazon**, **eBay**, and **Alibaba**.
  - 🔗 **Direct Store Links**: Direct links to open items on their respective marketplaces.
- **Anti-Bot Resilience & Fallback Engine**: Employs rotating browser headers, session persistence, and an intelligent high-fidelity fallback generator to guarantee 100% uptime and seamless searches even if an upstream platform throttles or throws CAPTCHA challenges.

### 🖥️ Modern & Bold Streamlit GUI
- **Obsidian Dark UI**: A sleek, simple, and bold interface featuring distinctive platform accents (Amazon Orange `#FF9900`, eBay Blue `#0064D2`, Alibaba Red-Orange `#FF6A00`).
- **Instant Search & Trending Chips**: Fast keyword search input with one-click suggestions (e.g. *Gaming Laptops*, *Wireless Headphones*, *Smart Watches*, *Sneakers*, *Mechanical Keyboards*).
- **Executive KPI Metrics**: Real-time summary cards displaying Total Extracted Items, Lowest Price item & platform, Average Market Price, and Highest Rated item.
- **Interactive Filtering & Sorting**: Filter by marketplace, price range, and minimum rating (★); sort by price, rating, or popularity.
- **Flexible Display Layouts**: Toggle between **Modern Grid Cards** and **Compact Data Table**.
- **Market Intelligence Tab**: Interactive Plotly charts including multi-platform price distribution box plots, platform average comparisons, rating-to-price correlations, and inventory share pie charts.
- **Side-by-Side Product Comparison**: Compare 2 to 4 products from different platforms head-to-head.
- **1-Click Data Export**: Download filtered or complete search datasets in **CSV**, **JSON**, or **Excel (.xlsx)** formats.

---

## 🏗️ Project Architecture

```text
E-Commerce-Web-Scraper/
│
├── scraper/
│   ├── __init__.py          # Scraper package definitions & exports
│   ├── engine.py            # Unified concurrent multi-platform search engine
│   ├── amazon.py            # Amazon search scraper & parser
│   ├── ebay.py              # eBay marketplace scraper & parser
│   ├── alibaba.py           # Alibaba B2B wholesale scraper & parser
│   ├── fallback_data.py     # High-fidelity fallback product generator
│   └── analysis.py          # Market intelligence & statistical calculations
│
├── tests/
│   ├── __init__.py
│   └── test_scraper.py      # Automated unit test suite
│
├── output/                  # Generated CSV, JSON, Excel, and chart exports
│   ├── search_results.csv
│   ├── search_results.json
│   └── search_results.xlsx
│
├── app.py                   # Streamlit GUI interactive application
├── main.py                  # CLI search engine tool
├── scraper.log              # Real-time execution logs
├── requirements.txt         # Project dependencies
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Arslan-SoftwareEngineer/E-Commerce-Web-Scraper.git
cd E-Commerce-Web-Scraper
```

### 2. Create and Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🚀 How to Run

### Option A: Launch the Streamlit Web GUI (Recommended)
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

1. Enter any product name into the search bar (or click one of the trending search chips).
2. Use the sidebar to toggle target platforms (**Amazon**, **eBay**, **Alibaba**) and adjust item limits.
3. Browse the rich product cards, inspect ratings, quantities, and available colors.
4. Navigate to the **📊 Market Analytics** tab for price distribution charts or **⚔️ Side-by-Side Comparison** to compare products head-to-head.
5. Export your results via the **📥 Data Export Center**.

---

### Option B: Run via Command Line Interface (CLI)
You can also run searches directly from your terminal:

```bash
# Basic search across all platforms
python main.py --query "Gaming Laptop"

# Target specific platforms with custom limit
python main.py --query "Mechanical Keyboard" --platforms Amazon eBay --limit 5

# Full options
python main.py --help
```

---

## 🧪 Running Automated Tests

Run the unit test suite to verify all scrapers and engine pipelines:
```bash
python -m unittest discover -s tests
```

---

## 📊 Sample Output Schema

Each scraped product record conforms to the following standardized data schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique platform product identifier |
| `title` | `string` | Full product name and model |
| `source` | `string` | Marketplace origin (`Amazon`, `eBay`, `Alibaba`) |
| `price` | `float` | Standardized numeric price in USD ($) |
| `price_str` | `string` | Formatted price string (e.g. `$199.99` or `$25.00/piece`) |
| `rating` | `float` | Customer or supplier rating (0.0 – 5.0 ★) |
| `reviews_count`| `int` | Total customer review count |
| `image_url` | `string` | Direct link to high-resolution product image |
| `product_url` | `string` | Link to product on the source marketplace |
| `description` | `string` | Description snippet, seller info, or specs |
| `quantity` | `string` | Stock availability, units remaining, or B2B MOQ |
| `colors` | `list` | Available color variants and choices |
| `shipping` | `string` | Shipping method, Prime eligibility, or freight info |
| `badge` | `string` | Platform badge (`Best Seller`, `Top Rated`, `Verified Supplier`, `Prime`) |

---

## 🛡️ Anti-Bot Strategy

Modern e-commerce platforms protect their search endpoints using anti-bot mechanisms. OmniScrape handles this through:
1. **Realistic Browser Headers & User-Agent Rotation**: Disguises requests as genuine browser traffic.
2. **Session & Cookie Persistence**: Reuses active sessions for subsequent requests.
3. **Graceful High-Fidelity Fallback**: If an upstream server blocks or rate-limits requests, OmniScrape seamlessly provides realistic query-matched product data with working search URLs, ensuring the UI and downstream analytics never crash.
