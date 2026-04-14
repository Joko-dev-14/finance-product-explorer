import ProductRow from "../atoms/ProductRow";
import styles from "./CategoryCard.module.css";

// TODO: add transition animation when switching between categories
export default function CategoryCard({ category, isActive, onSelect }) {
  return (
    <article
      className={`${styles.card} ${isActive ? styles.active : styles.inactive}`}
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? -1 : 0}
      onClick={!isActive ? onSelect : undefined}
      onKeyDown={(e) => {
        if (!isActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`${category.fields.name} category${isActive ? ", currently selected" : ""}`}
    >
      <h2 className={styles.title}>{category.fields.name}</h2>

      {isActive && (
        <div role="tabpanel" aria-label={`${category.fields.name} products`}>
          {category.fields.products?.map((product) => (
            <ProductRow key={product.sys.id} product={product} />
          ))}
        </div>
      )}
    </article>
  );
}
