import { BuildButton } from '../../buildersSchema'
import db from '../../db'
import { ButtonsNames } from '../../enums'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import createColorsRoles from './createColorRole'
import COLORS from '../../shared/stackColors'
import filtersColors from './filtersColors'
const name = ButtonsNames.colors_set_pack
export default BuildButton({
  name,
  data: new ButtonBuilder().setCustomId(name).setLabel('Crear Colores').setStyle(ButtonStyle.Primary).setEmoji({
    id: '951886662055628910',
    name: 'unknown344'
  }),
  async execute(interaction) {
    interaction.deferUpdate()
    const server = await db.server.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    if (!server?.colorRoleId) {
      return await interaction.editReply({ content: '`/colors start` es requerido ser ejecutado.' })
    }
    const colorsFiltered = await filtersColors(COLORS, server.colors, interaction)
    const roleColor = (await interaction.guild?.roles.fetch(server?.colorRoleId)) ?? null

    if (!roleColor) return await interaction.editReply({ content: '`/colors start` es requerido ser ejecutado.' })
    if (!roleColor.editable) return await interaction.editReply({ content: 'El rol debe estar accesible para el bot.' })
    const rolesCreated = await createColorsRoles(colorsFiltered, roleColor.rawPosition, interaction)
    if (rolesCreated.colorsPushed.length > 0) {
      await db.server.update({
        where: { serverId: interaction.guildId ?? '' },
        data: {
          colors: {
            createMany: {
              data: rolesCreated.colorsPushed
            }
          }
        }
      })
    }
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(this.data)
    await interaction.editReply({ content: 'probando', components: [row] })
  }
})
