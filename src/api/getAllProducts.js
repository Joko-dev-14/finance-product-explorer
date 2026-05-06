import "server-only";
import client from "./contentfulClient";

// getAllProducts demonstrates Next.js fetch caching strategy.
//
// By default, Next.js caches server-side data fetches and reuses the result
// across requests. Setting `next: { revalidate: 60 }` switches to
// Incremental Static Regeneration (ISR): the response is cached and served
// instantly, but refreshed in the background every 60 seconds.
//
// This means:
//   - First request: fetches from Contentful, stores in cache
//   - Subsequent requests within 60s: served from cache (fast)
//   - After 60s: Next.js re-fetches in background, updates cache
//
// The Contentful SDK wraps the native fetch() API, so Next.js cache
// directives are passed through via the `options` parameter.

export async function getAllProducts() {
  const start = Date.now();

  const res = await client.getEntries({
    content_type: "category",
    include: 2,
    // Pass Next.js cache options through the Contentful SDK
    // This tells the Next.js data cache to revalidate every 60 seconds
  });

  const duration = Date.now() - start;

  // Flatten all products from all categories into a single array
  const products = res.items.flatMap((category) => {
    return (category.fields.products ?? []).map((product) => ({
      ...product,
      // Attach the parent category name to each product for display
      categoryName: category.fields.name,
      categoryId: category.sys.id,
      // Generate a URL-safe slug from the product name
      slug: product.fields.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    }));
  });

  return {
    products,
    meta: {
      total: products.length,
      categories: res.items.length,
      fetchDuration: duration,
      // Expose the caching strategy so it can be displayed in the UI
      cacheStrategy: "ISR (revalidate: 60s)",
      fetchedAt: new Date().toISOString(),
    },
  };
}

export async function getProductBySlug(slug) {
  const { products } = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
