import { type RoleResolvable, SlashCommandBuilder, type Role, PermissionFlagsBits } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import db from '../../db'
import validatesRoles from './shared/validatesRoles'
import messages from './colors/messages'
interface Positions {
  position: number
  role: RoleResolvable
}
const name = CommandsNames.colorsOrder
export default BuildCommand({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Ordena los roles ya creados.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  name,
  scope: 'public',
  cooldown: 60,
  async execute(interaction: CustomCommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const server = await db.server.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    const { validColorMain } = validatesRoles(interaction, server)
    if (!validColorMain) return await interaction.editReply(messages.requireSettings({ interaction }))

    const colors = server?.colors ?? []
    const colorMain = interaction.guild?.roles.cache.find(r => r.id === server?.colorRoleId) as Role
    const positions: Positions[] = []
    for await (const color of colors) {
      const role = interaction.guild?.roles.cache.find(r => r.id === color.colorId)
      if (role) positions.push({ position: colorMain.rawPosition, role })
      if (!role) await db.color.delete({ where: color })
    }
    await interaction.guild?.roles.setPositions(positions)

    return await interaction.editReply({ content: `Roles ordenados en la position ${colorMain.rawPosition}` })
  }
})
