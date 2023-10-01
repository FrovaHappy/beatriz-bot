import isCooldownEnable from '../../isCooldownEnable'
import type { CustomButtonInteraction } from '../../types/InteractionsCreate'

export default async function executeCommand(interaction: CustomButtonInteraction): Promise<unknown> {
  console.log(interaction.client.buttons)
  const button = interaction.client.buttons.get(interaction.customId)
  if (!button) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }

  const messageCooldown = await isCooldownEnable(interaction, button)
  if (messageCooldown) return await interaction.reply({ content: messageCooldown, ephemeral: true })

  try {
    await button.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.customId}`)
    console.error(error)
  }
}
