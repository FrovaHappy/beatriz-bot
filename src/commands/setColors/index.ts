import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '../../db'
import createRole from './createRole'
import messages from './messages'
import config from '../../config'
const name = CommandsNames.setColors
export default BuildCommand({
  cooldown: 30,
  name,
  scope: 'public',
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
        update: { roleColorPermission: rolePermission?.id ?? config.roleUndefined }
      })

      const role =
        interaction.guild?.roles.cache.find(r => r.id === server.colorRoleId ?? config.roleUndefined) ??
        (await createRole(interaction))

      if (!role) return await interaction.editReply(messages.errorInRole)
      await interaction.editReply(messages.runSetting(interaction))
    }
  }
})
