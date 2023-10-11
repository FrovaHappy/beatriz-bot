import type { Prisma } from '@prisma/client'
import db from '../../../db'
import type { CustomCommandInteraction } from '../../../types/InteractionsCreate'
import type { GuildMemberRoleManager } from 'discord.js'
type ReturnData = Prisma.ColorUncheckedCreateInput
export default async function removeRoleOfUser(
  interaction: CustomCommandInteraction
): Promise<ReturnData[] | undefined> {
  const server = await db.server.findUnique({
    where: { serverId: interaction.guildId ?? '' },
    include: { colors: true }
  })
  if (!server) {
    return undefined
  }

  for (const color of server?.colors) {
    const roles = interaction.member?.roles as GuildMemberRoleManager
    if (roles.cache.has(color.colorId)) {
      await roles.remove(color.colorId)
    }
  }
  return server?.colors
}
