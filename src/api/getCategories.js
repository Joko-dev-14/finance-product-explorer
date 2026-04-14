import "server-only";
import client from "./contentfulClient";

// TODO: add error handling if Contentful fetch fails
export async function getCategories() {
  // include: 2 resolves nested product references in a single API call, 
  // so we don't have to make additional calls to fetch product details for each category
  const res = await client.getEntries({
    content_type: "category",
    include: 2,
  });

  return res.items;
}
