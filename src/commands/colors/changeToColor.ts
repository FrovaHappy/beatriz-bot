import config from '../../config'
import db from '../../db'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import type { ServerWithColors } from '../../types/database'
interface Props {
  color: `#${string}`
  interaction: CustomCommandInteraction
  server: ServerWithColors
}
interface ReturnData {
  hasCreated: boolean
  hasSusses: boolean
}
export default async function changeToColor({ color, interaction, server }: Props): Promise<ReturnData> {
  const coincidence = server.colors.find(c => c.hexColor === color)
  const role = interaction.guild?.roles.cache.find(r => r.id === coincidence?.colorId ?? config.roleUndefined)
  const colorController = interaction.guild?.roles.cache.find(r => r.id === server.colorRoleId ?? config.roleUndefined)

  if (!colorController) return { hasCreated: false, hasSusses: false }
  if (role) {
    interaction.client.cooldowns.get('command-colors')?.delete(interaction.user.id)
    const user = interaction.user
    const member = await interaction.guild?.members.addRole({ user, role })
    return { hasCreated: false, hasSusses: Boolean(member) }
  } else if (coincidence) {
    await db.color.delete({ where: { ...coincidence } })
  }

  const newRole = await interaction.guild?.roles.create({
    color,
    hoist: false,
    mentionable: false,
    name: `color: ${color}`
  })
  if (!newRole) return { hasCreated: false, hasSusses: false }
  await interaction.guild?.roles.setPosition(newRole, colorController.rawPosition)
  const user = interaction.user
  const member = await interaction.guild?.members.addRole({ user, role: newRole })
  const update = await db.server.update({
    where: { serverId: interaction.guildId ?? '' },
    data: { colors: { create: { colorId: newRole.id, hexColor: color } } }
  })

  if (!update || !member) return { hasCreated: true, hasSusses: false }
  return { hasCreated: true, hasSusses: true }
}
