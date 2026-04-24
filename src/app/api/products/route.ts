import { NextResponse } from 'next/server'
import { requireUser, getAuthSession } from '../../lib/auth'


/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar todos las prendas
 *     parameters:
 *       - name: categoria
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Slug de la categoría para filtrar
 *     responses:
 *       200:
 *         description: Lista de productos
 *   post:
 *     tags: [Productos]
 *     summary: Crear un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, category_id]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Datos inválidos
 */

//GET  de los productos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('categoria')

  const {supabase} = await getAuthSession()
  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images!inner(id, public_id, url, is_primary, sort_order)
    `)
    .eq('product_images.is_primary', true)
    .order('created_at', { ascending: false })
    .order('sort_order', { referencedTable: 'product_images', ascending: true })

  if (slug) {
    query = query.eq('categories.slug', slug)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}




// POST de los productos
// POST de los productos
export async function POST(request: Request) {
  const { supabase, unauthorizedResponse } = await requireUser()
  if (unauthorizedResponse) {
    return unauthorizedResponse
  }

  const formData = await request.formData()
  const name        = formData.get('name') as string
  const description = formData.get('description') as string
  const price       = formData.get('price') as string
  const category_id = formData.get('category_id') as string
  const stock       = formData.get('stock') as string
  const color_ids   = JSON.parse((formData.get('color_ids') as string) || '[]')
  const size_ids    = JSON.parse((formData.get('size_ids') as string) || '[]')

  if (!name || !price || !category_id) {
    return NextResponse.json(
      { error: 'name, price y category_id son requeridos' },
      { status: 400 }
    )
  }

  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price: parseFloat(price),
      category_id,
      stock: stock ? parseInt(stock) : 0,
      active: true,
    })
    .select()
    .single()

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 })

  if (color_ids.length > 0) {
    const colorInserts = color_ids.map((colorId: string) => ({
      product_id: productData.id,
      color_id: colorId
    }))
    const { error: colorsError } = await supabase.from('product_colors').insert(colorInserts)
    if (colorsError) console.error("Error guardando colores:", colorsError)
    }


  if (size_ids.length > 0) {
    const sizeInserts = size_ids.map((sizeId: string) => ({
      product_id: productData.id,
      size_id: sizeId
    }))
    const { error: sizesError } = await supabase.from('product_sizes').insert(sizeInserts)
    if (sizesError) console.error("Error guardando tallas:", sizesError)
  }

  return NextResponse.json({ data: productData }, { status: 201 })
}