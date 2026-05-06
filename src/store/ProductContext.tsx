"use client";
// ─────────────────────────────────────────────────────────────────────────────
// src/store/ProductContext.tsx
//
// Global state for the product explorer, built with three React primitives:
//   - createContext  — creates the shared state container
//   - useReducer     — manages state transitions via explicit actions
//   - useMemo        — derives computed values without recalculating each render
//
// WHY NOT prop-drilling?
// The active category index lives in CategoryCarousel but is also needed by
// CategoryCard and ProductRow (e.g. to know if they're visible). Passing it
// down through every level creates "prop drilling" — components in the middle
// receive props they don't use just to pass them further down. Context solves
// this by making values available to any descendant without intermediate props.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react";
import { type Category } from "../types/contentful";


// ── 1. STATE SHAPE ────────────────────────────────────────────────────────────

interface ProductState {
  /** Index of the currently visible category in the carousel */
  activeIndex: number;
  /** Set of product IDs whose accordion panels are currently open */
  expandedProductIds: Set<string>;
  /** Set of product IDs the user has favourited */
  favouriteIds: Set<string>;
  /** Total number of categories — needed to clamp navigation */
  totalCategories: number;
}


// ── 2. ACTIONS (discriminated union) ──────────────────────────────────────────
// Each action type is a literal string, making the union exhaustive.
// TypeScript will warn if a new action type is added to the union but not
// handled in the reducer's switch statement.

type ProductAction =
  | { type: "SET_ACTIVE_INDEX"; payload: number }
  | { type: "NEXT_CATEGORY" }
  | { type: "PREV_CATEGORY" }
  | { type: "TOGGLE_PRODUCT"; payload: string }   // payload = product ID
  | { type: "TOGGLE_FAVOURITE"; payload: string } // payload = product ID
  | { type: "COLLAPSE_ALL" };


// ── 3. REDUCER ────────────────────────────────────────────────────────────────
// A reducer is a pure function: (currentState, action) → nextState.
// Pure means no side effects — same inputs always produce the same output.
// This makes state transitions predictable and easy to test in isolation.

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {

    case "SET_ACTIVE_INDEX":
      return {
        ...state,
        activeIndex: Math.max(0, Math.min(action.payload, state.totalCategories - 1)),
        // Collapse all product panels when navigating to a new category
        // so the new category always starts in a clean closed state.
        expandedProductIds: new Set(),
      };

    case "NEXT_CATEGORY":
      return productReducer(state, {
        type: "SET_ACTIVE_INDEX",
        payload: state.activeIndex + 1,
      });

    case "PREV_CATEGORY":
      return productReducer(state, {
        type: "SET_ACTIVE_INDEX",
        payload: state.activeIndex - 1,
      });

    case "TOGGLE_PRODUCT": {
      // Sets are immutable in React state — always create a new Set
      // rather than mutating the existing one, or React won't re-render.
      const next = new Set(state.expandedProductIds);
      next.has(action.payload) ? next.delete(action.payload) : next.add(action.payload);
      return { ...state, expandedProductIds: next };
    }

    case "TOGGLE_FAVOURITE": {
      const next = new Set(state.favouriteIds);
      next.has(action.payload) ? next.delete(action.payload) : next.add(action.payload);
      return { ...state, favouriteIds: next };
    }

    case "COLLAPSE_ALL":
      return { ...state, expandedProductIds: new Set() };

    // TypeScript exhaustiveness check — if a new action type is added to
    // ProductAction but not handled above, this line produces a compile error.
    default: {
      const _exhaustive: never = action;
      return state;
    }
  }
}


// ── 4. CONTEXT ────────────────────────────────────────────────────────────────
// Two separate contexts: one for state (read), one for dispatch (write).
// Splitting them prevents components that only read state from re-rendering
// when dispatch changes (it never does, but the pattern is good practice).

interface ProductContextValue {
  state: ProductState;
  dispatch: Dispatch<ProductAction>;
  // Derived / memoised values (computed in the provider, not re-derived in consumers)
  activeCategory: Category | undefined;
  canGoPrev: boolean;
  canGoNext: boolean;
  favouriteCount: number;
}

