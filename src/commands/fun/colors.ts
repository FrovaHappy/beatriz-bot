import { SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import COLORS from '../../shared/stackColors'
import changeToColor from './colors/changeToColor'
import removeRoleOfUser from './colors/removeRoleOfUser'

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
    await interaction.deferReply({ ephemeral: true })
    const hexColor = interaction.options.getString('hex-color', true) as `#${string}`
    const hexCustom = interaction.options.getString('hex-custom', false)?.trim().toLowerCase() as `#${string}`
    await removeRoleOfUser(interaction)
    if (!hexCustom) {
      if (hexColor === '#none') return await interaction.editReply({ content: 'color quitado' })
      const colorResult = await changeToColor(hexColor, interaction)
      return await interaction.editReply('color normal' + colorResult)
    }
    if (regexColors.test(hexCustom)) {
      if (hexCustom === '#000000') return await interaction.editReply({ content: 'color invalid #000000' })
      const colorResult = await changeToColor(hexCustom, interaction)
      return await interaction.editReply('color valid' + colorResult)
    }
    await interaction.editReply(`\`${hexCustom}\` es un color invalido, formato:  \`#ffffff\``)
  }
})
