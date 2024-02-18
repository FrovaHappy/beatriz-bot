import { Events } from 'discord.js'
import executeCommand from './interactionsCreate/executeCommand'
import executeButton from './interactionsCreate/executeButton'
import type { CustomBaseInteraction } from '../types/InteractionsCreate'
import createServerDb from '../shared/createServerDb'
export default {
  name: Events.InteractionCreate,
  async execute(interaction: CustomBaseInteraction) {
    const serverId = interaction.guild?.id
    if (serverId) await createServerDb(serverId)

    if (interaction.isChatInputCommand()) {
      await executeCommand(interaction)
      return
    }
    if (interaction.isButton()) {
      await executeButton(interaction)
    }
  }
}
