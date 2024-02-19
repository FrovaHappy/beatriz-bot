import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'

export default async function executeCommand(interaction: CustomCommandInteraction): Promise<unknown> {
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  interaction.deferReply({ ephemeral: command.ephemeral })
  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable(interaction, command)
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`)
    console.error(error)
  }
}
