import React from 'react';
import { Package, DollarSign, TrendingDown, Star } from 'lucide-react';

export default function KPIMetrics({ summary, totalItems, activePlatformsCount }) {
  const lowestPrice = summary.overall_min_price || 0;
  const cheapestSource = summary.cheapest_item?.source || 'N/A';
  const avgPrice = summary.overall_avg_price || 0;
  const minPrice = summary.overall_min_price || 0;
  const maxPrice = summary.overall_max_price || 0;
  const topItem = summary.highest_rated_item || {};

  return (
    <div className="kpi-grid">
      {/* KPI 1: Total Extracted */}
      <div className="kpi-card" id="kpi-total-extracted">
        <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Package size={13} color="#3B82F6" /> Total Extracted
        </div>
        <div className="kpi-value">{totalItems} Items</div>
        <div className="kpi-sub" style={{ color: '#93C5FD' }}>
          {activePlatformsCount} Active Platforms
        </div>
      </div>

      {/* KPI 2: Lowest Price */}
      <div className="kpi-card" id="kpi-lowest-price">
        <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingDown size={13} color="#10B981" /> Lowest Price
        </div>
        <div className="kpi-value" style={{ color: '#10B981' }}>
          ${lowestPrice.toFixed(2)}
        </div>
        <div className="kpi-sub">
          Found on {cheapestSource}
        </div>
      </div>

      {/* KPI 3: Average Price */}
      <div className="kpi-card" id="kpi-avg-price">
        <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={13} color="#60A5FA" /> Average Price
        </div>
        <div className="kpi-value">${avgPrice.toFixed(2)}</div>
        <div className="kpi-sub" style={{ color: '#9CA3AF' }}>
          Range: ${minPrice.toFixed(1)} - ${maxPrice.toFixed(1)}
        </div>
      </div>

      {/* KPI 4: Top Rating */}
      <div className="kpi-card" id="kpi-top-rating">
        <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={13} color="#FBBF24" /> Top Rating
        </div>
        <div className="kpi-value" style={{ color: '#FBBF24' }}>
          {(topItem.rating || 5.0).toFixed(1)} ★
        </div>
        <div className="kpi-sub" style={{ color: '#E5E7EB' }}>
          {(topItem.reviews || 0).toLocaleString()} Reviews ({topItem.source || 'N/A'})
        </div>
      </div>
    </div>
  );
}
