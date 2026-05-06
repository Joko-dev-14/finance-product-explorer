import { getProductBySlug, getAllProducts } from "../../../src/api/getAllProducts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const result = await getAllProducts();
  if (!result.ok) return [];
  return result.value.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.fields.name,
    description: product.fields.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const imageUrl = product.fields.image?.fields?.file?.url
    ? `https:${product.fields.image.fields.file.url}`
    : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
        ← Back to all products
      </Link>
      <div className="mt-4 rounded-2xl bg-white p-8 shadow-sm">
        <span className="mb-4 inline-block rounded-full bg-[#78e3df]/20 px-3 py-1 text-xs font-medium text-[#3d3d3d]">
          {product.categoryName}
        </span>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {imageUrl && (
            <Image src={imageUrl} alt={product.fields.name} width={80} height={80}
              className="shrink-0 rounded-xl object-contain mx-auto" priority />
          )}
          <div>
            <h1 className="mb-3 text-2xl font-bold text-gray-800">{product.fields.name}</h1>
            <p className="leading-relaxed text-gray-600">{product.fields.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
