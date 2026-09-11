import React, { useState, useEffect } from 'react';
import { ExternalLink, Star, Swords, Check, X } from 'lucide-react';

export default function ProductCompare({ products }) {
  const [selectedIds, setSelectedIds] = useState([]);

  // Initialize with the first 3 products when products change
  useEffect(() => {
    if (products && products.length > 0) {
      const initial = products.slice(0, Math.min(3, products.length)).map((p) => p.id);
      setSelectedIds(initial);
    } else {
      setSelectedIds([]);
    }
  }, [products]);

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedProducts = products.filter((p) => selectedIds.includes(p.id));

  if (!products || products.length === 0) {
    return (
      <div
        style={{
          background: '#111827',
          border: '1px solid #1F2937',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          color: '#9CA3AF',
        }}
      >
        <p>No products available for comparison. Run a search first.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F9FAFB', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Swords size={20} color="#3B82F6" /> Side-by-Side Product Comparison
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#9CA3AF' }}>
          Select 2 to 4 products to compare specs, pricing, ratings, and quantities head-to-head.
        </p>
      </div>

      {/* Product Selection Chips */}
      <div className="compare-selector-box">
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D1D5DB', marginBottom: '10px' }}>
          Select Products to Compare (Max 4, Selected: {selectedIds.length}):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
          {products.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                style={{
                  background: isSelected ? '#1E3A8A' : '#1F2937',
                  border: isSelected ? '1px solid #3B82F6' : '1px solid #374151',
                  color: isSelected ? '#93C5FD' : '#D1D5DB',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  maxWidth: '320px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all 0.15s ease',
                }}
                title={p.title}
                id={`compare-select-btn-${p.id}`}
              >
                {isSelected ? <Check size={12} color="#60A5FA" /> : null}
                <span>[{p.source}]</span>
                <span style={{ color: '#10B981' }}>${Number(p.price).toFixed(2)}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title.slice(0, 35)}...</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Cards Comparison Grid */}
      {comparedProducts.length === 0 ? (
        <p style={{ color: '#9CA3AF', textAlign: 'center', margin: '30px 0' }}>
          Select products from the list above to view comparison.
        </p>
      ) : (
        <div
          className="compare-grid"
          style={{
            gridTemplateColumns: `repeat(${Math.min(comparedProducts.length, 4)}, 1fr)`,
          }}
        >
          {comparedProducts.map((item) => {
            const src = item.source || 'Amazon';
            const badgeClass = `badge-${src.toLowerCase()}`;
            const colorsList = Array.isArray(item.colors)
              ? item.colors
              : typeof item.colors === 'string'
              ? item.colors.split(',').map((c) => c.trim())
              : [];

            return (
              <div key={item.id} className="compare-card" id={`compare-card-${item.id}`}>
                <div>
                  {/* Image */}
                  <div className="product-img-wrapper" style={{ height: '160px' }}>
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600';
                      }}
                    />
                    <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                      <span className={badgeClass}>{src.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      color: '#F9FAFB',
                      fontSize: '0.9rem',
                      height: '2.6rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      margin: '8px 0 4px 0',
                    }}
                    title={item.title}
                  >
                    {item.title}
                  </h4>

                  {/* Price */}
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>
                    {item.price_str || `$${Number(item.price).toFixed(2)}`}
                  </div>

                  {/* Rating */}
                  <div style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="rating-badge">
                      <Star size={11} fill="#FBBF24" color="#FBBF24" />
                      {(Number(item.rating) || 4.5).toFixed(1)}
                    </span>
                    <span className="reviews-text">
                      ({(Number(item.reviews_count) || 0).toLocaleString()} reviews)
                    </span>
                  </div>

                  <div style={{ height: '1px', background: '#1F2937', margin: '10px 0' }} />

                  {/* Specs */}
                  <p className="info-row" title={item.quantity}>
                    <b style={{ color: '#D1D5DB' }}>📦 Stock/MOQ:</b> {item.quantity || 'In Stock'}
                  </p>
                  <p className="info-row" title={item.shipping}>
                    <b style={{ color: '#D1D5DB' }}>🚚 Logistics:</b> {item.shipping || 'Standard Shipping'}
                  </p>
                  <p className="info-row">
                    <b style={{ color: '#D1D5DB' }}>🎨 Colors:</b>{' '}
                    {colorsList.length > 0 ? colorsList.join(', ') : 'Standard'}
                  </p>

                  <p className="compare-desc" title={item.description}>
                    {item.description}
                  </p>
                </div>

                {/* Open Button */}
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #1F2937' }}>
                  <a
                    href={item.product_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <button
                      className="btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '8px 0' }}
                    >
                      Open on {src} ↗
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
