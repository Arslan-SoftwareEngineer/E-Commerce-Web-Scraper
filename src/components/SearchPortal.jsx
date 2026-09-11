import React, { useState } from 'react';
import { Search, Globe, DollarSign, BarChart3, Download, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchPortal({
  onSearch,
  loading,
  hasResults,
  totalResultsCount,
  currentQuery,
  onViewResults
}) {
  const [queryInput, setQueryInput] = useState('');

  const trendingChips = [
    { label: '🎧 Headphones', query: 'Wireless Noise Cancelling Headphones' },
    { label: '💻 Laptops', query: 'Gaming Laptop 16GB RAM' },
    { label: '⌚ Smart Watches', query: 'Smart Watch AMOLED Display' },
    { label: '📱 Phones', query: '5G Smartphone 256GB' },
    { label: '👟 Sneakers', query: 'Running Shoes Athletic' },
    { label: '⌨️ Keyboards', query: 'Mechanical Gaming Keyboard RGB' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSearch(queryInput.trim());
    }
  };

  const handleChipClick = (chipQuery) => {
    setQueryInput(chipQuery);
    onSearch(chipQuery);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', width: '100%' }}>
      {/* Hero Header */}
      <div className="portal-hero">
        <div className="portal-badge-row">
          <span className="badge-amazon">AMAZON</span>
          <span className="badge-ebay">EBAY</span>
          <span className="badge-alibaba">ALIBABA</span>
        </div>
        <h1 className="portal-brand">
          ⚡ Omni<span>Scrape</span>
        </h1>
        <p className="portal-sub">
          Unified multi-marketplace intelligence engine. Search, extract live pricing, compare product specs, and discover deals across top e-commerce platforms.
        </p>
      </div>

      {/* Main Search Input Form */}
      <div className="search-box-container">
        <form onSubmit={handleSubmit} className="search-bar-form" id="portal-search-form">
          <Search size={20} color="#9CA3AF" style={{ alignSelf: 'center', marginLeft: '8px' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Enter any product name (e.g. Sony WH-1000XM5, RTX 4070 Laptop, Nike Air)..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            id="portal-search-input"
            autoFocus
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !queryInput.trim()}
            id="portal-search-submit"
          >
            {loading ? 'Extracting...' : 'Search'}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="trending-chips-wrap">
          <p className="trending-chips-label">
            <b>Trending Quick Searches:</b>
          </p>
          <div className="trending-chips-grid">
            {trendingChips.map((chip, idx) => (
              <button
                key={chip.label}
                className="chip-btn"
                onClick={() => handleChipClick(chip.query)}
                id={`trending-chip-${idx}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loaded Results Return Banner */}
        {hasResults && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={onViewResults}
              className="btn-secondary"
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                borderColor: '#3B82F6',
                color: '#93C5FD',
                padding: '10px 24px',
              }}
              id="portal-view-loaded-btn"
            >
              <BarChart3 size={16} />
              View Loaded Results ({totalResultsCount} products for '{currentQuery}')
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 4 Feature Highlights Grid */}
      <div className="portal-features-grid">
        <div className="portal-feature-card">
          <div className="portal-feature-icon">🌐</div>
          <div className="portal-feature-title">Multi-Marketplace Scrape</div>
          <p className="portal-feature-desc">
            Simultaneously query and scrape live inventory, pricing, ratings, and variants from Amazon, eBay, and Alibaba.
          </p>
        </div>

        <div className="portal-feature-card">
          <div className="portal-feature-icon">💰</div>
          <div className="portal-feature-title">Price Comparison</div>
          <p className="portal-feature-desc">
            Instantly identify the lowest prices, compare retail vs wholesale MOQs, and track shipping terms across sellers.
          </p>
        </div>

        <div className="portal-feature-card">
          <div className="portal-feature-icon">📊</div>
          <div className="portal-feature-title">Market Intelligence</div>
          <p className="portal-feature-desc">
            Analyze price distribution box plots, rating-to-price scatters, and marketplace inventory share with interactive charts.
          </p>
        </div>

        <div className="portal-feature-card">
          <div className="portal-feature-icon">📥</div>
          <div className="portal-feature-title">Instant Data Export</div>
          <p className="portal-feature-desc">
            Export rich product datasets in CSV and JSON formats or inspect raw extracted fields in an interactive data explorer.
          </p>
        </div>
      </div>
    </div>
  );
}
