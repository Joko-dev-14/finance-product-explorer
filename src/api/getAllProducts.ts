import "server-only";
import client from "./contentfulClient";
import {
  type Category,
  type EnrichedProduct,
  type FetchMeta,
  type Result,
  ok,
  err,
  slugify,
  isEnrichedProduct,
} from "../types/contentful";

// ── Return type annotation ────────────────────────────────────────────────────
// Explicitly annotating the return type of an async function means TypeScript
// will error at the *definition* if the implementation diverges from the
// contract — rather than silently returning the wrong shape to callers.
//
// Promise<Result<...>> combines two concepts:
//   - Promise<T>    — the value is asynchronous
//   - Result<T, E>  — success/failure are explicit, not thrown exceptions
//
// Callers pattern-match on `result.ok` instead of wrapping in try/catch.

interface AllProductsPayload {
  products: EnrichedProduct[];
  meta: FetchMeta;
}

export async function getAllProducts(): Promise<Result<AllProductsPayload>> {
  const start = Date.now();

  // ── Type assertion ──────────────────────────────────────────────────────────
  // The Contentful SDK returns `EntryCollection<unknown>` by default.
  // We assert `Category` here because we control the content model and know
  // the shape. In a production app you'd validate with zod/valibot instead.
  let rawItems: Category[];
  try {
    const res = await client.getEntries({
      content_type: "category",
      include: 2,
    });
    rawItems = res.items as unknown as Category[];
  } catch (e) {
    // Wrap the caught error in our Result type so callers never have to
    // worry about uncaught exceptions from this function.
    return err(e instanceof Error ? e : new Error(String(e)));
  }

  // ── Generic Array.flatMap with explicit type parameter ────────────────────
  // TypeScript infers the return type from the callback, but being explicit
  // here (`flatMap<EnrichedProduct>`) documents the intended shape and causes
  // an error if the callback accidentally returns something different.
  const products: EnrichedProduct[] = rawItems.flatMap<EnrichedProduct>(
    (category) =>
      (category.fields.products ?? []).map((product) => ({
        ...product,
        categoryName: category.fields.name,
        categoryId: category.sys.id,
        // Function overload — TypeScript knows slugify(string) → string
        // (not string[], because we're passing a single string, not an array)
        slug: slugify(product.fields.name),
      }))
  );

  // ── Runtime type guard ────────────────────────────────────────────────────
  // isEnrichedProduct is a type guard defined in contentful.ts.
  // `.filter(isEnrichedProduct)` narrows the array element type from
  // `EnrichedProduct | unknown` to `EnrichedProduct[]` — TypeScript would
  // reject `products` below if this guard weren't in place.
  const validated = products.filter(isEnrichedProduct);

  const meta: FetchMeta = {
    total: validated.length,
    categories: rawItems.length,
    fetchDuration: Date.now() - start,
    cacheStrategy: "ISR (revalidate: 60s)",
    fetchedAt: new Date().toISOString(),
  };

  // Return the success branch of Result<AllProductsPayload>
  return ok({ products: validated, meta });
}

// ── Optional chaining + nullish coalescing in a typed context ─────────────────
// The return type `Promise<EnrichedProduct | null>` makes it explicit to
// callers that "not found" is an expected outcome, not an error — they must
// handle the null case before using the product.
export async function getProductBySlug(
  slug: string
): Promise<EnrichedProduct | null> {
  const result = await getAllProducts();

  // ── Discriminated union narrowing ─────────────────────────────────────────
  // After this check, TypeScript knows `result` is the `{ ok: true; value: ... }`
  // branch and allows access to `result.value`. Trying to read `result.value`
  // before this check would be a compile error.
  if (!result.ok) return null;

  // Array.find returns `EnrichedProduct | undefined`; `?? null` converts
  // undefined to null so the return type stays `EnrichedProduct | null`.
  return result.value.products.find((p) => p.slug === slug) ?? null;
}
