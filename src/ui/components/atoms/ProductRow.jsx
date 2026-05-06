"use client";
// ProductRow now delegates open/close state to ProductContext via
// toggleProduct() — removing local useState entirely.
// This means the parent (CategoryCard) can read expandedProductIds to show
// how many products are open, without ProductRow needing to tell it.

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "../../../store/ProductContext";

export default function ProductRow({ product }) {
  // Read open state and actions from context — no local state needed
  const { expandedProductIds, favouriteIds, toggleProduct, toggleFavourite } =
    useProducts();

  const isOpen = expandedProductIds.has(product.sys.id);
  const isFavourited = favouriteIds.has(product.sys.id);
  const panelId = `product-panel-${product.sys.id}`;

  const imageUrl = product.fields.image?.fields?.file?.url
    ? `https:${product.fields.image.fields.file.url}`
    : null;

  const slug = product.fields.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="mb-1.5 overflow-hidden rounded-lg">
      <div className="flex items-center bg-white/10">
        {/* Expand / collapse button */}
        <button
          onClick={() => toggleProduct(product.sys.id)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          <span>{product.fields.name}</span>
          <span
            className={`ml-2 shrink-0 text-[10px] text-white/60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Favourite button */}
        <button
          onClick={() => toggleFavourite(product.sys.id)}
          aria-label={isFavourited ? `Remove ${product.fields.name} from saved` : `Save ${product.fields.name}`}
          aria-pressed={isFavourited}
          className="flex shrink-0 items-center border-l border-white/20 px-3 py-3 text-base transition-colors hover:bg-white/10"
        >
          {isFavourited ? "❤️" : <span className="text-white/60">♡</span>}
        </button>
      </div>

      {/* Expanded panel — only rendered when open, avoids hidden/Tailwind conflicts */}
      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-label={product.fields.name}
          className="border-t border-white/20 bg-black/20 px-4 pb-4 pt-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={product.fields.name}
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-lg object-contain  mx-auto"
              />
            )}
            <p className="text-sm leading-relaxed text-white/80">
              {product.fields.description}
            </p>
          </div>
          <Link
            href={`/products/${slug}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#78e3df] underline-offset-2 hover:underline"
          >
            View full details →
          </Link>
        </div>
      )}
    </div>
  );
}
