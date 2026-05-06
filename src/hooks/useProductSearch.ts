"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useProductSearch.ts
//
// A typed custom React hook — this file demonstrates:
//   - Generic hooks
//   - Discriminated union state
//   - Type narrowing with a type guard
//   - ReturnType<> utility type
//   - AbortController for cancelling stale in-flight requests
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import {
  type SearchResult,
  type FetchMeta,
  type SearchState,
} from "../types/contentful";

// ── API response shape ────────────────────────────────────────────────────────
// Defines exactly what /api/search returns. Separating this from SearchState
// keeps the network contract independent from the UI state machine.
interface SearchApiResponse {
  results: SearchResult[];
  query: string;
  total: number;
  meta: FetchMeta & { searchedAt: string };
}

// ── Generic hook signature ────────────────────────────────────────────────────
// The hook is generic over the result item type `T` (defaults to SearchResult)
// so it could be reused for any debounced search endpoint in the future.
// Right now `T` is always `SearchResult`, but the generic makes the contract
// explicit: "this hook produces arrays of T".
//
// ReturnType<typeof useProductSearch> lets other files reference the hook's
// return type without duplicating it — e.g. for prop types or test mocks.
export function useProductSearch(query: string, debounceMs = 300): SearchState {

  // ── Discriminated union as state ──────────────────────────────────────────
  // Using SearchState (defined in contentful.ts) as the state type means
  // TypeScript enforces that every branch is handled in the JSX.
  // You can't accidentally read `.results` on the "loading" branch.
  const [state, setState] = useState<SearchState>({ status: "idle" });

  // useRef stores the debounce timer across renders without triggering a
  // re-render when it changes (unlike useState).
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AbortController lets us cancel an in-flight fetch if the user types
  // again before the previous request completes. Without this, a slow
  // earlier response could overwrite a faster later one (a "race condition").
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear any pending debounce timer from the previous keystroke
    if (timerRef.current) clearTimeout(timerRef.current);

    // Cancel any in-flight request from the previous debounce window
    controllerRef.current?.abort();

    if (query.trim().length < 2) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });

    timerRef.current = setTimeout(async () => {
      // Create a fresh AbortController for this request
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
          // Pass the signal so fetch() is cancelled when controller.abort() fires
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`Search API returned ${res.status}`);

        // ── Type assertion on fetch response ─────────────────────────────────
        // fetch().json() returns `unknown` in strict TypeScript.
        // We assert the type here after validating `res.ok` above.
        // In production, use zod.parse() for runtime validation.
        const data = (await res.json()) as SearchApiResponse;

        // Transition to the success branch of SearchState
        setState({
          status: "success",
          results: data.results,
          meta: data.meta,
        });
      } catch (e) {
        // AbortError is expected when the user types quickly — ignore it
        if (e instanceof DOMException && e.name === "AbortError") return;

        // ── Type narrowing with instanceof ────────────────────────────────────
        // `e` is typed as `unknown` in catch blocks (strict mode).
        // instanceof narrows it to Error so we can safely read `.message`.
        const message =
          e instanceof Error ? e.message : "An unexpected error occurred";

        setState({ status: "error", message });
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    };
  }, [query, debounceMs]);

  return state;
}

// ── Derived type export ───────────────────────────────────────────────────────
// Other files can import this type to reference the hook's return value
// without repeating the type definition.
// e.g. `function renderSearch(state: ProductSearchState) { ... }`
export type ProductSearchState = ReturnType<typeof useProductSearch>;
