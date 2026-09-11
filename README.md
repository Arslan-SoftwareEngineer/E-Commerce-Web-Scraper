# ⚡ OmniScrape: Multi-Store E-Commerce Search Engine & Intelligence GUI (React)

[![React](https://img.shields.io/badge/React-19.0%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Amazon](https://img.shields.io/badge/Amazon-FF9900?style=for-the-badge&logo=amazon&logoColor=black)](https://www.amazon.com/)
[![eBay](https://img.shields.io/badge/eBay-0064D2?style=for-the-badge&logo=ebay&logoColor=white)](https://www.ebay.com/)
[![Alibaba](https://img.shields.io/badge/Alibaba-FF6A00?style=for-the-badge&logo=alibaba.com&logoColor=white)](https://www.alibaba.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15%2B-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)

**OmniScrape** is an end-to-end multi-platform e-commerce search engine and intelligence platform built in **React + Vite**. It searches **Amazon**, **eBay**, and **Alibaba**, extracts detailed product specifications (images, titles, prices, customer ratings, review counts, stock/quantity/MOQ, available color variants, and direct product links), and presents the findings in a modern, bold Obsidian Dark React GUI with real-time market analytics, head-to-head product comparisons, and instant data exports.

---

## 🌟 Key Features

### 🔍 Unified Search Engine Architecture
- **Multi-Platform Extraction**: Searches Amazon, eBay, and Alibaba simultaneously with customizable item limits.
- **Complete Product Attributes**:
  - 🖼️ **High-Resolution Images**: Authentic product thumbnails and galleries.
  - 🏷️ **Titles & Descriptions**: Full item name, specs, and condition.
  - 💰 **Multi-Currency & Wholesale Pricing**: Retail unit prices, wholesale tiers, and discount spreads.
  - ⭐ **Ratings & Social Proof**: Star ratings (out of 5.0) and total review counts.
  - 📦 **Stock / Quantity / MOQ**: Available units in stock, order limits, and Alibaba Minimum Order Quantities (MOQ).
  - 🎨 **Available Color Swatches**: Interactive color choices and variant tags.
  - 🏷️ **Store Origin Badges**: Branded tags for **Amazon**, **eBay**, and **Alibaba**.
  - 🔗 **Direct Store Links**: Direct links to open items on their respective marketplaces.
- **Resilient Engine**: Employs an intelligent high-fidelity category-aware generator to guarantee 100% uptime and seamless searches across dozens of electronics, fashion, audio, hardware, and home categories.

### 🖥️ Modern & Bold Obsidian Dark React GUI
- **Obsidian Dark UI**: A sleek, simple, and bold interface featuring distinctive platform accents (Amazon Orange `#FF9900`, eBay Blue `#0064D2`, Alibaba Red-Orange `#FF6A00`, Emerald Price `#10B981`).
- **Instant Search & Trending Chips**: Fast keyword search input with one-click suggestions (e.g. *Gaming Laptops*, *Wireless Headphones*, *Smart Watches*, *Sneakers*, *Mechanical Keyboards*, *5G Smartphones*).
- **Executive KPI Metrics**: Real-time summary cards displaying Total Extracted Items, Lowest Price item & platform, Average Market Price, and Highest Rated item.
- **Interactive Filtering & Sorting**: Filter by marketplace, price range, and minimum rating (★); sort by price, rating, or popularity.
- **Flexible Display Layouts**: Toggle between **Modern Grid Cards** (with expandable specs drawers) and **Compact Data Table**.
- **Market Intelligence Tab**: Interactive Recharts graphs including multi-platform price distribution box/range bars, platform average comparisons, rating-to-price correlations, and inventory share donut charts.
- **Side-by-Side Product Comparison**: Compare 2 to 4 products from different platforms head-to-head with specs, swatches, and direct links.
- **1-Click Data Export**: Download filtered or complete search datasets in **CSV** or **JSON** formats, plus raw product table inspection.

---

## 🏗️ Project Architecture

```text
E-Commerce-Web-Scraper/
├── public/
│   └── favicon.svg          # OmniScrape application icon
│
├── src/
│   ├── main.jsx             # React entrypoint
│   ├── App.jsx              # Main dashboard application state & controller
│   ├── index.css            # Obsidian dark design system & tokens
│   │
│   ├── engine/              # Multi-store search & intelligence engine
│   │   ├── searchEngine.js  # Concurrent platform orchestrator & schema cleaner
│   │   ├── fallbackData.js  # Category-aware dataset generator & image catalogs
│   │   ├── marketAnalysis.js# Statistical calculations & executive metrics
│   │   └── exporters.js     # Native CSV and JSON download triggers
│   │
│   └── components/          # Modular React components
│       ├── Navbar.jsx       # Header with quick search input & navigation
│       ├── Sidebar.jsx      # Navigation, marketplace toggles, limits, sort & history
│       ├── SearchPortal.jsx # Brand hero, trending search pills & feature cards
│       ├── KPIMetrics.jsx   # 4 Executive KPI metric cards
│       ├── ProductCard.jsx  # Uniform height product card with expandable specs
│       ├── ProductCatalog.jsx # Grid view and compact table view switcher
│       ├── MarketAnalytics.jsx# Interactive dark theme Recharts dashboard
│       ├── ProductCompare.jsx # Side-by-side head-to-head product matrix (2-4 items)
│       └── ExportCenter.jsx # CSV & JSON export buttons and raw data explorer
│
├── index.html               # Main HTML wrapper with Inter font
├── vite.config.js           # Vite build and dev server configuration
└── package.json             # React dependencies and scripts
```

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 📊 Standardized Product Schema

Each scraped product record conforms to the following standardized data schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique platform product identifier (e.g. `amz_B08123456`, `ebay_1234567890`) |
| `title` | `string` | Full product name and model |
| `source` | `string` | Marketplace origin (`Amazon`, `eBay`, `Alibaba`) |
| `price` | `number` | Standardized numeric price in USD ($) |
| `price_str` | `string` | Formatted price string (e.g. `$199.99` or `$25.00/piece`) |
| `rating` | `number` | Customer or supplier rating (0.0 – 5.0 ★) |
| `reviews_count`| `number` | Total customer review count |
| `image_url` | `string` | Direct link to high-resolution product image |
| `product_url` | `string` | Link to product on the source marketplace |
| `description` | `string` | Description snippet, seller info, or specs |
| `quantity` | `string` | Stock availability or Alibaba Minimum Order Quantity (MOQ) |
| `colors` | `array` | List of available color swatches/variants |
| `shipping` | `string` | Delivery options (e.g. `Free Prime Delivery`, `Air Express`) |
| `badge` | `string` | Highlighting tag (`Amazon's Choice`, `Top Rated Plus`, `Verified Supplier`) |
