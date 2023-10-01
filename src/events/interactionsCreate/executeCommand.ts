import isCooldownEnable from '../../isCooldownEnable'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'

export default async function executeCommand(interaction: CustomCommandInteraction): Promise<unknown> {
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  const messageCooldown = await isCooldownEnable(interaction, command)
  if (messageCooldown) return await interaction.reply({ content: messageCooldown, ephemeral: true })

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`)
    console.error(error)
  }
}
