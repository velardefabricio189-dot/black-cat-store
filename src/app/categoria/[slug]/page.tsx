import { getProductsByCategory } from '../../lib/supabase/queries'
import { createClient } from '../../lib/supabase/server' 
import ProductGrid from '../../components/catalog/ProductGrid'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const products = await getProductsByCategory(slug)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user
  return <ProductGrid products={products} isAdmin={isAdmin} />
}