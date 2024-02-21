import { createCanvas } from '@napi-rs/canvas'
import { type Canvas } from '../../commands/setWelcome/validate'
import iconPencil from './iconPencil'
import { AttachmentBuilder, type GuildMember } from 'discord.js'
import textPencil from './textPincel'
import imagePencil from './imagePencil'

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const canvas = createCanvas(data.width, data.height)
  let ctx = canvas.getContext('2d')
  ctx.fillStyle = data.background ?? 'transparent'
  ctx.fillRect(0, 0, data.width, data.height)
  for (const layer of data.layers) {
    if (layer.type === 'name' || layer.type === 'text') {
      ctx = await textPencil({ ctx, member, text: layer as any, colorDominate: data.colorDominate ?? 'black' })
    }
    if (layer.type === 'icon') {
      const cLayer = await iconPencil({ member, icon: layer as any })
      ctx.drawImage(cLayer, layer.x, layer.y)
    }
    if (layer.type === 'image') {
      const cLayer = await imagePencil(layer as any)
      ctx.drawImage(cLayer, layer.x, layer.y)
    }
  }

  const extension = 'webp'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
