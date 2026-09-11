import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Star, Box, Truck, Palette, Info } from 'lucide-react';

export default function ProductCard({ item }) {
  const [showSpecs, setShowSpecs] = useState(false);

  const source = item.source || 'Amazon';
  const badgeClass = `badge-${source.toLowerCase()}`;
  const imgUrl = item.image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600';
  const title = item.title || 'Untitled Product';
  const priceStr = item.price_str || `$${(item.price || 0).toFixed(2)}`;
  const rating = Number(item.rating) || 4.5;
  const reviews = Number(item.reviews_count) || 0;
  const quantity = item.quantity || 'In Stock';
  const shipping = item.shipping || 'Standard Shipping';
  const badge = item.badge || 'Popular';
  const url = item.product_url || '#';
  const desc = item.description || 'No description available.';
  const colorsList = Array.isArray(item.colors)
    ? item.colors
    : typeof item.colors === 'string'
    ? item.colors.split(',').map((c) => c.trim())
    : [];

  return (
    <div className="product-card" id={`product-card-${item.id}`}>
      <div>
        {/* Image & Floating Badges */}
        <div className="product-img-wrapper">
          <img
            src={imgUrl}
            alt={title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600';
            }}
            loading="lazy"
          />
          <div className="product-badges-layer">
            <span className={badgeClass}>{source.toUpperCase()}</span>
            <span className="feature-tag">{badge}</span>
          </div>
        </div>

        {/* Product Title */}
        <div className="product-title" title={title}>
          {title}
        </div>

        {/* Price & Rating Row */}
        <div className="product-price-row">
          <div className="product-price">{priceStr}</div>
          <div className="rating-badge">
            <Star size={12} fill="#FBBF24" color="#FBBF24" />
            <span>{rating.toFixed(1)}</span>
            <span className="reviews-text">({reviews.toLocaleString()})</span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="info-row" title={quantity}>
          <span className="info-label">📦 Stock/Qty:</span> {quantity}
        </div>
        <div className="info-row" title={shipping}>
          <span className="info-label">🚚 Shipping:</span> {shipping}
        </div>

        {/* Color Swatches */}
        {colorsList.length > 0 && (
          <div className="info-row" style={{ marginTop: '6px' }}>
            <span className="info-label" style={{ fontSize: '0.75rem', marginRight: '4px' }}>
              🎨 Colors:
            </span>
            <div className="color-chips-row" style={{ display: 'inline-flex' }}>
              {colorsList.slice(0, 3).map((c, i) => (
                <span key={i} className="color-chip">
                  {c}
                </span>
              ))}
              {colorsList.length > 3 && (
                <span className="color-chip" style={{ color: '#9CA3AF' }}>
                  +{colorsList.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer with Direct Store Link & Expandable Specs */}
      <div className="product-card-footer">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <button
            style={{
              width: '100%',
              background: '#1F2937',
              color: '#F3F4F6',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '8px 0',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#273549';
              e.currentTarget.style.borderColor = '#3B82F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1F2937';
              e.currentTarget.style.borderColor = '#374151';
            }}
          >
            <ExternalLink size={14} /> View on {source} ↗
          </button>
        </a>

        {/* Expandable Full Specs */}
        <div>
          <button
            className="specs-expander-btn"
            onClick={() => setShowSpecs(!showSpecs)}
            id={`specs-btn-${item.id}`}
          >
            {showSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showSpecs ? 'Hide Specs' : '📖 Full Specs & Description'}
          </button>

          {showSpecs && (
            <div className="specs-drawer">
              <p style={{ marginBottom: '6px' }}>{desc}</p>
              <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                <div>Product ID: <code style={{ color: '#93C5FD' }}>{item.id}</code></div>
                <div>
                  Direct URL:{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#60A5FA', textDecoration: 'underline' }}
                  >
                    Visit Store Item
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
