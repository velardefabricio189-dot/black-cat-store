import { createClient } from './server'
import type { Category, Product } from '../../../types/index'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data ?? []
}

export async function getProducts(slug?: string): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}


export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(name, slug)') // ¡inner directo, sin condicionales!
    .eq('active', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}