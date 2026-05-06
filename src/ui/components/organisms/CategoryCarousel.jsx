"use client";
// CategoryCarousel now reads ALL state from ProductContext instead of managing
// it locally with useState. This demonstrates the Context + useReducer pattern:
// the component is purely presentational — it dispatches actions and renders
// state, but owns none of it.

import CategoryCard from "../molecules/CategoryCard";
import { useProducts } from "../../../store/ProductContext";

export default function CategoryCarousel({ categories }) {
  // Destructure exactly what this component needs from context.
  // Components only re-render when their specific slice of context changes.
  const {
    activeIndex,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    setActiveIndex,
    favouriteCount,
    collapseAll,
  } = useProducts();

  const visibleCategories = [
    categories[activeIndex - 1] ?? null,
    categories[activeIndex],
    categories[activeIndex + 1] ?? null,
  ];

  return (
    <section aria-label="Product categories" className="mx-auto max-w-6xl px-6 pb-12">

      {/* Navigation row */}
      <div className="mb-8 mt-8 flex items-center justify-center gap-6">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label={`Previous category: ${categories[activeIndex - 1]?.fields.name ?? "none"}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#78e3df] text-2xl transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          ‹
        </button>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">Explore Accounts</h1>
          {/* Progress indicator — derived from context state */}
          <p className="mt-0.5 text-xs text-gray-400">
            {activeIndex + 1} of {categories.length}
          </p>
        </div>

        <button
          onClick={goNext}
          disabled={!canGoNext}
          aria-label={`Next category: ${categories[activeIndex + 1]?.fields.name ?? "none"}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#78e3df] text-2xl transition-opacity hover:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          ›
        </button>
      </div>

      {/* Favourites + collapse bar — only visible when relevant */}
      {(favouriteCount > 0 || true) && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 shadow-sm">
          <span className="text-sm text-gray-600">
            {favouriteCount > 0 ? (
              <>
                <span className="mr-1">❤️</span>
                <strong>{favouriteCount}</strong> product{favouriteCount !== 1 ? "s" : ""} saved
              </>
            ) : (
              <span className="text-gray-400">No saved products yet — click ♡ to save one</span>
            )}
          </span>
          <button
            onClick={collapseAll}
            className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
          >
            Collapse all
          </button>
        </div>
      )}

      {/* Desktop: three-column carousel */}
      <div role="tablist" aria-label="Product categories" className="hidden gap-4 md:flex">
        {visibleCategories.map((category, i) =>
          category ? (
            <CategoryCard
              key={category.sys.id}
              category={category}
              isActive={category === categories[activeIndex]}
              onSelect={() => setActiveIndex(categories.indexOf(category))}
            />
          ) : (
            <div key={`empty-${i}`} className="flex-1" />
          )
        )}
      </div>

      {/* Mobile: single active card */}
      <div className="flex md:hidden">
        <CategoryCard
          key={categories[activeIndex].sys.id}
          category={categories[activeIndex]}
          isActive={true}
        />
      </div>
    </section>
  );
}
