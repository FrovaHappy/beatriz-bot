import type { Prisma } from '@prisma/client'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import type { GuildMemberRoleManager } from 'discord.js'
import type { ServerWithColors } from '../../types/database'
type ReturnData = Prisma.ColorUncheckedCreateInput

interface Props {
  interaction: CustomCommandInteraction
  server: ServerWithColors
}
export default async function removeRoleOfUser({ interaction, server }: Props): Promise<ReturnData[] | undefined> {
  if (!server) {
    return undefined
  }

  for (const color of server.colors) {
    const roles = interaction.member?.roles as GuildMemberRoleManager
    if (roles.cache.has(color.colorId)) {
      await roles.remove(color.colorId)
    }
  }
  return server.colors
}
