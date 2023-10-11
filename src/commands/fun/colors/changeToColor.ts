import db from '../../../db'
import type { CustomCommandInteraction } from '../../../types/InteractionsCreate'

export default async function changeToColor(
  color: `#${string}`,
  interaction: CustomCommandInteraction
): Promise<string | null> {
  const server = await db.server.findUnique({
    where: { serverId: interaction.guildId ?? '' },
    include: { colors: true }
  })
  const coincidence = server?.colors.find(c => c.hexColor === color)

  const role = interaction.guild?.roles.cache.find(r => r.id === coincidence?.colorId ?? '0')
  const colorController = interaction.guild?.roles.cache.find(r => r.id === server?.colorRoleId ?? '0')
  if (!colorController) return null
  if (role) {
    interaction.client.cooldowns.get('command-colors')?.delete(interaction.user.id)
    const user = interaction.user
    const member = await interaction.guild?.members.addRole({ user, role })
    return member?.toString() ?? null
  }
  const newRole = await interaction.guild?.roles.create({
    color,
    hoist: false,
    mentionable: false,
    name: `color: ${color}`
  })
  if (!newRole) return null
  await interaction.guild?.roles.setPosition(newRole, colorController.rawPosition)
  const user = interaction.user
  const member = await interaction.guild?.members.addRole({ user, role: newRole })
  const update = await db.server.update({
    where: { serverId: interaction.guildId ?? '' },
    data: { colors: { create: { colorId: newRole.id, hexColor: color } } }
  })

  if (!update) return null
  return member?.toString() ?? null
}
