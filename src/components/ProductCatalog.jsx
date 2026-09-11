import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { LayoutGrid, Table, ExternalLink, Star } from 'lucide-react';

export default function ProductCatalog({ products, searchQuery }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

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
        <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>⚠️ No products match your current filter criteria.</p>
        <p style={{ fontSize: '0.85rem' }}>Try adjusting your platform filters or lowering the minimum rating in the sidebar.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="catalog-toolbar">
        <div style={{ fontSize: '0.92rem', color: '#D1D5DB' }}>
          Showing <b>{products.length}</b> products for: <i style={{ color: '#93C5FD' }}>'{searchQuery}'</i>
        </div>

        <div className="view-toggle-wrap">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            id="view-mode-grid"
          >
            <LayoutGrid size={14} /> Grid Cards
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            id="view-mode-table"
          >
            <Table size={14} /> Compact Table
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="products-grid">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Title</th>
                <th>Price</th>
                <th>Rating (★)</th>
                <th>Reviews</th>
                <th>Stock / Quantity</th>
                <th>Shipping</th>
                <th>Store Link</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => {
                const src = item.source || 'Amazon';
                const badgeClass = `badge-${src.toLowerCase()}`;
                return (
                  <tr key={item.id}>
                    <td>
                      <span className={badgeClass} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {src.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ maxWidth: '300px', fontWeight: 600 }}>
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    </td>
                    <td style={{ color: '#10B981', fontWeight: 700 }}>
                      {item.price_str || `$${Number(item.price || 0).toFixed(2)}`}
                    </td>
                    <td>
                      <span className="rating-badge" style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                        ★ {(Number(item.rating) || 4.5).toFixed(1)}
                      </span>
                    </td>
                    <td style={{ color: '#9CA3AF' }}>{(Number(item.reviews_count) || 0).toLocaleString()}</td>
                    <td style={{ color: '#D1D5DB', fontSize: '0.8rem' }}>{item.quantity || 'In Stock'}</td>
                    <td style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{item.shipping || 'Standard'}</td>
                    <td>
                      <a
                        href={item.product_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#60A5FA',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 600,
                        }}
                      >
                        Visit <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
