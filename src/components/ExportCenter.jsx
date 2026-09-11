import React from 'react';
import { Download, FileText, FileCode, Database, Check } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../engine/exporters';

export default function ExportCenter({ products, searchQuery }) {
  const cleanFilenameBase = `omniscrpe_${(searchQuery || 'dataset').replace(/\s+/g, '_').toLowerCase()}`;

  const handleDownloadCSV = () => {
    exportToCSV(products, `${cleanFilenameBase}.csv`);
  };

  const handleDownloadJSON = () => {
    exportToJSON(products, `${cleanFilenameBase}.json`);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F9FAFB', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#3B82F6" /> Data Export Center & Database View
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#9CA3AF' }}>
          Download the standardized scraped product dataset in structured formats or inspect raw table records.
        </p>
      </div>

      {/* Export Action Cards */}
      <div className="export-cards-grid">
        {/* CSV Export Card */}
        <div className="export-action-card" id="export-csv-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={24} color="#10B981" />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#F9FAFB', margin: 0 }}>CSV Spreadsheet</h4>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Comma-Separated Values (.csv)</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#D1D5DB', margin: 0 }}>
            Standard flat spreadsheet table suitable for Excel, Google Sheets, and SQL databases.
          </p>
          <button
            className="btn-primary"
            onClick={handleDownloadCSV}
            disabled={!products || products.length === 0}
            style={{ width: '100%', fontSize: '0.86rem', marginTop: 'auto' }}
            id="download-csv-btn"
          >
            <Download size={15} /> Download CSV
          </button>
        </div>

        {/* JSON Export Card */}
        <div className="export-action-card" id="export-json-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileCode size={24} color="#3B82F6" />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#F9FAFB', margin: 0 }}>JSON Dataset</h4>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>JavaScript Object Notation (.json)</span>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#D1D5DB', margin: 0 }}>
            Structured, nested dataset preserving color variant arrays, specs, and complete metadata.
          </p>
          <button
            className="btn-primary"
            onClick={handleDownloadJSON}
            disabled={!products || products.length === 0}
            style={{ width: '100%', fontSize: '0.86rem', marginTop: 'auto', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
            id="download-json-btn"
          >
            <Download size={15} /> Download JSON
          </button>
        </div>

        {/* Status / Metric Card */}
        <div className="export-action-card" id="export-status-card" style={{ justifyContent: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Records Ready
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10B981', lineHeight: 1 }}>
            {products ? products.length : 0} Rows
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#93C5FD' }}>
            <Check size={14} color="#10B981" /> Cleaned & Standardized Schema
          </div>
        </div>
      </div>

      {/* Raw Data Explorer */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ fontSize: '1rem', color: '#F9FAFB', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🗄️ Raw Product Data Explorer
        </h4>
        <div className="table-container" style={{ maxHeight: '450px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Title</th>
                <th>Price ($)</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Stock / MOQ</th>
                <th>Shipping</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <code style={{ fontSize: '0.75rem', color: '#93C5FD' }}>{p.id}</code>
                  </td>
                  <td>
                    <span className={`badge-${(p.source || 'Amazon').toLowerCase()}`} style={{ fontSize: '0.66rem', padding: '2px 6px' }}>
                      {(p.source || 'Amazon').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.title}
                  </td>
                  <td style={{ color: '#10B981', fontWeight: 700 }}>
                    ${Number(p.price || 0).toFixed(2)}
                  </td>
                  <td style={{ color: '#FBBF24' }}>
                    ★ {Number(p.rating || 0).toFixed(1)}
                  </td>
                  <td>{Number(p.reviews_count || 0).toLocaleString()}</td>
                  <td style={{ fontSize: '0.78rem' }}>{p.quantity || 'In Stock'}</td>
                  <td style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{p.shipping || 'Standard'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
