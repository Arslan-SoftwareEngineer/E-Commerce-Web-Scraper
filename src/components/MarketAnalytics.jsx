import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

const PLATFORM_COLORS = {
  Amazon: '#FF9900',
  eBay: '#0064D2',
  Alibaba: '#FF6A00',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: '#1F2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#F9FAFB',
          fontSize: '0.82rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: '4px', color: '#93C5FD' }}>
          {label || data.name || data.platform || data.title}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color || '#10B981', margin: '2px 0' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomScatterTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: '#1F2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#F9FAFB',
          fontSize: '0.82rem',
          maxWidth: '280px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
        }}
      >
        <p style={{ fontWeight: 700, color: '#93C5FD', marginBottom: '4px' }}>{data.title}</p>
        <p style={{ color: PLATFORM_COLORS[data.source] || '#F9FAFB' }}>Platform: <b>{data.source}</b></p>
        <p style={{ color: '#10B981' }}>Price: <b>${data.price.toFixed(2)}</b></p>
        <p style={{ color: '#FBBF24' }}>Rating: <b>{data.rating} ★</b></p>
        <p style={{ color: '#9CA3AF' }}>Reviews: <b>{data.reviews_count.toLocaleString()}</b></p>
      </div>
    );
  }
  return null;
};

export default function MarketAnalytics({ products, summary }) {
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
        <p>No data available to analyze. Execute a search to see market intelligence.</p>
      </div>
    );
  }

  // 1. Price Spread Data (Min, Avg, Max) by platform
  const spreadData = Object.keys(summary.platform_stats || {}).map((plat) => {
    const stats = summary.platform_stats[plat];
    return {
      platform: plat,
      'Min Price ($)': stats.min_price,
      'Avg Price ($)': Number(stats.avg_price.toFixed(2)),
      'Max Price ($)': stats.max_price,
      fill: PLATFORM_COLORS[plat] || '#3B82F6',
    };
  });

  // 2. Average Price Comparison
  const avgPriceData = Object.keys(summary.platform_stats || {}).map((plat) => {
    const stats = summary.platform_stats[plat];
    return {
      platform: plat,
      avg_price: Number(stats.avg_price.toFixed(2)),
      count: stats.count,
      fill: PLATFORM_COLORS[plat] || '#3B82F6',
    };
  });

  // 3. Scatter Data (Price vs Rating)
  const scatterData = products.map((p) => ({
    title: p.title,
    price: p.price,
    rating: p.rating,
    reviews_count: p.reviews_count,
    source: p.source,
    z: Math.max(10, Math.min(100, Math.sqrt(p.reviews_count) * 2)),
  }));

  // 4. Inventory Share Pie Data
  const shareData = Object.keys(summary.platform_counts || {}).map((plat) => ({
    name: plat,
    value: summary.platform_counts[plat],
    color: PLATFORM_COLORS[plat] || '#3B82F6',
  }));

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F9FAFB' }}>
          📊 Cross-Platform Market Intelligence
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#9CA3AF' }}>
          Real-time pricing distribution, rating correlations, and inventory share across marketplaces.
        </p>
      </div>

      <div className="charts-grid">
        {/* Chart 1: Price Spread & Variance */}
        <div className="chart-card" id="chart-price-spread">
          <div className="chart-card-title">
            <Activity size={16} color="#3B82F6" /> Price Spread & Variance by Platform ($)
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spreadData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="platform" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `$${v}`} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#D1D5DB' }} />
                <Bar dataKey="Min Price ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Avg Price ($)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Max Price ($)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Price Comparison */}
        <div className="chart-card" id="chart-avg-price">
          <div className="chart-card-title">
            <BarChart3 size={16} color="#10B981" /> Average Product Price Comparison ($)
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgPriceData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="platform" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `$${v}`} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg_price" name="Average Price ($)" radius={[6, 6, 0, 0]}>
                  {avgPriceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Price vs Rating Scatter */}
        <div className="chart-card" id="chart-scatter-rating">
          <div className="chart-card-title">
            <TrendingUp size={16} color="#FBBF24" /> Price vs. Customer Rating (Bubble Size = Reviews)
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="Price ($)"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(v) => `$${v}`}
                  tickLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="rating"
                  name="Rating"
                  domain={[3.0, 5.0]}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(v) => `${v}★`}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip content={<CustomScatterTooltip />} />
                {Object.keys(PLATFORM_COLORS).map((plat) => {
                  const platData = scatterData.filter((d) => d.source === plat);
                  if (platData.length === 0) return null;
                  return (
                    <Scatter
                      key={plat}
                      name={plat}
                      data={platData}
                      fill={PLATFORM_COLORS[plat]}
                    />
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Extracted Inventory Share */}
        <div className="chart-card" id="chart-share-donut">
          <div className="chart-card-title">
            <PieIcon size={16} color="#EC4899" /> Extracted Inventory Share by Marketplace
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {shareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem', color: '#D1D5DB' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
