import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ShoppingBag, BarChart2, Swords, Download, CheckCircle } from 'lucide-react';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchPortal from './components/SearchPortal';
import KPIMetrics from './components/KPIMetrics';
import ProductCatalog from './components/ProductCatalog';
import MarketAnalytics from './components/MarketAnalytics';
import ProductCompare from './components/ProductCompare';
import ExportCenter from './components/ExportCenter';

import { searchProducts } from './engine/searchEngine';
import { generateMarketSummary } from './engine/marketAnalysis';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('search'); // 'search' | 'results'
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([
    'Wireless Noise Cancelling Headphones',
    'Gaming Laptop 16GB RAM'
  ]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Amazon', 'eBay', 'Alibaba']);
  const [limitPerSite, setLimitPerSite] = useState(8);

  // Results screen filters & sort
  const [sortOption, setSortOption] = useState('Best Match');
  const [minRatingFilter, setMinRatingFilter] = useState(0.0);
  const [platformFilter, setPlatformFilter] = useState('All Platforms');

  // Active Tab on Results Screen
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'analytics' | 'compare' | 'export'

  // Loading state & Toast
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSearch = async (queryText) => {
    const cleanQ = queryText.trim();
    if (!cleanQ) return;

    if (selectedPlatforms.length === 0) {
      showToast('⚠️ Please select at least one target platform in the sidebar.');
      return;
    }

    setLoading(true);
    setSearchQuery(cleanQ);

    try {
      const results = await searchProducts(cleanQ, selectedPlatforms, limitPerSite);
      setProducts(results);

      // Update history without duplicates
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== cleanQ.toLowerCase());
        return [...filtered, cleanQ];
      });

      setActiveScreen('results');
      setActiveTab('catalog');

      // Confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#3B82F6', '#10B981', '#FF9900', '#0064D2'],
        });
      } catch (e) {
        // ignore if canvas not ready
      }

      showToast(`✅ Found ${results.length} products across ${selectedPlatforms.length} platforms!`);
    } catch (err) {
      console.error('Search execution failed:', err);
      showToast('❌ An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Platform filter
    if (platformFilter !== 'All Platforms') {
      list = list.filter((p) => p.source === platformFilter);
    }

    // Min Rating filter
    if (minRatingFilter > 0) {
      list = list.filter((p) => (Number(p.rating) || 0) >= minRatingFilter);
    }

    // Sort order
    if (sortOption === 'Price: Low to High') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortOption === 'Price: High to Low') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortOption === 'Highest Rating') {
      list.sort((a, b) => {
        if (b.rating === a.rating) {
          return (Number(b.reviews_count) || 0) - (Number(a.reviews_count) || 0);
        }
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      });
    } else if (sortOption === 'Most Reviews') {
      list.sort((a, b) => (Number(b.reviews_count) || 0) - (Number(a.reviews_count) || 0));
    }

    return list;
  }, [products, platformFilter, minRatingFilter, sortOption]);

  // Market Summary
  const marketSummary = useMemo(() => {
    return generateMarketSummary(filteredProducts);
  }, [filteredProducts]);

  return (
    <div className="app-container">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <CheckCircle size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        hasResults={products.length > 0}
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
        limitPerSite={limitPerSite}
        setLimitPerSite={setLimitPerSite}
        sortOption={sortOption}
        setSortOption={setSortOption}
        minRatingFilter={minRatingFilter}
        setMinRatingFilter={setMinRatingFilter}
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        searchHistory={searchHistory}
        onHistorySelect={(histQuery) => handleSearch(histQuery)}
      />

      {/* Main App Canvas */}
      <main className="main-content">
        <Navbar
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          searchQuery={searchQuery}
          hasResults={products.length > 0}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* SCREEN 1: SEARCH PORTAL */}
        {activeScreen === 'search' && (
          <SearchPortal
            onSearch={handleSearch}
            loading={loading}
            hasResults={products.length > 0}
            totalResultsCount={products.length}
            currentQuery={searchQuery}
            onViewResults={() => setActiveScreen('results')}
          />
        )}

        {/* SCREEN 2: RESULTS DASHBOARD */}
        {activeScreen === 'results' && (
          <div>
            {/* Executive KPIs */}
            <KPIMetrics
              summary={marketSummary}
              totalItems={filteredProducts.length}
              activePlatformsCount={new Set(filteredProducts.map((p) => p.source)).size}
            />

            {/* Tabs Header */}
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
                id="tab-btn-catalog"
              >
                <ShoppingBag size={16} /> 🛍️ Product Catalog
              </button>
              <button
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
                id="tab-btn-analytics"
              >
                <BarChart2 size={16} /> 📊 Market Analytics & Price Spread
              </button>
              <button
                className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
                onClick={() => setActiveTab('compare')}
                id="tab-btn-compare"
              >
                <Swords size={16} /> ⚔️ Side-by-Side Comparison
              </button>
              <button
                className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                onClick={() => setActiveTab('export')}
                id="tab-btn-export"
              >
                <Download size={16} /> 📥 Data Export Center
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'catalog' && (
              <ProductCatalog products={filteredProducts} searchQuery={searchQuery} />
            )}

            {activeTab === 'analytics' && (
              <MarketAnalytics products={filteredProducts} summary={marketSummary} />
            )}

            {activeTab === 'compare' && (
              <ProductCompare products={filteredProducts} />
            )}

            {activeTab === 'export' && (
              <ExportCenter products={filteredProducts} searchQuery={searchQuery} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
