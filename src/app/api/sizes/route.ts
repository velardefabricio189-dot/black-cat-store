import { NextResponse } from 'next/server'
import { getAuthSession } from '../../lib/auth'

/**
 * @swagger
 * /api/sizes:
 *   get:
 *     tags: [Tallas]
 *     summary: Lista todas las tallas disponibles
 *     responses:
 *       200:
 *         description: Lista de tallas
 */

export async function GET() {
  const { supabase } = await getAuthSession()
  const { data, error } = await supabase
    .from('sizes')
    .select('*')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
