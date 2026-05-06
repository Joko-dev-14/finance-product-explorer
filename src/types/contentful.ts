// ─────────────────────────────────────────────────────────────────────────────
// src/types/contentful.ts
//
// TypeScript showcase — every feature used here is annotated so the file
// doubles as living documentation.
// ─────────────────────────────────────────────────────────────────────────────


// ── 1. INTERFACES ─────────────────────────────────────────────────────────────
// Interfaces describe the shape of an object. They are open (can be merged
// with a second `interface` declaration of the same name) and are the idiomatic
// choice for modelling data coming from an external API.

export interface ContentfulFile {
  url: string;
  fileName: string;
  contentType: string;
}

export interface ContentfulAsset {
  sys: { id: string };
  fields: {
    title: string;
    file: ContentfulFile;
  };
}

export interface ProductFields {
  name: string;
  description: string;
  /** Optional — not every product entry has an image in Contentful */
  image?: ContentfulAsset;
}

export interface Product {
  sys: { id: string };
  fields: ProductFields;
}

export interface CategoryFields {
  name: string;
  /** Array is optional — a category may exist before any products are linked */
  products?: Product[];
}

export interface Category {
  sys: { id: string };
  fields: CategoryFields;
}


// ── 2. TYPE ALIASES ───────────────────────────────────────────────────────────
// `type` creates an alias for any type expression. Unlike interfaces, type
// aliases can represent unions, intersections, tuples, and mapped types.

/** A product enriched with routing and categorisation data by getAllProducts() */
export type EnrichedProduct = Product & {
  categoryName: string;
  categoryId: string;
  slug: string;
};

/** Shape returned by the /api/search Route Handler */
export type SearchResult = {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  slug: string;
  imageUrl: string | null; // explicit union — imageUrl can legitimately be null
};

/** Metadata attached to every Contentful fetch response */
export type FetchMeta = {
  total: number;
  categories: number;
  fetchDuration: number;
  cacheStrategy: string;
  fetchedAt: string; // ISO 8601 date string
};


// ── 3. GENERIC RESULT TYPE ────────────────────────────────────────────────────
// Generics let you write reusable types that work with any data shape.
// `Result<T, E>` is a pattern from functional programming: instead of
// throwing errors, a function returns either a success value or an error —
// making failure explicit in the type signature.
//
// `T` and `E` are type parameters (like function parameters, but for types).
// By default E extends Error so callers always get a proper error object.

export type Result<T, E extends Error = Error> =
  | { ok: true;  value: T }   // success branch — has `value`, no `error`
  | { ok: false; error: E };  // failure branch — has `error`, no `value`

// Helper constructors — these make creating Result values ergonomic:
//   const res = ok({ products: [...] });  // → { ok: true, value: ... }
//   const res = err(new Error("oops"));   // → { ok: false, error: ... }
export const ok  = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });


// ── 4. DISCRIMINATED UNION ────────────────────────────────────────────────────
// A discriminated union is a set of types that all share a common literal
// field (the "discriminant") — here `status`. TypeScript uses the discriminant
// to narrow the type inside if/switch blocks, giving you exhaustiveness
// checking and autocomplete on the correct branch.

export type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; results: SearchResult[]; meta: FetchMeta & { searchedAt: string } }
  | { status: "error";   message: string };


// ── 5. UTILITY TYPES ──────────────────────────────────────────────────────────
// TypeScript ships built-in generic "utility types" that transform existing
// types without repeating their definitions.

/** All fields required for a product form — nothing can be left out */
export type RequiredProductFields = Required<ProductFields>;
//   ^ Required<T> removes `?` from every property of T

/** A product summary safe to send to the client — image stripped out */
export type ProductSummary = Omit<ProductFields, "image">;
//   ^ Omit<T, K> creates a new type with the named keys removed

/** Only the display-relevant fields from EnrichedProduct */
export type ProductCardProps = Pick<EnrichedProduct, "slug" | "categoryName"> & ProductFields;
//   ^ Pick<T, K> keeps only the named keys

/** Readonly snapshot — prevents mutation after the initial fetch */
export type ImmutableCategory = Readonly<Category>;
//   ^ Readonly<T> makes every property non-writable at the type level


// ── 6. MAPPED TYPE ────────────────────────────────────────────────────────────
// Mapped types iterate over the keys of another type and transform each
// property. This one converts every value in FetchMeta to `string` so the
// metadata can be safely serialised into URL query parameters or debug logs.

export type StringifiedMeta = {
  [K in keyof FetchMeta]: string;
  //  ^ `keyof FetchMeta` is the union: "total" | "categories" | "fetchDuration" | ...
};


// ── 7. CONDITIONAL TYPE + INFER ───────────────────────────────────────────────
// Conditional types let you ask "does T extend U?" and branch on the answer,
// similar to a ternary expression. `infer` extracts a type from inside another
// type at the point it appears in the extends clause.

/** Unwraps a Promise<T> to T; leaves non-promise types unchanged */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
//   e.g. Awaited<Promise<SearchResult[]>> → SearchResult[]
//        Awaited<string>                  → string

/** Extracts the element type from an array, or `never` for non-arrays */
export type ElementType<T> = T extends (infer U)[] ? U : never;
//   e.g. ElementType<SearchResult[]> → SearchResult
//        ElementType<string>         → never


// ── 8. FUNCTION OVERLOADS ─────────────────────────────────────────────────────
// Overload signatures let one function accept different argument shapes
// and return different types depending on what was passed.
// The implementation signature (last one) must be compatible with all overloads
// but is not visible to callers — they only see the overload signatures.

export function slugify(name: string): string;
export function slugify(names: string[]): string[];
export function slugify(input: string | string[]): string | string[] {
  const convert = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return Array.isArray(input) ? input.map(convert) : convert(input);
}
// Callers get the correct return type automatically:
//   slugify("Lifetime ISA")   → string
//   slugify(["ISA", "SIPP"])  → string[]


// ── 9. TYPE GUARD ─────────────────────────────────────────────────────────────
// A type guard is a function with a return type of `value is T`.
// TypeScript narrows the type inside any block where the guard returns true,
// so you can safely access T-specific properties without casting.

export function isEnrichedProduct(value: unknown): value is EnrichedProduct {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    "categoryName" in value &&
    "fields" in value
  );
}

/** Narrows a Result<T> to its success branch */
export function isOk<T>(result: Result<T>): result is { ok: true; value: T } {
  return result.ok === true;
}
