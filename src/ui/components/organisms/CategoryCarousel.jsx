"use client";

import { useState } from "react";
import CategoryCard from "../molecules/CategoryCard";
import styles from "./CategoryCarousel.module.css";

// TODO: add swipe gesture support for mobile navigation
export default function CategoryCarousel({ categories }) {
  const savingsIndex = categories.findIndex((c) =>
    c.fields.name.toLowerCase().includes("saving"),
  );
  const [activeIndex, setActiveIndex] = useState(
    savingsIndex !== -1 ? savingsIndex : 0,
  );

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setActiveIndex((i) => Math.min(categories.length - 1, i + 1));

  // always keep active category centred by anchoring the window around it
  const visibleCategories = [
    categories[activeIndex - 1] ?? null,
    categories[activeIndex],
    categories[activeIndex + 1] ?? null,
  ];

  return (
    <section aria-label="Product categories">
      <div className={styles.header}>
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className={styles.navBtn}
          aria-label={`Previous category: ${categories[activeIndex - 1]?.fields.name ?? "none"}`}
        >
          ‹
        </button>
        <h1 className={styles.heading}>Explore Accounts</h1>
        <button
          onClick={next}
          disabled={activeIndex === categories.length - 1}
          className={styles.navBtn}
          aria-label={`Next category: ${categories[activeIndex + 1]?.fields.name ?? "none"}`}
        >
          ›
        </button>
      </div>

      {/* Desktop */}
      <div
        className={`${styles.carousel} ${styles.desktopOnly}`}
        role="tablist"
        aria-label="Product categories"
      >
        {visibleCategories.map((category, i) =>
          category ? (
            <CategoryCard
              key={category.sys.id}
              category={category}
              isActive={category === categories[activeIndex]}
              onSelect={() => setActiveIndex(categories.indexOf(category))}
            />
          ) : (
            <div key={`empty-${i}`} className={styles.emptySlot} />
          ),
        )}
      </div>

      {/* Mobile */}
      <div className={`${styles.carousel} ${styles.mobileOnly}`}>
        <CategoryCard
          key={categories[activeIndex].sys.id}
          category={categories[activeIndex]}
          isActive={true}
        />
      </div>
    </section>
  );
}
