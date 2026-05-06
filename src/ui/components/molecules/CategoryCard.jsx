import ProductRow from "../atoms/ProductRow";
import { useProducts } from "../../../store/ProductContext";

export default function CategoryCard({ category, isActive, onSelect }) {
  // CategoryCard reads expandedProductIds from context to show a count badge
  // on inactive cards — this would be impossible without context since
  // ProductRow manages expansion state and CategoryCard is its grandparent.
  const { expandedProductIds } = useProducts();

  const productCount = category.fields.products?.length ?? 0;
  const expandedCount = category.fields.products?.filter(
    (p) => expandedProductIds.has(p.sys.id)
  ).length ?? 0;

  return (
    <article
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
      className={[
        "rounded-xl p-5 transition-all duration-300",
        isActive
          ? "flex-[2] bg-[#3d3d3d] text-white"
          : "flex-1 flex cursor-pointer flex-col items-center justify-center bg-[#5a5a5a] text-white opacity-70 hover:opacity-90",
      ].join(" ")}
    >
      <h2 className="mb-1 text-center text-lg font-semibold">
        {category.fields.name}
      </h2>

      {/* Product count badge — visible on both active and inactive cards */}
      <p className={`mb-3 text-center text-xs ${isActive ? "text-gray-400" : "text-gray-300"}`}>
        {productCount} product{productCount !== 1 ? "s" : ""}
        {/* Show how many are expanded — demonstrates cross-component state reading */}
        {isActive && expandedCount > 0 && (
          <span className="ml-1 text-[#78e3df]">· {expandedCount} open</span>
        )}
      </p>

      {isActive && (
        <div
          role="tabpanel"
          aria-label={`${category.fields.name} products`}
          className="flex w-full flex-col gap-0"
        >
          {category.fields.products?.map((product) => (
            <ProductRow key={product.sys.id} product={product} />
          ))}
        </div>
      )}
    </article>
  );
}
