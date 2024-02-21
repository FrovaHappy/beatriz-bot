import { type Webhook, type GuildMember } from 'discord.js'
import { type Canvas } from '../../../commands/setWelcome/validate'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import buildWelcomeImage from '../../../shared/buildWelcomeImage'
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
  const mock: Canvas = JSON.parse(readFileSync(path.join(__dirname, '../../../mocks/welcome.json'), 'utf-8'))
  const welcomeImage = await buildWelcomeImage(mock, member)
  const webhook = await buildWebhook(member, { channelId: '951875024363585558' })
  await webhook?.send({ content: 'Welcome to', files: [welcomeImage] })
  await webhook.delete()
}
