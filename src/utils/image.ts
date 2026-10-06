const MAX_SIDE = 1280 // px, plenty for an avatar
const QUALITY = 0.85
const SKIP_BELOW = 700 * 1024 // already small enough, don't touch it

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  // animated/vector formats and small files go up as they are
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  if (file.size <= SKIP_BELOW) return file

  try {
    const bitmap = await createImageBitmap(file) // applies EXIF rotation in modern browsers
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.fillStyle = '#fff' // PNG transparency becomes white instead of black in the JPEG
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    )
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', {
      type: 'image/jpeg',
    })
  } catch {
    return file // e.g. a format the browser can't decode: let the server decide
  }
}