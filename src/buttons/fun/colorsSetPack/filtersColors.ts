import type { Role } from 'discord.js'
import type { CustomButtonInteraction } from '../../../types/InteractionsCreate'
import type { Colors } from './stackColors'
interface ColorsServers {
  id: string
  serverId: string
  colorId: string
  hexColor: string
}
export default async function filtersColors(
  colors: Colors,
  serverColors: ColorsServers[],
  interaction: CustomButtonInteraction
): Promise<Colors> {
  const roles: Role[] = (await interaction.guild?.roles.fetch('')) as any

  colors = colors.filter(color => {
    const serverColorsFiltered = serverColors.some(
      c => roles.some(r => r.id === c.colorId) && c.hexColor === color.hexColor
    )
    return !serverColorsFiltered
  })
  return colors
}
