import { Events, type GuildMember } from 'discord.js'

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    console.log(member)
  }
}
