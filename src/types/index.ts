export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
}

export type Product = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  active: boolean
  stock: number
}