import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import type { CustomButtonInteraction } from '../../types/InteractionsCreate'

export default async function executeCommand(interaction: CustomButtonInteraction): Promise<unknown> {
  const button = interaction.client.buttons.get(interaction.customId)
  if (!button) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }

  interaction.deferReply({ ephemeral: button.ephemeral })
  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable(interaction, button)
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await button.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.customId}`)
    console.error(error)
  }
}
