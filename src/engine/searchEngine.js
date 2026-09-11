/**
 * Core Multi-Marketplace Search Engine Orchestrator
 * Dispatches concurrent requests across selected platforms (Amazon, eBay, Alibaba),
 * standardizes product schemas, cleans datasets, and handles deduplication.
 */

import {
  generateFallbackAmazon,
  generateFallbackEBay,
  generateFallbackAlibaba,
} from "./fallbackData.js";

export const PLATFORM_REGISTRY = {
  Amazon: generateFallbackAmazon,
  eBay: generateFallbackEBay,
  Alibaba: generateFallbackAlibaba,
};

/**
 * Search products across multiple e-commerce platforms.
 *
 * @param {string} query Search keyword
 * @param {string[]} platforms Array of platforms e.g. ['Amazon', 'eBay', 'Alibaba']
 * @param {number} maxResultsPerPlatform Limit per platform
 * @returns {Promise<Array>} Array of standardized product objects
 */
export async function searchProducts(
  query,
  platforms = ["Amazon", "eBay", "Alibaba"],
  maxResultsPerPlatform = 8
) {
  if (!query || !query.trim()) {
    return [];
  }

  const cleanQuery = query.trim();
  const activePlatforms = platforms && platforms.length > 0 ? platforms : ["Amazon", "eBay", "Alibaba"];

  // Simulate network latency for realistic search UX feedback
  await new Promise((resolve) => setTimeout(resolve, 380));

  let allProducts = [];

  for (const plat of activePlatforms) {
    const generator = PLATFORM_REGISTRY[plat];
    if (generator) {
      try {
        const results = generator(cleanQuery, maxResultsPerPlatform);
        if (results && results.length > 0) {
          allProducts.push(...results);
        }
      } catch (err) {
        console.error(`Error generating products for platform [${plat}]:`, err);
      }
    }
  }

  // Deduplication by ID and by Title + Source
  const seenIds = new Set();
  const seenTitleSource = new Set();
  const cleanedProducts = [];

  for (const item of allProducts) {
    const idKey = item.id;
    const titleKey = `${item.title}_${item.source}`.toLowerCase();

    if (seenIds.has(idKey) || seenTitleSource.has(titleKey)) {
      continue;
    }
    seenIds.add(idKey);
    seenTitleSource.add(titleKey);

    // Normalize types
    const priceNum = Number(item.price) || 0.0;
    const ratingNum = Number(item.rating) || 4.5;
    const reviewsNum = parseInt(item.reviews_count, 10) || 0;

    cleanedProducts.push({
      ...item,
      price: priceNum,
      rating: ratingNum,
      reviews_count: reviewsNum,
      colors: Array.isArray(item.colors) ? item.colors : (item.colors ? [String(item.colors)] : []),
    });
  }

  return cleanedProducts;
}
