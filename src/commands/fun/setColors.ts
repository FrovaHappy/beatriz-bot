import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '../../db'
import createRole from './setColors/createRole'
import messages from './setColors/messages'
const name = CommandsNames.setColors
export default BuildCommand({
  cooldown: 30,
  name,
  scope: 'private',
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Inicia la primera configuración de colores.')
    .addRoleOption(roleOption => roleOption.setName('role').setDescription('rol requerido para /colors'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const rolePermission = interaction.options.getRole('role', false)
    if (interaction.commandName === name) {
      interaction.deferReply({ ephemeral: true })
      if (!interaction.appPermissions?.has([PermissionFlagsBits.ManageRoles])) {
        return await interaction.editReply(messages.requiredPermissions)
      }
      const serverId = interaction.guildId
      if (!serverId) {
        return await interaction.editReply(messages.serverIdNotFound)
      }
      const server = await db.server.upsert({
        where: { serverId },
        create: { serverId, accessCommand: 'public', roleColorPermission: rolePermission?.id ?? '0' },
        update: { roleColorPermission: rolePermission?.id ?? '0' }
      })

      const role = (await interaction.guild?.roles.fetch(server.colorRoleId ?? '')) ?? (await createRole(interaction))

      if (!role) return await interaction.editReply(messages.errorInRole)
      await interaction.editReply(messages.runSetting(interaction))
    }
  }
})
