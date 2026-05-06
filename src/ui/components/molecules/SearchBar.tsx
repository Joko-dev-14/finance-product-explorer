"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductSearch } from "../../../hooks/useProductSearch";
import { type SearchResult } from "../../../types/contentful";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");

  // useProductSearch returns SearchState — a discriminated union.
  // TypeScript enforces that we check `state.status` before accessing
  // branch-specific properties like `state.results` or `state.message`.
  const state = useProductSearch(query);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-4">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="Search products… e.g. ISA, pension, savings"
          aria-label="Search products"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-[#78e3df] focus:ring-2 focus:ring-[#78e3df]/30"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results panel */}
      {state.status !== "idle" && (
        <div className="mt-2 rounded-xl border border-gray-100 bg-white shadow-md">

          {state.status === "loading" && (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex animate-pulse gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {state.status === "error" && (
            <div className="p-4 text-sm text-red-500">
              ⚠️ Search failed: {state.message}
            </div>
          )}

          {state.status === "success" && state.results.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No products found for <strong>"{query}"</strong>
            </p>
          )}

          {state.status === "success" && state.results.length > 0 && (
            <ul role="listbox" aria-label="Search results">
              {state.results.map((product: SearchResult) => (
                <li key={product.id} role="option" aria-selected={false}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                    onClick={() => setQuery("")}
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg">
                        💰
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.categoryName}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 text-xs text-gray-400">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
