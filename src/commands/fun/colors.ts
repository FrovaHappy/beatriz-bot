import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import db from '../../db'
import createRole from './colors/createRole'
import messages from './colors/messages'
const name = CommandsNames.colors
export default BuildCommand({
  cooldown: 30,
  name,
  scope: 'private',
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Colors Here!')
    .addSubcommand(subCommand =>
      subCommand.setName('start').setDescription('Inicia la primera configuración de colores.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'start') {
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
        create: { serverId, accessCommand: 'public' },
        update: {}
      })

      const role = (await interaction.guild?.roles.fetch(server.colorRoleId ?? '')) ?? (await createRole(interaction))

      if (!role) return await interaction.editReply(messages.errorInRole)
      await interaction.editReply(messages.runSetting(interaction))
    }
  }
})
