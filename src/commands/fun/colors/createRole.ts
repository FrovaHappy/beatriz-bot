import type { Role } from 'discord.js'
import type { CustomCommandInteraction } from '../../../types/InteractionsCreate'
import db from '../../../db'

export default async function createRole(interaction: CustomCommandInteraction): Promise<Role | null> {
  const role = await interaction.guild?.roles
    .create({
      name: `🎨 Controller colors (${interaction.client.user?.username})`,
      hoist: false
    })
    .then(role => role)
  if (!role) return null
  db.server.update({ where: { serverId: interaction.user.id }, data: { colorRoleId: role.id } })
  return role
}
