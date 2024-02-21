import { type Webhook, type GuildMember } from 'discord.js'
import { type Canvas } from '../../commands/setWelcome/validate'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import db from '../../db'
import SendWelcomeWith from '../../shared/sendWelcomeWith'
interface Options {
  channelId: string
}
async function buildWebhook(member: GuildMember, options: Options): Promise<Webhook> {
  const { channelId } = options
  const client = member.client.user
  const webhook = await member.guild.channels.createWebhook({
    channel: channelId,
    name: client.globalName ?? client.username,
    avatar: client.displayAvatarURL({ extension: 'jpg' })
  })
  return webhook
}
export default async function welcome(member: GuildMember): Promise<void> {
  const welcomeDb = await db.welcomeCommand.findUnique({
    where: { serverId: member.guild.id }
  })
  if (!welcomeDb) return
  const { channelId, image, message, send } = welcomeDb
  const imageMock: Canvas = JSON.parse(readFileSync(path.join(__dirname, '../../../mocks/welcome.json'), 'utf-8'))
  const webhook = await buildWebhook(member, { channelId })
  await webhook?.send(await SendWelcomeWith({ send, image: image ?? imageMock, message, member }))
  await webhook.delete()
}
