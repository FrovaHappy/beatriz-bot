import { ButtonsNames, CommandsNames } from '../../enums'
import type { BaseFileCommand } from '../../types/BaseFiles'
import { ActionRowBuilder, type ButtonBuilder, SlashCommandBuilder } from 'discord.js'
const name = CommandsNames.ping
export default {
  cooldown: 30,
  type: 'command',
  name,
  scope: 'public',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    const confirm = interaction.client.buttons.get(ButtonsNames.ping)?.data
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.reply({ content: 'pong!', components: [row] })
  }
} satisfies BaseFileCommand
