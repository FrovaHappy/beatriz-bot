import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import BuildCommand from '../../command.schema'
import db from '../../db'

const name = CommandsNames.test
export default BuildCommand({
  cooldown: 60,
  type: 'command',
  name,
  scope: 'public',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    if (!interaction.guildId) return
    const res = await db.server.upsert({
      where: { serverId: interaction.guildId },
      create: { accessCommand: 'public', serverId: interaction.guildId, colorRoleId: '' },
      update: {}
    })
    console.log(res)
    console.log(typeof interaction)
    const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.reply({ content: 'test!', components: [row] })
  }
})
