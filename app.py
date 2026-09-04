"""
E-Commerce Multi-Platform Search Engine & Scraper GUI
A modern, simple, bold Streamlit application for searching and extracting products
across Amazon, eBay, and Alibaba with full product details, analytics, and exports.
"""

import os
import json
import pandas as pd
import streamlit as st
import plotly.express as px
import plotly.graph_objects as go

from scraper.engine import search_products, save_results
from scraper.analysis import generate_market_summary

# -----------------------------------------------------------------------------
# 1. Page Configuration & Modern Theme Setup
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="OmniScrape | Multi-Store E-Commerce Search Engine",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Bold & Modern Styling
st.markdown("""
<style>
    /* Google Font Import */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Main Container Padding */
    .main .block-container {
        padding-top: 1.2rem;
        padding-bottom: 3rem;
        max-width: 1400px;
    }

    /* ---------------- SEARCH PORTAL SCREEN STYLES ---------------- */
    .portal-hero {
        text-align: center !important;
        padding: 40px 20px 20px 20px;
        margin-bottom: 15px;
    }
    .portal-hero p, .portal-sub {
        color: #9CA3AF;
        font-size: 1.15rem;
        max-width: 680px;
        margin-left: auto !important;
        margin-right: auto !important;
        margin-top: 12px !important;
        margin-bottom: 0 !important;
        text-align: center !important;
        line-height: 1.5;
        display: block !important;
    }
    .portal-brand {
        font-size: 3.4rem;
        font-weight: 900;
        letter-spacing: -1.5px;
        color: #F9FAFB;
        margin: 0;
        line-height: 1.15;
        text-align: center !important;
    }
    .portal-brand span {
        background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .portal-badge-row {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 16px;
    }
    .portal-card-box {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        max-width: 900px;
        margin: 0 auto 30px auto;
    }
    .portal-feature-card {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 14px;
        padding: 22px 20px;
        min-height: 225px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        box-sizing: border-box;
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .portal-feature-card:hover {
        border-color: #3B82F6;
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.12);
    }
    .portal-feature-icon {
        font-size: 1.8rem;
        margin-bottom: 12px;
        line-height: 1;
    }
    .portal-feature-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #F3F4F6;
        margin-bottom: 8px;
        min-height: 1.6rem;
    }
    .portal-feature-desc {
        font-size: 0.84rem;
        color: #9CA3AF;
        line-height: 1.5;
        margin: 0;
        flex-grow: 1;
    }

    /* ---------------- RESULTS DASHBOARD SCREEN STYLES ---------------- */
    .results-nav-bar {
        background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
        border: 1px solid #374151;
        border-radius: 14px;
        padding: 16px 24px;
        margin-bottom: 22px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    .results-query-title {
        font-size: 1.45rem;
        font-weight: 800;
        color: #F9FAFB;
        margin: 0;
    }
    .results-query-title span {
        background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Modern KPI Metric Cards */
    .kpi-card {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 12px;
        padding: 18px 20px;
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .kpi-card:hover {
        border-color: #3B82F6;
        transform: translateY(-2px);
    }
    .kpi-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #9CA3AF;
        font-weight: 600;
        margin-bottom: 4px;
    }
    .kpi-value {
        font-size: 1.6rem;
        font-weight: 800;
        color: #F9FAFB;
        margin: 0;
    }
    .kpi-sub {
        font-size: 0.8rem;
        color: #10B981;
        margin-top: 4px;
        font-weight: 500;
    }

    /* Store Source Badges */
    .badge-amazon {
        background-color: #FF9900;
        color: #111;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.75rem;
        display: inline-block;
        letter-spacing: 0.5px;
    }
    .badge-ebay {
        background-color: #0064D2;
        color: #FFF;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.75rem;
        display: inline-block;
        letter-spacing: 0.5px;
    }
    .badge-alibaba {
        background-color: #FF6A00;
        color: #FFF;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.75rem;
        display: inline-block;
        letter-spacing: 0.5px;
    }

    /* Product Card Component - Strictly Uniform Equal Height */
    .product-card {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 12px;
        padding: 16px;
        height: 450px !important;
        min-height: 450px !important;
        max-height: 450px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-sizing: border-box !important;
    }
    .product-card:hover {
        border-color: #3B82F6;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        transform: translateY(-4px);
    }
    .product-img-wrapper {
        width: 100%;
        height: 180px;
        min-height: 180px;
        max-height: 180px;
        border-radius: 8px;
        overflow: hidden;
        background: #0B0F19;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        position: relative;
    }
    .product-img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    .product-card:hover .product-img-wrapper img {
        transform: scale(1.05);
    }
    .product-title {
        font-size: 0.92rem;
        font-weight: 700;
        color: #F3F4F6;
        line-height: 1.35;
        margin-bottom: 6px;
        height: 2.6rem;
        min-height: 2.6rem;
        max-height: 2.6rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .product-price {
        font-size: 1.35rem;
        font-weight: 800;
        color: #10B981;
        margin-bottom: 4px;
        line-height: 1.2;
    }
    .rating-badge {
        background: #1F2937;
        color: #FBBF24;
        font-weight: 600;
        font-size: 0.78rem;
        padding: 2px 8px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    .reviews-text {
        font-size: 0.72rem;
        color: #9CA3AF;
        margin-left: 4px;
    }
    .info-row {
        font-size: 0.78rem;
        color: #9CA3AF;
        margin-top: 4px;
        line-height: 1.35;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }
    .info-label {
        font-weight: 600;
        color: #D1D5DB;
    }
    .color-chip {
        display: inline-block;
        background: #1F2937;
        color: #E5E7EB;
        font-size: 0.68rem;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 4px;
        border: 1px solid #374151;
        white-space: nowrap;
    }
    .feature-tag {
        background: #1E3A8A;
        color: #93C5FD;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 4px;
        display: inline-block;
    }

    /* Side-by-Side Comparison Card */
    .compare-product-card {
        background: #111827;
        border: 1px solid #1F2937;
        border-radius: 12px;
        padding: 16px;
        height: 560px !important;
        min-height: 560px !important;
        max-height: 560px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        box-sizing: border-box !important;
        transition: all 0.25s ease;
    }
    .compare-product-card:hover {
        border-color: #3B82F6;
        transform: translateY(-3px);
    }
    .compare-desc {
        font-size: 0.78rem;
        color: #9CA3AF;
        margin: 6px 0;
        line-height: 1.35;
        height: 3.8rem;
        min-height: 3.8rem;
        max-height: 3.8rem;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
    }

    /* Quick Suggestion Pills - Equal Height & Single Line Styling */
    div[data-testid="stHorizontalBlock"] button[kind="secondary"] {
        height: 42px !important;
        min-height: 42px !important;
        max-height: 42px !important;
        border-radius: 21px !important;
        font-size: 0.84rem !important;
        padding: 0 10px !important;
        white-space: nowrap !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid #374151 !important;
        background: #111827 !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-sizing: border-box !important;
    }
    div[data-testid="stHorizontalBlock"] button[kind="secondary"]:hover {
        border-color: #3B82F6 !important;
        background: #1F2937 !important;
        color: #60A5FA !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    }
    div[data-testid="stHorizontalBlock"] button[kind="secondary"] p {
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        margin: 0 !important;
        padding: 0 !important;
        font-weight: 500 !important;
        font-size: 0.84rem !important;
        line-height: 1 !important;
        display: inline-block !important;
    }

    /* Clean Styled MultiSelect Tags */
    span[data-baseweb="tag"] {
        background: #1F2937 !important;
        border: 1px solid #374151 !important;
        border-radius: 6px !important;
    }
    span[data-baseweb="tag"] span {
        color: #F3F4F6 !important;
        font-weight: 600 !important;
        font-size: 0.82rem !important;
    }
    span[data-baseweb="tag"]:hover {
        border-color: #3B82F6 !important;
    }
    div[data-baseweb="popover"] {
        border-radius: 10px !important;
        border: 1px solid #374151 !important;
        overflow: hidden !important;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. Session State Initialization
# -----------------------------------------------------------------------------
if "active_screen" not in st.session_state:
    st.session_state.active_screen = "search"
if "search_query" not in st.session_state:
    st.session_state.search_query = ""
if "products_df" not in st.session_state:
    st.session_state.products_df = pd.DataFrame()
if "search_history" not in st.session_state:
    st.session_state.search_history = []
if "selected_platforms" not in st.session_state:
    st.session_state.selected_platforms = ["Amazon", "eBay", "Alibaba"]
if "limit_per_site" not in st.session_state:
    st.session_state.limit_per_site = 8

# Helper function to execute search
def trigger_product_search(query_text, platforms, limit):
    query_clean = query_text.strip()
    if not query_clean:
        st.warning("⚠️ Please enter a product keyword.")
        return False
    if not platforms:
        st.warning("⚠️ Please select at least one platform to search.")
        return False
    
    st.session_state.search_query = query_clean
    if query_clean not in st.session_state.search_history:
        st.session_state.search_history.append(query_clean)
        
    with st.spinner(f"🔍 Searching & extracting '{query_clean}' across {', '.join(platforms)}..."):
        df_results = search_products(
            query=query_clean,
            platforms=platforms,
            max_results_per_platform=limit
        )
        st.session_state.products_df = df_results
        st.session_state.active_screen = "results"
        st.toast(f"✅ Found {len(df_results)} products across {len(platforms)} platforms!", icon="🛒")
        st.rerun()
    return True

# -----------------------------------------------------------------------------
# 3. Sidebar Navigation & Global Controls
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🧭 Navigation")
    
    col_nav1, col_nav2 = st.columns(2)
    with col_nav1:
        if st.button("🔍 Search", use_container_width=True, type="primary" if st.session_state.active_screen == "search" else "secondary"):
            st.session_state.active_screen = "search"
            st.rerun()
    with col_nav2:
        has_results = not st.session_state.products_df.empty
        if st.button("📊 Results", use_container_width=True, disabled=not has_results, type="primary" if st.session_state.active_screen == "results" else "secondary"):
            st.session_state.active_screen = "results"
            st.rerun()

    st.divider()
    with st.expander("🛒 Target Marketplaces", expanded=True):
        amz_active = st.checkbox("Amazon (Retail & Prime)", value="Amazon" in st.session_state.selected_platforms, key="chk_amazon")
        ebay_active = st.checkbox("eBay (Direct & Deals)", value="eBay" in st.session_state.selected_platforms, key="chk_ebay")
        ali_active = st.checkbox("Alibaba (Wholesale & MOQ)", value="Alibaba" in st.session_state.selected_platforms, key="chk_alibaba")
        
        selected_platforms = []
        if amz_active:
            selected_platforms.append("Amazon")
        if ebay_active:
            selected_platforms.append("eBay")
        if ali_active:
            selected_platforms.append("Alibaba")
            
        if not selected_platforms:
            st.caption("⚠️ Select at least 1 platform.")
            selected_platforms = ["Amazon", "eBay", "Alibaba"]
            
        st.session_state.selected_platforms = selected_platforms
    
    limit_per_site = st.slider(
        "Items per Platform",
        min_value=3,
        max_value=25,
        value=st.session_state.limit_per_site,
        step=1,
        key="sidebar_limit_slider",
        help="Number of products to scrape per platform"
    )
    st.session_state.limit_per_site = limit_per_site

    # Results Screen Specific Filters
    if st.session_state.active_screen == "results" and not st.session_state.products_df.empty:
        st.divider()
        st.markdown("### 🔍 Filter & Sort")
        
        sort_option = st.selectbox(
            "Sort Order",
            options=[
                "Best Match",
                "Price: Low to High",
                "Price: High to Low",
                "Highest Rating",
                "Most Reviews"
            ]
        )
        
        min_rating_filter = st.slider(
            "Minimum Rating",
            min_value=0.0,
            max_value=5.0,
            value=0.0,
            step=0.5,
            format="%.1f ★"
        )
        
        platform_filter = st.radio(
            "Filter Platform in View",
            options=["All Platforms"] + selected_platforms,
            horizontal=False
        )
    else:
        sort_option = "Best Match"
        min_rating_filter = 0.0
        platform_filter = "All Platforms"

    # Search History in Sidebar
    if st.session_state.search_history:
        st.divider()
        st.markdown("### 📜 Search History")
        for hist_item in reversed(st.session_state.search_history[-5:]):
            if st.button(f"🔎 {hist_item}", key=f"side_hist_{hist_item}", use_container_width=True):
                trigger_product_search(hist_item, selected_platforms, limit_per_site)


# =============================================================================
# SCREEN 1: SEARCH PORTAL SCREEN
# =============================================================================
if st.session_state.active_screen == "search":
    # Hero Title & Badges
    st.markdown("""
    <div class="portal-hero" style="text-align: center; width: 100%;">
        <div class="portal-badge-row" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 16px;">
            <span class="badge-amazon">AMAZON</span>
            <span class="badge-ebay">EBAY</span>
            <span class="badge-alibaba">ALIBABA</span>
        </div>
        <h1 class="portal-brand" style="text-align: center;">⚡ Omni<span>Scrape</span></h1>
        <p class="portal-sub" style="text-align: center; margin-left: auto; margin-right: auto; max-width: 680px; display: block;">
            Unified multi-marketplace intelligence engine. Search, extract live pricing, compare product specs, and discover deals across top e-commerce platforms.
        </p>
    </div>
    """, unsafe_allow_html=True)

    # Search Bar Box
    search_col_left, search_col_main, search_col_right = st.columns([1, 8, 1])
    with search_col_main:
        with st.form("portal_search_form", clear_on_submit=False, border=False):
            col_search_input, col_search_submit = st.columns([5, 1])
            with col_search_input:
                portal_query = st.text_input(
                    "Search Keyword",
                    value=st.session_state.search_query,
                    placeholder="Enter any product name...",
                    label_visibility="collapsed"
                )
            with col_search_submit:
                portal_submit = st.form_submit_button("Search", type="primary", use_container_width=True)

        if portal_submit:
            trigger_product_search(portal_query, st.session_state.selected_platforms, st.session_state.limit_per_site)

        # Quick Suggestion Chips
        st.markdown("<p style='font-size:0.85rem; color:#9CA3AF; margin-top:14px; margin-bottom:8px; text-align:center;'><b>Trending Quick Searches:</b></p>", unsafe_allow_html=True)
        quick_cols = st.columns([1.18, 1.0, 1.3, 0.95, 1.05, 1.1])
        chips = [
            ("🎧 Headphones", "Wireless Noise Cancelling Headphones"),
            ("💻 Laptops", "Gaming Laptop 16GB RAM"),
            ("⌚ Smart Watches", "Smart Watch AMOLED Display"),
            ("📱 Phones", "5G Smartphone 256GB"),
            ("👟 Sneakers", "Running Shoes Athletic"),
            ("⌨️ Keyboards", "Mechanical Gaming Keyboard RGB")
        ]
        for i, (label, query_val) in enumerate(chips):
            with quick_cols[i]:
                if st.button(label, key=f"portal_chip_{i}", use_container_width=True):
                    trigger_product_search(query_val, st.session_state.selected_platforms, st.session_state.limit_per_site)

        # Return to previous results if available
        if not st.session_state.products_df.empty:
            st.markdown("<div style='margin-top: 20px; text-align: center;'>", unsafe_allow_html=True)
            if st.button(f"📊 View Current Loaded Results ({len(st.session_state.products_df)} products for '{st.session_state.search_query}') →", type="secondary"):
                st.session_state.active_screen = "results"
                st.rerun()
            st.markdown("</div>", unsafe_allow_html=True)

    # 4 Feature Highlights Grid
    st.markdown("<div style='margin-top: 40px;'></div>", unsafe_allow_html=True)
    f_col1, f_col2, f_col3, f_col4 = st.columns(4)
    
    with f_col1:
        st.markdown("""
        <div class="portal-feature-card">
            <div class="portal-feature-icon">🌐</div>
            <div class="portal-feature-title">Multi-Marketplace Scrape</div>
            <p class="portal-feature-desc">Simultaneously query and scrape live inventory, pricing, ratings, and variants from Amazon, eBay, and Alibaba.</p>
        </div>
        """, unsafe_allow_html=True)
        
    with f_col2:
        st.markdown("""
        <div class="portal-feature-card">
            <div class="portal-feature-icon">💰</div>
            <div class="portal-feature-title">Price Comparison</div>
            <p class="portal-feature-desc">Instantly identify the lowest prices, compare retail vs wholesale MOQs, and track shipping terms across sellers.</p>
        </div>
        """, unsafe_allow_html=True)
        
    with f_col3:
        st.markdown("""
        <div class="portal-feature-card">
            <div class="portal-feature-icon">📊</div>
            <div class="portal-feature-title">Market Intelligence</div>
            <p class="portal-feature-desc">Analyze price distribution box plots, rating-to-price scatters, and marketplace inventory share with interactive charts.</p>
        </div>
        """, unsafe_allow_html=True)
        
    with f_col4:
        st.markdown("""
        <div class="portal-feature-card">
            <div class="portal-feature-icon">📥</div>
            <div class="portal-feature-title">Instant Data Export</div>
            <p class="portal-feature-desc">Export rich product datasets in CSV and JSON formats or inspect raw extracted fields in an interactive data explorer.</p>
        </div>
        """, unsafe_allow_html=True)


# =============================================================================
# SCREEN 2: RESULTS & DASHBOARD SCREEN
# =============================================================================
elif st.session_state.active_screen == "results":
    df = st.session_state.products_df

    if df.empty:
        st.info("No active search results. Switching to Search Portal...")
        st.session_state.active_screen = "search"
        st.rerun()

    # Top Results Header & Quick Search Bar
    with st.container():
        nav_col1, nav_col2 = st.columns([2, 5])
        
        with nav_col1:
            if st.button("← New Search", type="primary", use_container_width=True):
                st.session_state.active_screen = "search"
                st.rerun()
                
        with nav_col2:
            with st.form("quick_results_search", clear_on_submit=False, border=False):
                q_col_input, q_col_btn = st.columns([4, 1])
                with q_col_input:
                    quick_q = st.text_input(
                        "Quick Search",
                        value=st.session_state.search_query,
                        placeholder="Search another product...",
                        label_visibility="collapsed"
                    )
                with q_col_btn:
                    quick_submit = st.form_submit_button("Search", type="secondary", use_container_width=True)
                    
            if quick_submit and quick_q.strip() and quick_q.strip() != st.session_state.search_query:
                trigger_product_search(quick_q, st.session_state.selected_platforms, st.session_state.limit_per_site)

    # Apply Filtering
    filtered_df = df.copy()
    
    if platform_filter != "All Platforms":
        filtered_df = filtered_df[filtered_df["source"] == platform_filter]
        
    if min_rating_filter > 0:
        filtered_df = filtered_df[filtered_df["rating"] >= min_rating_filter]
        
    # Apply Sorting
    if sort_option == "Price: Low to High":
        filtered_df = filtered_df.sort_values(by="price", ascending=True)
    elif sort_option == "Price: High to Low":
        filtered_df = filtered_df.sort_values(by="price", ascending=False)
    elif sort_option == "Highest Rating":
        filtered_df = filtered_df.sort_values(by=["rating", "reviews_count"], ascending=[False, False])
    elif sort_option == "Most Reviews":
        filtered_df = filtered_df.sort_values(by="reviews_count", ascending=False)

    # Compute Summary KPIs
    summary = generate_market_summary(filtered_df)

    # -------------------------------------------------------------------------
    # Executive Metrics Bar
    # -------------------------------------------------------------------------
    kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)
    
    with kpi_col1:
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Total Extracted</div>
            <div class="kpi-value">{len(filtered_df)} Items</div>
            <div class="kpi-sub">{len(filtered_df['source'].unique()) if not filtered_df.empty else 0} Active Platforms</div>
        </div>
        """, unsafe_allow_html=True)
        
    with kpi_col2:
        lowest_price = summary.get('overall_min_price', 0)
        cheapest_src = summary.get('cheapest_item', {}).get('source', 'N/A')
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Lowest Price</div>
            <div class="kpi-value">${lowest_price:.2f}</div>
            <div class="kpi-sub">Found on {cheapest_src}</div>
        </div>
        """, unsafe_allow_html=True)
        
    with kpi_col3:
        avg_price = summary.get('overall_avg_price', 0)
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Average Price</div>
            <div class="kpi-value">${avg_price:.2f}</div>
            <div class="kpi-sub">Range: ${summary.get('overall_min_price', 0):.1f} - ${summary.get('overall_max_price', 0):.1f}</div>
        </div>
        """, unsafe_allow_html=True)
        
    with kpi_col4:
        top_item = summary.get('highest_rated_item', {})
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Top Rating</div>
            <div class="kpi-value">{top_item.get('rating', 5.0):.1f} ★</div>
            <div class="kpi-sub">{top_item.get('reviews', 0):,} Reviews ({top_item.get('source', 'N/A')})</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<div style='margin-top: 25px;'></div>", unsafe_allow_html=True)

    # -------------------------------------------------------------------------
    # Interactive Tabs: Products, Analytics, Comparison, Exports
    # -------------------------------------------------------------------------
    tab_products, tab_analytics, tab_compare, tab_export = st.tabs([
        "🛍️ Product Catalog",
        "📊 Market Analytics & Price Spread",
        "⚔️ Side-by-Side Comparison",
        "📥 Data Export Center"
    ])

    # =========================================================================
    # TAB 1: PRODUCT CATALOG
    # =========================================================================
    with tab_products:
        catalog_header_col1, catalog_header_col2 = st.columns([3, 1])
        with catalog_header_col1:
            st.markdown(f"**Showing {len(filtered_df)} products for:** *'{st.session_state.search_query}'*")
        with catalog_header_col2:
            view_mode = st.radio("Display Layout", ["Grid Cards", "Compact Table"], horizontal=True, label_visibility="collapsed")

        if filtered_df.empty:
            st.info("No products match your current filter criteria. Try adjusting the filters in the sidebar.")
        elif view_mode == "Grid Cards":
            cols_per_row = 3
            products_list = filtered_df.to_dict(orient="records")
            
            for row_idx in range(0, len(products_list), cols_per_row):
                row_items = products_list[row_idx:row_idx + cols_per_row]
                cols = st.columns(cols_per_row)
                
                for col_idx, item in enumerate(row_items):
                    with cols[col_idx]:
                        source = item.get("source", "Amazon")
                        badge_class = f"badge-{source.lower()}"
                        
                        colors_list = item.get("colors", [])
                        if isinstance(colors_list, str):
                            colors_list = [c.strip() for c in colors_list.split(",")]
                        colors_html = "".join([f'<span class="color-chip">{c}</span>' for c in colors_list[:4]])
                        
                        img_url = item.get("image_url") or "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"
                        title = item.get("title", "Untitled Product")
                        price_str = item.get("price_str", f"${item.get('price', 0.0):.2f}")
                        rating = item.get("rating", 4.5)
                        reviews = item.get("reviews_count", 0)
                        quantity = item.get("quantity", "In Stock")
                        shipping = item.get("shipping", "Standard Shipping")
                        badge = item.get("badge", "Popular")
                        url = item.get("product_url", "#")
                        desc = item.get("description", "No description available.")
                        
                        card_html = f"""
                        <div class="product-card">
                            <div>
                                <div class="product-img-wrapper">
                                    <img src="{img_url}" alt="{title}" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'">
                                    <div style="position: absolute; top: 10px; left: 10px;">
                                        <span class="{badge_class}">{source.upper()}</span>
                                    </div>
                                    <div style="position: absolute; top: 10px; right: 10px;">
                                        <span class="feature-tag">{badge}</span>
                                    </div>
                                </div>
                                <div class="product-title" title="{title}">{title}</div>
                                <div style="display: flex; justify-content: space-between; align-items: baseline; height: 30px;">
                                    <div class="product-price">{price_str}</div>
                                    <div class="rating-badge">★ {rating:.1f} <span class="reviews-text">({reviews:,})</span></div>
                                </div>
                                <div class="info-row" title="{quantity}"><span class="info-label">📦 Stock/Qty:</span> {quantity}</div>
                                <div class="info-row" title="{shipping}"><span class="info-label">🚚 Shipping:</span> {shipping}</div>
                                <div class="info-row" style="margin-top: 4px;">
                                    <span class="info-label" style="font-size:0.75rem;">🎨 Colors:</span>
                                    {colors_html}
                                </div>
                            </div>
                            <div style="margin-top: auto; border-top: 1px solid #1F2937; padding-top: 10px;">
                                <a href="{url}" target="_blank" style="text-decoration:none;">
                                    <button style="width:100%; background:#1F2937; color:#F3F4F6; border:1px solid #374151; border-radius:6px; padding:8px 0; font-weight:600; font-size:0.85rem; cursor:pointer; transition:background 0.2s;">
                                        🔗 View on {source} ↗
                                    </button>
                                </a>
                            </div>
                        </div>
                        """
                        st.markdown(card_html, unsafe_allow_html=True)
                        
                        with st.expander("📖 Full Specs & Description"):
                            st.write(desc)
                            st.caption(f"Product ID: `{item.get('id', 'N/A')}`")
                            st.caption(f"Direct Store URL: [Visit Item]({url})")
                        st.markdown("<div style='margin-bottom: 20px;'></div>", unsafe_allow_html=True)
        else:
            table_df = filtered_df[["source", "title", "price_str", "rating", "reviews_count", "quantity", "shipping", "product_url"]].copy()
            table_df.columns = ["Platform", "Title", "Price", "Rating (★)", "Reviews", "Stock / Quantity", "Shipping", "Store Link"]
            st.dataframe(
                table_df,
                use_container_width=True,
                height=500,
                column_config={
                    "Store Link": st.column_config.LinkColumn("Store Link", display_text="Visit Store ↗"),
                    "Rating (★)": st.column_config.NumberColumn("Rating", format="%.1f ★"),
                }
            )

    # =========================================================================
    # TAB 2: MARKET ANALYTICS & CHARTS
    # =========================================================================
    with tab_analytics:
        st.subheader("📊 Cross-Platform Market Intelligence")
        
        chart_col1, chart_col2 = st.columns(2)
        color_map = {"Amazon": "#FF9900", "eBay": "#0064D2", "Alibaba": "#FF6A00"}
        
        with chart_col1:
            fig_box = px.box(
                filtered_df,
                x="source",
                y="price",
                color="source",
                color_discrete_map=color_map,
                points="all",
                title="Price Spread & Variance by Platform ($)",
                labels={"source": "Marketplace", "price": "Price ($)"},
                template="plotly_dark"
            )
            fig_box.update_layout(
                plot_bgcolor="#111827",
                paper_bgcolor="#111827",
                font_family="Inter",
                showlegend=False
            )
            st.plotly_chart(fig_box, use_container_width=True)
            
        with chart_col2:
            avg_df = filtered_df.groupby("source")["price"].mean().reset_index()
            avg_df.columns = ["Platform", "Average Price"]
            fig_bar = px.bar(
                avg_df,
                x="Platform",
                y="Average Price",
                color="Platform",
                color_discrete_map=color_map,
                text_auto=".2f",
                title="Average Product Price Comparison ($)",
                template="plotly_dark"
            )
            fig_bar.update_layout(
                plot_bgcolor="#111827",
                paper_bgcolor="#111827",
                font_family="Inter",
                showlegend=False
            )
            st.plotly_chart(fig_bar, use_container_width=True)
            
        chart_col3, chart_col4 = st.columns(2)
        
        with chart_col3:
            fig_scatter = px.scatter(
                filtered_df,
                x="price",
                y="rating",
                color="source",
                size="reviews_count",
                hover_name="title",
                color_discrete_map=color_map,
                title="Price vs. Customer Rating (Size = Review Count)",
                labels={"price": "Price ($)", "rating": "Rating (Stars)", "source": "Platform"},
                template="plotly_dark"
            )
            fig_scatter.update_layout(
                plot_bgcolor="#111827",
                paper_bgcolor="#111827",
                font_family="Inter"
            )
            st.plotly_chart(fig_scatter, use_container_width=True)
            
        with chart_col4:
            share_df = filtered_df["source"].value_counts().reset_index()
            share_df.columns = ["Platform", "Count"]
            fig_pie = px.pie(
                share_df,
                names="Platform",
                values="Count",
                color="Platform",
                color_discrete_map=color_map,
                hole=0.45,
                title="Extracted Inventory Share by Marketplace",
                template="plotly_dark"
            )
            fig_pie.update_layout(
                plot_bgcolor="#111827",
                paper_bgcolor="#111827",
                font_family="Inter"
            )
            st.plotly_chart(fig_pie, use_container_width=True)

    # =========================================================================
    # TAB 3: SIDE-BY-SIDE PRODUCT COMPARISON
    # =========================================================================
    with tab_compare:
        st.subheader("⚔️ Side-by-Side Product Comparison")
        st.markdown("Select 2 to 4 products to compare specs, pricing, ratings, and quantities head-to-head.")
        
        product_options = {f"[{row['source']}] ${row['price']:.2f} - {row['title'][:55]}...": row["id"] for _, row in filtered_df.iterrows()}
        
        default_selections = list(product_options.keys())[:min(3, len(product_options))]
        selected_titles = st.multiselect(
            "Select Products to Compare",
            options=list(product_options.keys()),
            default=default_selections,
            max_selections=4
        )
        
        if selected_titles:
            selected_ids = [product_options[t] for t in selected_titles]
            comp_df = filtered_df[filtered_df["id"].isin(selected_ids)]
            
            comp_cols = st.columns(len(comp_df))
            for i, (_, item) in enumerate(comp_df.iterrows()):
                with comp_cols[i]:
                    source = item["source"]
                    badge_class = f"badge-{source.lower()}"
                    img_url = item.get("image_url") or "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"
                    
                    colors_list = item.get("colors", [])
                    if isinstance(colors_list, str):
                        colors_list = [c.strip() for c in colors_list.split(",")]
                    colors_str = ", ".join(colors_list)
                    
                    st.markdown(f"""
                    <div class="compare-product-card">
                        <div>
                            <div class="product-img-wrapper" style="height: 160px; min-height: 160px; max-height: 160px;">
                                <img src="{img_url}">
                                <div style="position: absolute; top: 8px; left: 8px;">
                                    <span class="{badge_class}">{source.upper()}</span>
                                </div>
                            </div>
                            <h4 style="color:#F9FAFB; font-size:0.9rem; height:2.6rem; min-height:2.6rem; max-height:2.6rem; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; margin:6px 0;" title="{item['title']}">{item['title']}</h4>
                            <div style="font-size:1.3rem; font-weight:800; color:#10B981; height:28px;">{item['price_str']}</div>
                            <div style="margin: 4px 0; height:24px;">
                                <span class="rating-badge">★ {item['rating']:.1f}</span>
                                <span class="reviews-text">({item['reviews_count']:,} reviews)</span>
                            </div>
                            <hr style="border-color:#1F2937; margin:6px 0;">
                            <p class="info-row" title="{item['quantity']}"><b>📦 Stock/MOQ:</b> {item['quantity']}</p>
                            <p class="info-row" title="{item['shipping']}"><b>🚚 Logistics:</b> {item['shipping']}</p>
                            <p class="info-row" title="{colors_str}"><b>🎨 Colors:</b> {colors_str}</p>
                            <p class="compare-desc" title="{item['description']}">{item['description']}</p>
                        </div>
                        <div style="margin-top: auto; padding-top: 8px;">
                            <a href="{item['product_url']}" target="_blank" style="text-decoration:none;">
                                <button style="width:100%; background:#2563EB; color:#FFF; border:none; border-radius:6px; padding:8px 0; font-weight:700; cursor:pointer;">
                                    Open on {source} ↗
                                </button>
                            </a>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
        else:
            st.info("Select products from the dropdown above to view the side-by-side comparison.")

    # =========================================================================
    # TAB 4: DATA EXPORT & DATABASE VIEW
    # =========================================================================
    with tab_export:
        st.subheader("📥 Data Export Center & Database View")
        st.markdown("Download the complete scraped dataset or inspect raw records.")
        
        export_col1, export_col2, export_col3 = st.columns(3)
        
        # CSV Export
        csv_data = filtered_df.to_csv(index=False).encode("utf-8")
        with export_col1:
            st.download_button(
                label="📄 Download CSV",
                data=csv_data,
                file_name=f"omniscrpe_{st.session_state.search_query.replace(' ', '_')}.csv",
                mime="text/csv",
                use_container_width=True
            )
            
        # JSON Export
        json_data = filtered_df.to_json(orient="records", indent=2).encode("utf-8")
        with export_col2:
            st.download_button(
                label="📦 Download JSON",
                data=json_data,
                file_name=f"omniscrpe_{st.session_state.search_query.replace(' ', '_')}.json",
                mime="application/json",
                use_container_width=True
            )
            
        # Raw Data View
        with export_col3:
            st.metric("Total Records Ready", f"{len(filtered_df)} Rows")
            
        st.markdown("#### 🗄️ Raw Product Data Explorer")
        st.dataframe(filtered_df, use_container_width=True, height=400)