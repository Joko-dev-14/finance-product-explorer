import { getCategories } from "../src/api/getCategories";
import { ProductProvider } from "../src/store/ProductContext";
import CategoryCarousel from "../src/ui/components/organisms/CategoryCarousel";
import SearchBar from "../src/ui/components/molecules/SearchBar";

export default async function Page() {
  const categories = await getCategories();

  return (
    <ProductProvider categories={categories}>
      <div className="pt-6">
        <SearchBar />
        <CategoryCarousel categories={categories} />
      </div>
    </ProductProvider>
  );
}
