/**
 * Fallback and high-fidelity dataset generator for e-commerce search results.
 * Provides query-tailored products with realistic pricing, ratings, images,
 * swatches, stock/MOQ, and marketplace attributes.
 */

export const KEYWORD_IMAGES = {
  laptop: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&auto=format&fit=crop&q=80",
  ],
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
  ],
  headphone: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
  ],
  earbud: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
  ],
  watch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
  ],
  shoe: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
  ],
  camera: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
  ],
  keyboard: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80",
  ],
  bag: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
  ],
  generic: [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
  ],
};

export function getImageForQuery(query, index = 0) {
  const qLower = (query || "").toLowerCase();
  for (const [kw, urls] of Object.entries(KEYWORD_IMAGES)) {
    if (qLower.includes(kw)) {
      return urls[index % urls.length];
    }
  }
  const generics = KEYWORD_IMAGES.generic;
  return generics[index % generics.length];
}

export function getColorsForProduct() {
  const palettes = [
    ["Midnight Black", "Space Gray", "Silver", "Alpine Green"],
    ["Matte Black", "Pure White", "Navy Blue"],
    ["Carbon Black", "Platinum Gray", "Ocean Blue", "Rose Gold"],
    ["Phantom Black", "Glacier White", "Burgundy"],
    ["Titanium Gray", "Deep Purple", "Starlight"],
    ["Onyx Black", "Forest Green", "Sunset Orange"],
  ];
  return palettes[Math.floor(Math.random() * palettes.length)];
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function titleCase(str) {
  return (str || "")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function getPriceBaseline(query) {
  const qLower = (query || "").toLowerCase();
  if (/laptop|macbook|notebook|computer/.test(qLower)) {
    return randRange(499.0, 1499.0);
  } else if (/phone|iphone|smartphone|galaxy/.test(qLower)) {
    return randRange(299.0, 999.0);
  } else if (/camera|dslr|drone/.test(qLower)) {
    return randRange(250.0, 850.0);
  } else if (/tv|monitor|display/.test(qLower)) {
    return randRange(180.0, 650.0);
  } else if (/watch|smartwatch/.test(qLower)) {
    return randRange(49.0, 320.0);
  } else if (/headphone|earbud|audio|speaker/.test(qLower)) {
    return randRange(29.0, 249.0);
  } else if (/keyboard|mouse/.test(qLower)) {
    return randRange(19.0, 129.0);
  } else if (/shoe|sneaker|boot/.test(qLower)) {
    return randRange(39.0, 160.0);
  } else if (/shirt|jacket|hoodie|bag|backpack/.test(qLower)) {
    return randRange(25.0, 95.0);
  } else {
    return randRange(15.0, 89.0);
  }
}

export function generateFallbackAmazon(query, count = 8) {
  const basePrice = getPriceBaseline(query);
  const cleanQ = titleCase(query.trim());
  const results = [];

  const adjectives = [
    "Pro",
    "Ultra",
    "Max",
    "Elite Edition",
    "Next-Gen",
    "Wireless",
    "Smart",
    "Compact",
  ];
  const brands = [
    "PrimeTech",
    "AeroWave",
    "NovaBrand",
    "Lumina",
    "Vanguard",
    "ApexGear",
    "ZenithCore",
  ];

  for (let i = 0; i < count; i++) {
    const brand = brands[i % brands.length];
    const adj = adjectives[i % adjectives.length];
    const price = +(basePrice * randRange(0.85, 1.35)).toFixed(2);
    const rating = +(randRange(3.9, 4.9)).toFixed(1);
    const reviews = randInt(45, 14800);
    const stockChoices = [
      "In Stock",
      "In Stock (Only 4 left - order soon)",
      "In Stock (Only 2 left)",
      "In Stock (Ships in 24 hours)",
      "In Stock (Prime 1-Day Delivery)",
    ];
    const stockQty = stockChoices[Math.floor(Math.random() * stockChoices.length)];
    const colors = getColorsForProduct();
    const asin = `B0${randInt(10000000, 99999999)}`;
    const encodedQ = encodeURIComponent(query);

    results.push({
      id: `amz_${asin}`,
      title: `${brand} ${adj} ${cleanQ} - High Performance Model with Enhanced Durability`,
      source: "Amazon",
      price: price,
      price_str: `$${price.toFixed(2)}`,
      rating: rating,
      reviews_count: reviews,
      image_url: getImageForQuery(query, i),
      product_url: `https://www.amazon.com/s?k=${encodedQ}`,
      description: `Official ${brand} ${cleanQ}. Features premium ergonomic build, cutting-edge chip architecture, extended battery life, and universal multi-device compatibility.`,
      quantity: stockQty,
      colors: colors,
      shipping: price > 25 ? "Free Prime Delivery" : "$3.99 Standard Shipping",
      badge: i === 0 ? "Amazon's Choice" : i === 1 ? "Best Seller" : "Prime",
      is_live: false,
    });
  }
  return results;
}

export function generateFallbackEBay(query, count = 8) {
  const basePrice = getPriceBaseline(query);
  const cleanQ = titleCase(query.trim());
  const results = [];

  const conditions = ["Brand New", "Open Box", "Certified Refurbished", "Brand New in Box"];
  const sellers = [
    "TopRated_TechUSA",
    "GlobalDeals_Direct",
    "ElectroHub_Pro",
    "GadgetVault",
    "PrimeOutlet_Store",
  ];

  for (let i = 0; i < count; i++) {
    const price = +(basePrice * randRange(0.7, 1.15)).toFixed(2);
    const rating = +(randRange(4.0, 5.0)).toFixed(1);
    const reviews = randInt(12, 3400);
    const cond = conditions[i % conditions.length];
    const seller = sellers[i % sellers.length];
    const availableUnits = randInt(3, 85);
    const colors = getColorsForProduct();
    const itemId = `${randInt(110000000000, 399999999999)}`;
    const encodedQ = encodeURIComponent(query);

    results.push({
      id: `ebay_${itemId}`,
      title: `[${cond}] ${cleanQ} | Fast Shipping | Authenticity Guaranteed`,
      source: "eBay",
      price: price,
      price_str: `$${price.toFixed(2)}`,
      rating: rating,
      reviews_count: reviews,
      image_url: getImageForQuery(query, i + 2),
      product_url: `https://www.ebay.com/sch/i.html?_nkw=${encodedQ}`,
      description: `Seller: ${seller} (99.4% positive feedback). Guaranteed authentic ${cleanQ} in ${cond.toLowerCase()} condition with full manufacturer warranty and 30-day hassle-free returns.`,
      quantity: `${availableUnits} Available / ${randInt(20, 300)} Sold`,
      colors: colors,
      shipping: i % 2 === 0 ? "Free 2-Day Shipping" : "$4.50 Expedited",
      badge: i === 0 ? "Top Rated Plus" : i === 1 ? "Authenticity Guarantee" : "Great Price",
      is_live: false,
    });
  }
  return results;
}

export function generateFallbackAlibaba(query, count = 8) {
  const basePrice = getPriceBaseline(query);
  const wholesalePrice = +(basePrice * randRange(0.25, 0.55)).toFixed(2);
  const cleanQ = titleCase(query.trim());
  const results = [];

  const manufacturers = [
    "Shenzhen Nova Electronics Co., Ltd.",
    "Guangzhou Apex Smart Industry Co., Ltd.",
    "Zhejiang Precision Technology Corp.",
    "Dongguan Global Manufacturing Ltd.",
    "Yiwu Premier Trading Co., Ltd.",
  ];

  for (let i = 0; i < count; i++) {
    const unitPrice = +(wholesalePrice * randRange(0.85, 1.25)).toFixed(2);
    const moqs = [2, 5, 10, 20, 50, 100];
    const moq = moqs[Math.floor(Math.random() * moqs.length)];
    const years = randInt(3, 16);
    const mfr = manufacturers[i % manufacturers.length];
    const rating = +(randRange(4.5, 5.0)).toFixed(1);
    const reviews = randInt(15, 820);
    const colors = getColorsForProduct();
    const aliId = `${randInt(160000000000, 189999999999)}`;
    const encodedQ = encodeURIComponent(query);

    results.push({
      id: `ali_${aliId}`,
      title: `OEM/ODM Custom ${cleanQ} Factory Direct Wholesale - High Precision Quality`,
      source: "Alibaba",
      price: unitPrice,
      price_str: `$${unitPrice.toFixed(2)}/piece`,
      rating: rating,
      reviews_count: reviews,
      image_url: getImageForQuery(query, i + 4),
      product_url: `https://www.alibaba.com/trade/search?SearchText=${encodedQ}`,
      description: `Supplier: ${mfr} (${years} yrs on Alibaba). Certified ISO9001/CE/FCC manufacturer offering custom logo, custom packaging, and bulk wholesale logistics.`,
      quantity: `Min. Order (MOQ): ${moq} pieces | Supply Ability: 50,000 pcs/mo`,
      colors: colors,
      shipping: "Sea / Air Express Freight Available",
      badge: i % 2 === 0 ? "Verified Supplier" : "Trade Assurance",
      is_live: false,
    });
  }
  return results;
}