const ProductContext = createContext<ProductContextValue | null>(null);


// ── 5. PROVIDER ───────────────────────────────────────────────────────────────
// The Provider wraps the part of the tree that needs access to shared state.
// In this app it wraps the home page content, so all components can read it.

interface ProductProviderProps {
  categories: Category[];
  children: ReactNode;
}

export function ProductProvider({ categories, children }: ProductProviderProps) {
  // Find the default active index — prefer "Savings" category, fall back to 0
  const defaultIndex = useMemo(() => {
    const idx = categories.findIndex((c) =>
      c.fields.name.toLowerCase().includes("saving")
    );
    return idx !== -1 ? idx : 0;
  }, [categories]);

  const [state, dispatch] = useReducer(productReducer, {
    activeIndex: defaultIndex,
    expandedProductIds: new Set<string>(),
    favouriteIds: new Set<string>(),
    totalCategories: categories.length,
  });

  // ── useMemo: derived values ───────────────────────────────────────────────
  // useMemo re-computes only when its dependencies change.
  // Without it, these would recalculate on every render even if state is the same.

  const activeCategory = useMemo(
    () => categories[state.activeIndex],
    [categories, state.activeIndex]
  );

  const canGoPrev = useMemo(() => state.activeIndex > 0, [state.activeIndex]);

  const canGoNext = useMemo(
    () => state.activeIndex < categories.length - 1,
    [state.activeIndex, categories.length]
  );

  const favouriteCount = useMemo(
    () => state.favouriteIds.size,
    [state.favouriteIds]
  );

  // ── useMemo: stable context value ─────────────────────────────────────────
  // Wrapping the context value in useMemo means consumers only re-render
  // when one of these specific values actually changes — not on every parent render.
  const value = useMemo<ProductContextValue>(
    () => ({ state, dispatch, activeCategory, canGoPrev, canGoNext, favouriteCount }),
    [state, dispatch, activeCategory, canGoPrev, canGoNext, favouriteCount]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}


// ── 6. CUSTOM HOOK — useProducts ──────────────────────────────────────────────
// Wrapping useContext in a custom hook:
//   - Throws a clear error if used outside the Provider (common mistake)
//   - Gives consumers a stable, named import instead of `useContext(ProductContext)`
//   - Lets us expose useCallback-wrapped action dispatchers so consumers
//     don't need to know the action shape

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside <ProductProvider>");
  }

  const { state, dispatch, activeCategory, canGoPrev, canGoNext, favouriteCount } = ctx;

  // ── useCallback: stable action dispatchers ────────────────────────────────
  // useCallback returns a memoised function that only changes when its
  // dependencies change. Without this, every render creates a new function
  // reference, which causes child components (even memoised ones) to re-render.

  const goNext = useCallback(
    () => dispatch({ type: "NEXT_CATEGORY" }),
    [dispatch]
  );

  const goPrev = useCallback(
    () => dispatch({ type: "PREV_CATEGORY" }),
    [dispatch]
  );

  const setActiveIndex = useCallback(
    (index: number) => dispatch({ type: "SET_ACTIVE_INDEX", payload: index }),
    [dispatch]
  );

  const toggleProduct = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_PRODUCT", payload: id }),
    [dispatch]
  );

  const toggleFavourite = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_FAVOURITE", payload: id }),
    [dispatch]
  );

  const collapseAll = useCallback(
    () => dispatch({ type: "COLLAPSE_ALL" }),
    [dispatch]
  );

  return {
    // State
    activeIndex: state.activeIndex,
    expandedProductIds: state.expandedProductIds,
    favouriteIds: state.favouriteIds,
    // Derived
    activeCategory,
    canGoPrev,
    canGoNext,
    favouriteCount,
    // Actions
    goNext,
    goPrev,
    setActiveIndex,
    toggleProduct,
    toggleFavourite,
    collapseAll,
  };
}
