import config from '../../config'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import type { ServerWithColors } from '../../types/database'
interface ReturnData {
  validColorMain: boolean
  validColorPermission: boolean
}
export default function validatesRoles(
  interaction: CustomCommandInteraction,
  server: ServerWithColors | null
): ReturnData {
  const colorController = interaction.guild?.roles.cache.has(server?.colorRoleId ?? config.roleUndefined) ?? false
  const colorPermission =
    interaction.guild?.roles.cache.has(server?.roleColorPermission ?? config.roleUndefined) ?? false

  return {
    validColorMain: colorController,
    validColorPermission: colorPermission
  }
}
