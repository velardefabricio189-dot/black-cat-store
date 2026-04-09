import { getProducts } from '../app/lib/supabase/queries'
import { createClient } from '../app/lib/supabase/server' // <-- 1. Importamos el cliente de servidor
import ProductGrid from '../app/components/catalog/ProductGrid'

export default async function Page() {
  const products = await getProducts()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user 

  return <ProductGrid products={products} isAdmin={isAdmin} />
}