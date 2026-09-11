import React from 'react';
import {
  Search,
  BarChart2,
  Sliders,
  History,
  Store,
  Layers,
  ArrowUpDown,
  Star,
  CheckSquare,
  Square
} from 'lucide-react';

export default function Sidebar({
  activeScreen,
  setActiveScreen,
  hasResults,
  selectedPlatforms,
  setSelectedPlatforms,
  limitPerSite,
  setLimitPerSite,
  sortOption,
  setSortOption,
  minRatingFilter,
  setMinRatingFilter,
  platformFilter,
  setPlatformFilter,
  searchHistory,
  onHistorySelect,
}) {
  const togglePlatform = (platform) => {
    let updated;
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length === 1) {
        return; // maintain at least one
      }
      updated = selectedPlatforms.filter((p) => p !== platform);
    } else {
      updated = [...selectedPlatforms, platform];
    }
    setSelectedPlatforms(updated);
  };

  return (
    <aside className="sidebar-wrapper">
      {/* Brand Header in Sidebar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#F9FAFB', letterSpacing: '-0.5px' }}>
            Omni<span style={{ color: '#3B82F6' }}>Scrape</span>
          </span>
        </div>
        <p style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>Multi-Marketplace Intelligence GUI</p>
      </div>

      {/* Navigation Switcher */}
      <div>
        <div className="sidebar-section-title">🧭 Navigation</div>
        <div className="sidebar-nav-grid">
          <button
            className={activeScreen === 'search' ? 'btn-primary' : 'btn-secondary'}
            style={{ width: '100%', fontSize: '0.84rem', padding: '8px 10px' }}
            onClick={() => setActiveScreen('search')}
            id="sidebar-nav-search"
          >
            <Search size={15} /> Search
          </button>
          <button
            className={activeScreen === 'results' ? 'btn-primary' : 'btn-secondary'}
            style={{ width: '100%', fontSize: '0.84rem', padding: '8px 10px' }}
            onClick={() => hasResults && setActiveScreen('results')}
            disabled={!hasResults}
            id="sidebar-nav-results"
          >
            <BarChart2 size={15} /> Results
          </button>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Target Marketplaces */}
      <div>
        <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Store size={14} color="#3B82F6" /> Target Marketplaces
        </div>
        <div className="sidebar-control-group">
          <label className="sidebar-checkbox-label">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes('Amazon')}
              onChange={() => togglePlatform('Amazon')}
              style={{ accentColor: '#FF9900' }}
              id="chk-amazon"
            />
            <span className="badge-amazon" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>AMAZON</span>
            <span style={{ fontSize: '0.82rem', color: '#E5E7EB' }}>Retail & Prime</span>
          </label>

          <label className="sidebar-checkbox-label">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes('eBay')}
              onChange={() => togglePlatform('eBay')}
              style={{ accentColor: '#0064D2' }}
              id="chk-ebay"
            />
            <span className="badge-ebay" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>EBAY</span>
            <span style={{ fontSize: '0.82rem', color: '#E5E7EB' }}>Direct & Deals</span>
          </label>

          <label className="sidebar-checkbox-label">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes('Alibaba')}
              onChange={() => togglePlatform('Alibaba')}
              style={{ accentColor: '#FF6A00' }}
              id="chk-alibaba"
            />
            <span className="badge-alibaba" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>ALIBABA</span>
            <span style={{ fontSize: '0.82rem', color: '#E5E7EB' }}>Wholesale & MOQ</span>
          </label>
        </div>
      </div>

      {/* Limit Slider */}
      <div className="sidebar-slider-wrap">
        <div className="slider-label-row">
          <span>Items per Platform</span>
          <span style={{ fontWeight: 700, color: '#3B82F6' }}>{limitPerSite}</span>
        </div>
        <input
          type="range"
          min="3"
          max="25"
          step="1"
          value={limitPerSite}
          onChange={(e) => setLimitPerSite(Number(e.target.value))}
          className="custom-slider"
          id="slider-limit-per-site"
        />
        <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Max results extracted per platform</span>
      </div>

      {/* Filter & Sort (When on Results screen) */}
      {activeScreen === 'results' && hasResults && (
        <>
          <div className="sidebar-divider" />
          <div>
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="#10B981" /> Sort Order
            </div>
            <select
              className="custom-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              id="select-sort-order"
            >
              <option value="Best Match">Best Match</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Highest Rating">Highest Rating</option>
              <option value="Most Reviews">Most Reviews</option>
            </select>
          </div>

          <div className="sidebar-slider-wrap">
            <div className="slider-label-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} color="#FBBF24" /> Min Rating
              </span>
              <span style={{ fontWeight: 700, color: '#FBBF24' }}>
                {minRatingFilter > 0 ? `${minRatingFilter.toFixed(1)} ★` : 'All'}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.5"
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(Number(e.target.value))}
              className="custom-slider"
              id="slider-min-rating"
            />
          </div>

          <div>
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="#A78BFA" /> Filter Platform in View
            </div>
            <div className="sidebar-control-group">
              {['All Platforms', ...selectedPlatforms].map((plat) => (
                <label key={plat} className="sidebar-checkbox-label">
                  <input
                    type="radio"
                    name="platformViewFilter"
                    checked={platformFilter === plat}
                    onChange={() => setPlatformFilter(plat)}
                    style={{ accentColor: '#3B82F6' }}
                    id={`radio-platform-${plat.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <span style={{ fontSize: '0.84rem', color: platformFilter === plat ? '#93C5FD' : '#D1D5DB' }}>
                    {plat}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Search History */}
      {searchHistory && searchHistory.length > 0 && (
        <>
          <div className="sidebar-divider" />
          <div style={{ marginTop: 'auto' }}>
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={14} color="#60A5FA" /> Search History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {searchHistory.slice(-5).reverse().map((item, idx) => (
                <button
                  key={`${item}_${idx}`}
                  className="history-item-btn"
                  onClick={() => onHistorySelect(item)}
                  title={item}
                  id={`history-btn-${idx}`}
                >
                  <Search size={12} color="#9CA3AF" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
