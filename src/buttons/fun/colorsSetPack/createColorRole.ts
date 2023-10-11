import type { RolePosition } from 'discord.js'
import type { CustomButtonInteraction } from '../../../types/InteractionsCreate'
import { type Colors } from '../../../shared/stackColors'
export interface ReturnData {
  guildId?: string
  colorsPushed: ColorsPushed[]
}
interface ColorsPushed {
  colorId: string
  hexColor: string
}
export default async function createColorsRoles(
  Colors: Colors,
  rawPositionColorController: number,
  interaction: CustomButtonInteraction
): Promise<ReturnData> {
  const stackColors: RolePosition[] = []
  const colorsPushed = []
  for (let i = 0; i < Colors.length; i++) {
    const color = Colors[i]
    const role = await interaction.guild?.roles
      .create({ hoist: false, color: color.hexColor, name: color.name, permissions: '0' })
      .catch(err => {
        console.error(err)
        return null
      })
    if (!role) continue
    colorsPushed.push({ colorId: role.id, hexColor: color.hexColor })
    stackColors.push({ role: role?.id, position: rawPositionColorController })
  }
  return {
    guildId: (
      await interaction.guild?.roles.setPositions(stackColors).catch(() => {
        return null
      })
    )?.id,
    colorsPushed
  }
}
