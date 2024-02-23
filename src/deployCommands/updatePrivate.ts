import { REST, Routes } from 'discord.js'
import config from '../config'
import { clearForDelete, getForDelete, getSetting } from '../setting'
import { deleteServers } from '.'

const rest = new REST().setToken(config.discordToken)

export default async function updatePrivate(commands: any[]): Promise<void> {
  const { privatesServers } = getSetting()
  await deleteServers(getForDelete().private, rest)
  clearForDelete(true, false)
  console.log(`\nDeploy Private Commands started with ${privatesServers.length} servers ...`)
  for (const guildId of privatesServers) {
    try {
      const data = (await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: commands
      })) as any[]

      console.log(` · Done ${guildId} with ${data.length} commands`)
    } catch (error: any) {
      console.log(` · Fail ${guildId}: ${error.message}`)
    }
  }
}
