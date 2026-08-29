# ⚡ E-Commerce Data Scraper & Market Analytics

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly)

## 📖 About This Project

This project is an end-to-end data extraction and analysis pipeline developed to automate e-commerce market research. It autonomously navigates paginated product listings, extracts key pricing and rating metrics using BeautifulSoup, and sanitizes the dataset using Pandas. 

Designed with a modular architecture for robust error handling, the system exports clean datasets to CSV and Excel while serving a live, interactive visualization dashboard powered by Streamlit and Plotly.

## ✨ Key Features

* **Automated Web Scraping:** Bypasses basic blocks using custom browser headers and safely handles missing HTML elements or connection timeouts.
* **Data Cleaning & Validation:** Automatically removes duplicates, handles null values, and converts currency strings into clean float values for mathematical operations.
* **Interactive UI Dashboard:** Features a dark-themed, bold Streamlit frontend with Plotly charts for real-time market analysis.
* **Modular Architecture:** Separates the extraction engine, data processing, and frontend layers for maintainable, enterprise-ready code.
* **Comprehensive Logging:** Records background operations, warnings, and errors to `scraper.log` without disrupting the user interface.

## 🏗️ Project Structure

```text
web-scraping-project/
│
├── scraper/
│   ├── __init__.py
│   ├── engine.py       # Core requests & BeautifulSoup logic
│   └── analysis.py     # Pandas statistical processing
│
├── output/             # Auto-generated datasets (CSV, Excel)
├── app.py              # Streamlit interactive frontend
├── scraper.log         # System execution logs
├── requirements.txt    # Project dependencies
└── README.md
```

## ⚙️ Installation & Setup

1. Clone the repository:
```bash
git clone [https://github.com/Arslan-SoftwareEngineer/E-Commerce-Web-Scraper](https://github.com/Arslan-SoftwareEngineer/E-Commerce-Web-Scraper.git)
cd 'E Commerce Web-Scraper'
```

2. Create a virtual environment (Recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install the dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Usage

Launch the interactive dashboard to control the extraction pipeline and view the analytics:
```bash
streamlit run app.py
```
Once the server starts, navigate to http://localhost:8501 in your browser.
1. Click "🚀 Run Extraction Pipeline" in the sidebar.
2. Wait for the engine to fetch, clean, and process the data.
3. Explore the Interactive Analytics charts and Database View tabs.
