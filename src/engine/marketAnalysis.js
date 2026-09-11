/**
 * Market Intelligence & Statistical Analysis Module
 * Provides cross-platform price comparisons, rating distributions, and deal detection.
 */

export function generateMarketSummary(products) {
  if (!products || products.length === 0) {
    return {
      total_products: 0,
      overall_avg_price: 0,
      overall_min_price: 0,
      overall_max_price: 0,
      platform_counts: {},
      platform_stats: {},
      cheapest_item: null,
      highest_rated_item: null,
      best_value_item: null,
    };
  }

  const prices = products.map((p) => Number(p.price) || 0).filter((pr) => pr > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length
    ? prices.reduce((acc, curr) => acc + curr, 0) / prices.length
    : 0;

  // Platform Counts and Stats
  const platformCounts = {};
  const platformGroups = {};

  products.forEach((p) => {
    const src = p.source || "Unknown";
    platformCounts[src] = (platformCounts[src] || 0) + 1;
    if (!platformGroups[src]) {
      platformGroups[src] = [];
    }
    platformGroups[src].push(p);
  });

  const platformStats = {};
  Object.keys(platformGroups).forEach((src) => {
    const group = platformGroups[src];
    const groupPrices = group.map((p) => Number(p.price) || 0).filter((pr) => pr > 0);
    const groupRatings = group.map((p) => Number(p.rating) || 0);
    const groupReviews = group.map((p) => Number(p.reviews_count) || 0);

    const gMin = groupPrices.length ? Math.min(...groupPrices) : 0;
    const gMax = groupPrices.length ? Math.max(...groupPrices) : 0;
    const gAvg = groupPrices.length
      ? groupPrices.reduce((a, b) => a + b, 0) / groupPrices.length
      : 0;
    const gAvgRating = groupRatings.length
      ? groupRatings.reduce((a, b) => a + b, 0) / groupRatings.length
      : 0;
    const gTotalReviews = groupReviews.reduce((a, b) => a + b, 0);

    platformStats[src] = {
      count: group.length,
      avg_price: gAvg,
      min_price: gMin,
      max_price: gMax,
      avg_rating: gAvgRating,
      total_reviews: gTotalReviews,
    };
  });

  // Cheapest item
  let cheapestItem = null;
  const sortedByPrice = [...products].filter((p) => Number(p.price) > 0).sort((a, b) => a.price - b.price);
  if (sortedByPrice.length > 0) {
    const c = sortedByPrice[0];
    cheapestItem = {
      title: c.title,
      price: c.price,
      source: c.source,
      url: c.product_url,
      image_url: c.image_url,
    };
  }

  // Highest rated item
  let highestRatedItem = null;
  const sortedByRating = [...products].sort((a, b) => {
    if (b.rating === a.rating) {
      return (b.reviews_count || 0) - (a.reviews_count || 0);
    }
    return b.rating - a.rating;
  });
  if (sortedByRating.length > 0) {
    const r = sortedByRating[0];
    highestRatedItem = {
      title: r.title,
      rating: r.rating,
      reviews: r.reviews_count,
      source: r.source,
      price: r.price,
      url: r.product_url,
      image_url: r.image_url,
    };
  }

  // Best value item: high rating, competitive price (rating / sqrt(price))
  let bestValueItem = null;
  const validForValue = products.filter((p) => Number(p.price) > 0);
  if (validForValue.length > 0) {
    const scored = validForValue.map((p) => ({
      ...p,
      value_score: (Number(p.rating) || 4.5) / Math.sqrt(Number(p.price) || 1),
    }));
    scored.sort((a, b) => b.value_score - a.value_score);
    const best = scored[0];
    bestValueItem = {
      title: best.title,
      price: best.price,
      rating: best.rating,
      source: best.source,
      url: best.product_url,
      value_score: best.value_score,
      image_url: best.image_url,
    };
  }

  return {
    total_products: products.length,
    overall_avg_price: avgPrice,
    overall_min_price: minPrice,
    overall_max_price: maxPrice,
    platform_counts: platformCounts,
    platform_stats: platformStats,
    cheapest_item: cheapestItem,
    highest_rated_item: highestRatedItem,
    best_value_item: bestValueItem,
  };
}
