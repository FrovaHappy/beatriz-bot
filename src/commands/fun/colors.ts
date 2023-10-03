import BuildCommand from '../../command.schema'
import { CommandsNames } from '../../enums'
import { SlashCommandBuilder } from 'discord.js'
const name = CommandsNames.colors
export default BuildCommand({
  cooldown: 30,
  type: 'command',
  name,
  scope: 'private',
  data: new SlashCommandBuilder().setName(name).setDescription('Colors Here!'),
  async execute(interaction) {
    interaction.reply({ content: '# Colors!' })
  }
})
