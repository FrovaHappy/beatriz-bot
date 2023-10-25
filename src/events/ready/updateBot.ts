import { ActivityType } from 'discord.js'
import type { ClientCustom } from '../../types/main'

export default async function updateBot(client: ClientCustom): Promise<void> {
  const time = 5 * 60 * 1000
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(async () => {
    const guilds = (await client.guilds.fetch()).size
    client.user?.setPresence({
      activities: [{ name: `Dando soporte a ${guilds} servers 🎉`, type: ActivityType.Custom }]
    })
  }, time)
}
