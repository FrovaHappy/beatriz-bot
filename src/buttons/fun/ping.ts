import { ButtonsNames } from '../../enums'
import type { BaseFileButton } from '../../types/BaseFiles'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

const name = ButtonsNames.ping
export default {
  name,
  type: 'button',
  scope: 'public',
  data: new ButtonBuilder().setCustomId(name).setLabel('Confirm Ban').setStyle(ButtonStyle.Danger),
  async execute(interaction) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(this.data)
    await interaction.update({ content: 'pong! edit x3', components: [row] })
  }
} satisfies BaseFileButton
