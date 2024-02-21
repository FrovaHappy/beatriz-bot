import { type GuildMember } from 'discord.js'
import { type Text, type Name } from '../../commands/setWelcome/validate'
import { type SKRSContext2D } from '@napi-rs/canvas'
interface Props {
  text: Name | Text
  member: GuildMember
  colorDominate: string
  ctx: SKRSContext2D
}

export default async function namePencil({ member, text, colorDominate, ctx }: Props): Promise<SKRSContext2D> {
  // setting General properties
  ctx.fillStyle = text.color ?? colorDominate
  ctx.font = `${text.weight} ${text.size}px ${text.family}`
  ctx.textBaseline = text.baseline as CanvasTextBaseline
  ctx.textAlign = text.align as CanvasTextAlign

  // selected for the type of text
  let textClipping = ''
  if (text.type === 'name') {
    text = text as Name
    textClipping = member.user[text.nameType as 'id' | 'globalName' | 'username'] ?? member.user.username
  } else {
    text = text as Text
    textClipping = text.content
  }

  // Text clipping
  let lengthLetters = ctx.measureText(textClipping)
  while (text.limitLetters < lengthLetters.width && text.limitLetters !== 0) {
    textClipping = textClipping.slice(0, -1)
    lengthLetters = ctx.measureText(textClipping)
  }
  ctx.fillText(textClipping, text.x, text.y)
  return ctx
}
