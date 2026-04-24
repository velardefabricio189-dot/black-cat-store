import { NextResponse } from 'next/server'
import { getAuthSession } from '../../lib/auth'

/**
 * @swagger
 * /api/colors:
 *   get:
 *     tags: [Colores]
 *     summary: Lista todos los colores disponibles
 *     responses:
 *       200:
 *         description: Lista de colores
 */

export async function GET() {
  const { supabase } = await getAuthSession()

  const { data, error } = await supabase
    .from('colors')
    .select('*')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
