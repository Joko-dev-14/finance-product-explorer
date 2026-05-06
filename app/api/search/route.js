import { NextResponse } from "next/server";
import { getAllProducts } from "../../../src/api/getAllProducts";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [], query, total: 0 });
  }

  // getAllProducts now returns Result<T> — check `.ok` before reading `.value`
  const result = await getAllProducts();

  if (!result.ok) {
    return NextResponse.json(
      { error: "Search failed", details: result.error.message },
      { status: 500 }
    );
  }

  const { products, meta } = result.value;

  const matches = products.filter((product) => {
    const name = product.fields.name?.toLowerCase() ?? "";
    const description = product.fields.description?.toLowerCase() ?? "";
    const category = product.categoryName?.toLowerCase() ?? "";
    return (
      name.includes(query) ||
      description.includes(query) ||
      category.includes(query)
    );
  });

  return NextResponse.json({
    results: matches.map((p) => ({
      id: p.sys.id,
      name: p.fields.name,
      description: p.fields.description,
      categoryName: p.categoryName,
      slug: p.slug,
      imageUrl: p.fields.image?.fields?.file?.url
        ? `https:${p.fields.image.fields.file.url}`
        : null,
    })),
    query,
    total: matches.length,
    meta: { ...meta, searchedAt: new Date().toISOString() },
  });
}
