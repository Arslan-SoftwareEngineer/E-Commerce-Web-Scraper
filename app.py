import streamlit as st
import pandas as pd
import plotly.express as px
import os
from scraper.engine import scrape_ecommerce, process_and_save

# Must be the first Streamlit command
st.set_page_config(page_title="E-Commerce Scraper", page_icon="🛒", layout="wide")

# Custom CSS for a bold, modern UI
st.markdown("""
<style>
    .stMetric { background-color: #1a1a1a; padding: 20px; border-radius: 10px; border-left: 5px solid #FF4B4B; }
    .stMetric label { color: #a1a1a1 !important; }
    h1 { color: #FF4B4B !important; font-weight: 800 !important; letter-spacing: -1px; }
</style>
""", unsafe_allow_html=True)

st.title("E-Commerce Intelligence")
st.markdown("Automated product extraction and real-time market analysis.")

# Sidebar Controls
with st.sidebar:
    st.header("⚙️ Engine Controls")
    if st.button("🚀 Run Extraction Pipeline", type="primary", use_container_width=True):
        with st.spinner("Executing extraction sequences..."):
            df_new = scrape_ecommerce(max_pages=3)
            if process_and_save(df_new):
                st.success("Pipeline successful. Data synchronized.")
            else:
                st.error("Pipeline failure.")

# Main Interface
if os.path.exists("output/products.csv"):
    df = pd.read_csv("output/products.csv")
    
    # Bold Metrics
    st.subheader("📊 Market Overview")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Assets", f"{len(df)} Products")
    col2.metric("Market Average", f"£{df['price'].mean():.2f}")
    col3.metric("Floor Price", f"£{df['price'].min():.2f}")
    col4.metric("Ceiling Price", f"£{df['price'].max():.2f}")
    
    st.divider()

    # Modern Interactive Tabs
    tab1, tab2 = st.tabs(["📈 Interactive Analytics", "🗄️ Database View"])
    
    with tab1:
        col_chart1, col_chart2 = st.columns(2)
        
        with col_chart1:
            fig_price = px.histogram(df, x="price", nbins=20, title="Price Distribution", 
                                   color_discrete_sequence=['#FF4B4B'], template="plotly_dark")
            st.plotly_chart(fig_price, use_container_width=True)
            
        with col_chart2:
            rating_counts = df['rating'].value_counts().reset_index()
            rating_counts.columns = ['Rating', 'Count']
            fig_rating = px.bar(rating_counts, x='Rating', y='Count', title="Rating Frequency",
                              color='Count', color_continuous_scale='Reds', template="plotly_dark")
            st.plotly_chart(fig_rating, use_container_width=True)

    with tab2:
        st.dataframe(df, use_container_width=True, height=400)
else:
    st.info("System idle. Initialize the extraction pipeline from the sidebar to populate data.")