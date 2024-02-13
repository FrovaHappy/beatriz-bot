import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import actionNoUsages from './actionNoUsages'
import db from '../../db'
import messages from '../colors/messages'
import validatesRoles from '../shared/validatesRoles'
const name = CommandsNames.colorsRemove
const enum Actions {
  noUsages = 'no-usages',
  all = 'all',
  selected = 'selected'
}
export default BuildCommand({
  name,
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Elimina los roles no utilizados por el jugador.')
    .addStringOption(op =>
      op
        .setName('actions')
        .setRequired(true)
        .setDescription('selecciona la acción a realizar')
        .setChoices({ name: 'not usages', value: Actions.noUsages })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  cooldown: 3 * 60 * 60,
  scope: 'public',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
    const server = await db.server.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    const { validColorMain } = validatesRoles(interaction, server)
    if (!validColorMain) return await interaction.editReply(messages.requireSettings({ interaction }))

    const action = interaction.options.getString('actions')
    if (action === Actions.noUsages) {
      const result = await actionNoUsages(interaction, server)
      return await interaction.editReply({
        content: `
        Roles no usados eliminados: ${result.deleteForNoUsages}
        Roles eliminados manualmente: ${result.delForUndefined}
        `
      })
    }
  }
})
