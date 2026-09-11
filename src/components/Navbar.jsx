import React, { useState } from 'react';
import { Search, ShoppingCart, BarChart3, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Navbar({
  activeScreen,
  setActiveScreen,
  searchQuery,
  hasResults,
  onSearch,
  loading
}) {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onSearch(quickInput.trim());
      setQuickInput('');
    }
  };

  return (
    <header className="results-nav-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {activeScreen === 'results' ? (
          <button
            className="btn-primary"
            onClick={() => setActiveScreen('search')}
            style={{ padding: '8px 16px', fontSize: '0.86rem' }}
            id="nav-new-search-btn"
          >
            <ArrowLeft size={16} /> New Search
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={22} color="#3B82F6" />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#F9FAFB' }}>
              Omni<span style={{ color: '#10B981' }}>Scrape</span>
            </span>
          </div>
        )}

        {activeScreen === 'results' && searchQuery && (
          <div className="results-query-title" style={{ marginLeft: '8px' }}>
            Results for: <span>"{searchQuery}"</span>
          </div>
        )}
      </div>

      {activeScreen === 'results' && (
        <form onSubmit={handleQuickSubmit} style={{ display: 'flex', gap: '8px', minWidth: '320px', maxWidth: '440px', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="search-input"
              style={{
                background: '#0B0F19',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '8px 12px 8px 34px',
                fontSize: '0.86rem',
                width: '100%',
              }}
              placeholder="Search another product..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              id="quick-search-input"
            />
            <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
            disabled={loading || !quickInput.trim()}
            id="quick-search-submit"
          >
            {loading ? <RefreshCw size={14} className="spin-icon" /> : 'Search'}
          </button>
        </form>
      )}
    </header>
  );
}
