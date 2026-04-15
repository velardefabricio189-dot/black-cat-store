import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import cloudinary from '../../../../lib/cloudinary/cloudinary'

/**
 * @swagger
 * /api/categories/{id}/image:
 *   post:
 *     tags: [Categorias]
 *     summary: Sube imagen de categoría, desliga la imagen anterior si existe
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen actualizada
 *       400:
 *         description: No se envió imagen
 *       401:
 *         description: No autorizado
 *   delete:
 *     tags: [Categorias]
 *     summary: Elimina la imagen de una categoría
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen eliminada
 *       404:
 *         description: La categoría no tiene imagen
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const supabase = await createClient()
  //const { data: { user } } = await supabase.auth.getUser()
  //if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const formData = await request.formData()
  const image = formData.get('image') as File | null

  if (!image || image.size === 0) {
    return NextResponse.json({ error: 'No se envió ninguna imagen' }, { status: 400 })
  }

  const { data: category } = await supabase
    .from('categories')
    .select('image_url')
    .eq('id', id)
    .single()

  if (category?.image_url) {
    await cloudinary.uploader.destroy(category.image_url).catch(() => {})
  }

  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploaded = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'categorias' },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result)
        }
      ).end(buffer)
    }
  )

  const { data, error } = await supabase
    .from('categories')
    .update({
      image_url: uploaded.public_id,
      public_url: uploaded.secure_url,
    })                         
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    message: 'Imagen actualizada exitosamente',
    image_url: uploaded.public_id,
    public_url: uploaded.secure_url, 
    data,
  })
}

export async function DELETE(_request: Request, { params }: Params) {
  const supabase = await createClient()
  //const { data: { user } } = await supabase.auth.getUser()
  ///if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  const { data: category } = await supabase
    .from('categories')
    .select('image_url')
    .eq('id', id)
    .single()

  if (!category?.image_url) {
    return NextResponse.json(
      { error: 'La categoría no tiene imagen' },
      { status: 404 }
    )
  }

  await cloudinary.uploader.destroy(category.image_url).catch(() => {})

  const { data, error } = await supabase
    .from('categories')
    .update({ image_url: null, public_url: null }) // ← ambas columnas
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Imagen eliminada exitosamente', data })
}