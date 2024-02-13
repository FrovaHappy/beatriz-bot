import { type GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import COLORS from '../../shared/stackColors'
import changeToColor from './changeToColor'
import removeRoleOfUser from './removeRoleOfUser'
import db from '../../db'
import config from '../../config'
import messages from './messages'

const name = CommandsNames.colors
const regexColors = /^#([a-f0-9]{6})$/

export default BuildCommand({
  name,
  scope: 'public',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Cambia el color de tu nombre.')
    .addStringOption(strOp =>
      strOp
        .setName('hex-color')
        .setDescription('agrega un color a tu nombre.')
        .setRequired(true)
        .addChoices(
          { name: 'none', value: '#none' },
          ...COLORS.map(strOp => {
            return { name: strOp.name, value: strOp.hexColor }
          })
        )
    )
    .addStringOption(strOp =>
      strOp.setName('hex-custom').setDescription('color personalizado.').setMinLength(7).setMaxLength(7)
    ),
  async execute(interaction) {
    const server = await db.server.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    if (!server) return await interaction.editReply(messages.requireSettings({ interaction }))
    await interaction.deferReply({ ephemeral: true })
    const hexColor = interaction.options.getString('hex-color', true) as `#${string}`
    const hexCustom = interaction.options.getString('hex-custom', false)?.trim().toLowerCase() as `#${string}`
    await removeRoleOfUser({ interaction, server })
    if (!hexCustom) {
      if (hexColor === '#none') return await interaction.editReply(messages.cleanRole({ interaction }))
      const { hasSusses } = await changeToColor({ color: hexColor, interaction, server })
      if (!hasSusses) return await interaction.editReply(messages.errorService({ interaction }))
      return await interaction.editReply(messages.endingSusses({ color: hexColor, interaction }))
    }
    if (regexColors.test(hexCustom)) {
      const isRolePermission = (interaction.member?.roles as GuildMemberRoleManager).cache.has(
        server.roleColorPermission
      )
      if (!isRolePermission && server.roleColorPermission !== config.roleUndefined) {
        return await interaction.editReply(messages.requireSettings({ interaction }))
      }
      if (hexCustom === '#000000') {
        return await interaction.editReply(messages.invalidColor({ interaction, color: hexCustom }))
      }
      const { hasSusses } = await changeToColor({ color: hexCustom, interaction, server })
      if (!hasSusses) return await interaction.editReply(messages.errorService({ interaction }))
      return await interaction.editReply(messages.endingSusses({ color: hexCustom, interaction }))
    }
    await interaction.editReply(messages.invalidColor({ interaction, color: hexCustom }))
  }
})
