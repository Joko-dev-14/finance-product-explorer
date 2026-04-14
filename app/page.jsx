// app/page.jsx
import { getCategories } from '../src/api/getCategories'
import CategoryCarousel from '../src/ui/components/organisms/CategoryCarousel'

// TODO: add loading and error states for Contentful fetch
// TODO: convert to TypeScript (.tsx) for stronger type safety
export default async function Page() {
  const categories = await getCategories()

  return (
    <main id="main-content">
      <CategoryCarousel categories={categories} />
    </main>
  )
}
