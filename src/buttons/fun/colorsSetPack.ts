import { BuildButton } from '../../buildersSchema'
import db from '../../db'
import { ButtonsNames } from '../../enums'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

const name = ButtonsNames.colors_set_pack
export default BuildButton({
  name,
  data: new ButtonBuilder().setCustomId(name).setLabel('Crear Colores').setStyle(ButtonStyle.Primary).setEmoji({
    id: '951886662055628910',
    name: 'unknown344'
  }),
  async execute(interaction) {
    const server = await db.server.findUnique({ where: { serverId: interaction.guildId ?? '' } })
    console.log(server)
    if (!server?.colorRoleId) {
      return await interaction.update({ content: '`/colors start` es requerido ser ejecutado.' })
    }
    const roleColor = (await interaction.guild?.roles.fetch(server?.colorRoleId)) ?? null
    if (!roleColor) return await interaction.update({ content: '`/colors start` es requerido ser ejecutado.' })
    console.log(roleColor)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(this.data)
    await interaction.update({ content: 'probando', components: [row] })
  }
})
