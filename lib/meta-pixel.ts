/**
 * Meta Pixel tracking utility
 * Safe for Next.js — all functions check typeof window before calling fbq.
 * Pixel ID: 1626447845566585  (initialized in components/analytics/FacebookPixel.tsx)
 */

type FbqFn = (...args: unknown[]) => void;

function fbq(...args: unknown[]) {
  try {
    if (typeof window !== "undefined" && typeof (window as { fbq?: FbqFn }).fbq === "function") {
      (window as { fbq: FbqFn }).fbq(...args);
    }
  } catch (err) {
    console.error("Meta Pixel error:", err);
  }
}

// ── ViewContent ──────────────────────────────────────────────────────────────
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
}) {
  fbq("track", "ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: "PKR",
  });
}

// ── AddToCart ────────────────────────────────────────────────────────────────
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
}, qty: number) {
  fbq("track", "AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price * qty,
    currency: "PKR",
  });
}

// ── InitiateCheckout ─────────────────────────────────────────────────────────
export function trackInitiateCheckout(params: {
  contentIds: string[];
  value: number;
  numItems: number;
}) {
  fbq("track", "InitiateCheckout", {
    content_ids: params.contentIds,
    content_type: "product",
    value: params.value,
    currency: "PKR",
    num_items: params.numItems,
  });
}

// ── Purchase ─────────────────────────────────────────────────────────────────
// Duplicate protection: stores tracked order IDs in sessionStorage.
// Purchase fires ONLY after order is confirmed (called from order success page).
export function trackPurchase(order: {
  id: string;
  total: number;
  itemIds: string[];
}) {
  const storageKey = `px_purchase_${order.id}`;
  if (typeof window !== "undefined" && sessionStorage.getItem(storageKey)) return; // already tracked

  fbq("track", "Purchase", {
    content_ids: order.itemIds,
    content_type: "product",
    value: order.total,
    currency: "PKR",
    transaction_id: order.id,
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey, "1");
  }
}
