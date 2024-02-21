import { type Canvas, createCanvas, loadImage } from '@napi-rs/canvas'
import { type Image as ImageZod } from '../../commands/setWelcome/validate'

export default async function imageIcon(image: ImageZod): Promise<Canvas> {
  const c = createCanvas(image.width, image.height)
  const ctx = c.getContext('2d')
  const getImage = await loadImage(image.img)
  ctx.drawImage(getImage, 0, 0, image.width, image.height)
  return c
}
