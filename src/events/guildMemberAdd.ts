import { type Image, loadImage } from '@napi-rs/canvas'
import { Events, type GuildMember } from 'discord.js'
import { request } from 'undici'
import welcome from './guildMemberAdd/welcome'
import createServerDb from '../shared/createServerDb'

export async function getImageCanvas(url: string): Promise<Image> {
  const { body } = await request(url)
  return await loadImage(await body.arrayBuffer())
}

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const serverId = member.guild?.id
    if (serverId) await createServerDb(serverId)
    await welcome(member)
  }
}