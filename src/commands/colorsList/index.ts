import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import db from '../../db'
import validatesRoles from '../shared/validatesRoles'
import messages from '../colors/messages'
const name = CommandsNames.colorsList
export default BuildCommand({
  data: new SlashCommandBuilder().setName(name).setDescription('lista los colores del servidor.'),
  name,
  scope: 'public',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true })
    const server = await db.server.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })
    const { validColorMain } = validatesRoles(interaction, server)
    if (!validColorMain) return await interaction.editReply(messages.requireSettings({ interaction }))
    const colors = server?.colors ?? []
    let colorsUsage = 0
    colors.forEach(col => {
      const roleGuild = interaction.guild?.roles.cache.get(col.colorId)
      if (!roleGuild) return
      if (roleGuild.members.size > 0) colorsUsage += 1
    })
    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Lista de colores')
          .addFields(
            { name: 'Total de roles:', value: `${colors.length} roles`, inline: true },
            { name: 'Total de usados:', value: `${colorsUsage} roles`, inline: true }
          )
          .setColor('Random').setDescription(`
            ${colors.map(col => `<@&${col.colorId}>`).join('  <:minimize:1163923149717512323>  ')}
          `)
      ]
    })
  }
})
