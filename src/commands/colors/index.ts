import { type GuildMemberRoleManager, SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import COLORS from '../../shared/stackColors'
import changeToColor from './changeToColor'
import removeRoleOfUser from './removeRoleOfUser'
import db from '../../db'
import config from '../../config'

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
      strOp.setName('hex-custom').setDescription('color personalizado. Formato #FFFFFF').setMinLength(7).setMaxLength(7)
    ),
  async execute(interaction) {
    const colorCommand = await db.colorCommand.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    if (!colorCommand) return await interaction.editReply('requiere configuración')

    const hexColor = interaction.options.getString('hex-color', true) as `#${string}`
    const hexCustom = interaction.options.getString('hex-custom', false)?.trim().toLowerCase() as `#${string}`
    const { colors, pointerId, rolePermission } = colorCommand
    await removeRoleOfUser({ interaction, colors: colorCommand.colors })

    if (!hexCustom) {
      if (hexColor === '#none') return await interaction.editReply('role quitado')
      const { hasSusses } = await changeToColor({ color: hexColor, interaction, colors, pointerId })
      if (!hasSusses) return await interaction.editReply('service error')
      return await interaction.editReply(`color cambiado ${hexColor}`)
    }
    if (!regexColors.test(hexCustom)) {
      return await interaction.editReply(`color invalido ${hexColor}`)
    }
    if (rolePermission) {
      const isRolePermission = (interaction.member?.roles as GuildMemberRoleManager).cache.has(
        rolePermission ?? config.roleUndefined
      )
      if (!isRolePermission) {
        return await interaction.editReply('requiere /set-color')
      }
    }
    if (hexCustom === '#000000') {
      return await interaction.editReply(`color invalido ${hexColor}`)
    }
    const { hasSusses } = await changeToColor({ color: hexCustom, interaction, colors, pointerId })
    if (!hasSusses) return await interaction.editReply('service error')
    return await interaction.editReply(`color cambiado ${hexColor}`)
  }
})
