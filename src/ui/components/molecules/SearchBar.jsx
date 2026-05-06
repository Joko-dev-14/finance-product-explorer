"use client";
// SearchBar is a Client Component because it uses:
//   - useState  — tracks query text and search results
//   - useEffect — fires the fetch call whenever the query changes
//   - useRef    — manages the debounce timer between keystrokes
//
// The actual search runs in app/api/search/route.js on the server.
// This component only sends the query and renders the results.

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ── State machine ───────────────────────────────────────────────────────────
// idle     → user hasn't typed anything / cleared the input
// loading  → fetch in-flight
// success  → fetch completed, results (possibly empty) ready
// error    → fetch threw or server returned 5xx

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    // Clear previous timer on every keystroke so we only fetch after the
    // user pauses typing (300ms). This is "debouncing" — it prevents
    // firing a network request for every single character.
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setStatus("idle");
      setResults([]);
      setMeta(null);
      return;
    }

    setStatus("loading");

    debounceRef.current = setTimeout(async () => {
      try {
        // fetch() to our own Next.js Route Handler (app/api/search/route.js).
        // Using a relative URL means this works in dev and production without
        // hardcoding a domain name.
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );

        if (!res.ok) throw new Error(`Search API returned ${res.status}`);

        const data = await res.json();
        setResults(data.results);
        setMeta(data.meta);
        setStatus("success");
      } catch (err) {
        setErrorMsg(err.message);
        setStatus("error");
      }
    }, 300);

    // Cleanup: if the component unmounts mid-debounce, cancel the timer
    // to avoid calling setState on an unmounted component.
    return () => clearTimeout(debounceRef.current);
  }, [query]); // Re-run whenever the query string changes

  return (
    <div className="mx-auto max-w-6xl px-6 pb-4">
      {/* ── Search input ─────────────────────────────────────────────────── */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products… e.g. ISA, pension, savings"
          aria-label="Search products"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-[#78e3df] focus:ring-2 focus:ring-[#78e3df]/30"
        />
        {/* Clear button — only shown when there's a query */}
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

      {/* ── Results panel ────────────────────────────────────────────────── */}
      {status !== "idle" && (
        <div className="mt-2 rounded-xl border border-gray-100 bg-white shadow-md">

          {/* Loading skeleton */}
          {status === "loading" && (
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

          {/* Error state */}
          {status === "error" && (
            <div className="p-4 text-sm text-red-500">
              ⚠️ Search failed: {errorMsg}
            </div>
          )}

          {/* Success — no results */}
          {status === "success" && results.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No products found for <strong>"{query}"</strong>
            </p>
          )}

          {/* Success — results list */}
          {status === "success" && results.length > 0 && (
            <>
              <ul role="listbox" aria-label="Search results">
                {results.map((product) => (
                  <li key={product.id} role="option" aria-selected="false">
                    {/* Link to the dynamic product page */}
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
                      <span className="ml-auto shrink-0 text-xs text-gray-400">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* ── Fetch metadata panel ────────────────────────────────── */}
              {meta && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Data fetch details
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 sm:grid-cols-3">
                    <span>
                      <span className="font-medium text-gray-700">Results:</span>{" "}
                      {results.length} / {meta.total} products
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Fetch time:</span>{" "}
                      {meta.fetchDuration}ms
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Cache:</span>{" "}
                      {meta.cacheStrategy}
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">Categories:</span>{" "}
                      {meta.categories}
                    </span>
                    <span className="col-span-2">
                      <span className="font-medium text-gray-700">Fetched at:</span>{" "}
                      {new Date(meta.fetchedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
