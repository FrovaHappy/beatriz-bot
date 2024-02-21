import { type Canvas, createCanvas, loadImage } from '@napi-rs/canvas'
import { type Icon } from '../../commands/setWelcome/validate'
import { type GuildMember } from 'discord.js'
import shapes from './shapes'

interface Props {
  member: GuildMember
  icon: Icon
}

export default async function iconPencil(props: Props): Promise<Canvas> {
  const { member, icon } = props

  const c = createCanvas(icon.width, icon.height)
  const ctx = c.getContext('2d')

  const urlImage = member.user.displayAvatarURL({ extension: 'jpg' })
  const imageIcon = await loadImage(urlImage)

  const shape = icon.shape
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const iconRecorded = await (async () => {
    if (shape === 'circle') return await shapes.circle({ icon, imageIcon })
    if (/^square(5|10|15|20){0,1}$/.test(shape)) return await shapes.square({ icon, imageIcon })
  })()

  if (!iconRecorded) return c
  ctx.drawImage(iconRecorded, 0, 0, icon.width, icon.height)
  return c
}
