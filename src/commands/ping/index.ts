import { BuildCommand } from '../../buildersSchema'
import { ButtonsNames, CommandsNames } from '../../enums'
import { ActionRowBuilder, type ButtonBuilder, SlashCommandBuilder } from 'discord.js'
const name = CommandsNames.ping
export default BuildCommand({
  cooldown: 30,
  name,
  scope: 'owner',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    const confirm = interaction.client.buttons.get(ButtonsNames.ping)?.data
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.editReply({ content: 'pong!', components: [row] })
  }
})
