const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function cloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    fit?: 'fill' | 'crop' | 'scale' | 'thumb'
  } = {}
) {
  const { width = 400, height = 400, quality = 80, fit = 'fill' } = options

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},h_${height},c_${fit},q_${quality},f_auto/${publicId}`
}