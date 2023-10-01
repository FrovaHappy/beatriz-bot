import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import type { BaseFileCommand } from '../../types/BaseFiles'
import { CommandsNames } from '../../enums'
const name = CommandsNames.test
export default {
  cooldown: 60,
  type: 'command',
  name,
  scope: 'public',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    console.log(typeof interaction)
    const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.reply({ content: 'test!', components: [row] })
  }
} satisfies BaseFileCommand
