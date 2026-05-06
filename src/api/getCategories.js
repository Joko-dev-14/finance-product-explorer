import "server-only";
// "server-only" is a package that throws a build-time error if this module
// is ever imported from a Client Component. It's a guardrail that prevents
// Contentful credentials from accidentally leaking into the browser bundle.

import client from "./contentfulClient";

export async function getCategories() {
  // include: 2 resolves nested product references in a single API call,
  // so we don't have to make additional calls to fetch product details
  // for each category (avoids N+1 fetches).
  const res = await client.getEntries({
    content_type: "category",
    include: 2,
  });

  // If Contentful returns an empty result set, surface a clear error rather
  // than rendering a broken carousel. The error will be caught by the nearest
  // error boundary (app/error.jsx) and shown to the user.
  if (!res.items.length) {
    throw new Error(
      "No categories returned from Contentful. Check your content type and space ID.",
    );
  }

  return res.items;
}
