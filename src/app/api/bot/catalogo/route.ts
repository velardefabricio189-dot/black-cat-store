import { NextResponse } from 'next/server'
import { getAuthSession } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { supabase } = await getAuthSession()
    const { searchParams } = new URL(request.url)

    const categoria = searchParams.get('categoria')
    const buscar = searchParams.get('buscar')
    const limite = Math.min(
      Math.max(Number(searchParams.get('limite')) || 50, 1),
      100
    )

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        stock,
        active,
        categories (
          name,
          slug
        ),
        product_images (
          url,
          is_primary,
          sort_order
        ),
        product_colors (
          color_id,
          colors (
            id,
            name
          )
        ),
        product_sizes (
          size_id,
          sizes (
            id,
            name
          )
        )
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(limite)

    if (categoria) {
      query = query.eq('categories.slug', categoria)
    }

    if (buscar) {
      query = query.ilike('name', `%${buscar}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error consultando catálogo:', error.message)
      return NextResponse.json(
        { error: 'No se pudo consultar el catálogo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      total: data?.length || 0,
      productos: data || []
    })

  } catch (error) {
    console.error('Error en catálogo:', error)

    return NextResponse.json(
      { error: 'Error interno consultando el catálogo' },
      { status: 500 }
    )
  }
        }
