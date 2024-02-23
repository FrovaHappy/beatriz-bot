import { REST, Routes } from 'discord.js'
import config from '../config'
import { clearForDelete, getForDelete, getSetting } from '../setting'

const rest = new REST().setToken(config.discordToken)

const deleteServers = async (guildsIds: string[]): Promise<void> => {
  for (const guildId of guildsIds) {
    try {
      await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: []
      })
    } catch (error) {
      console.log(`·  - failed to delete guildId: ${guildId}`)
    }
  }
}
export default async function updatePrivate(commands: any[]): Promise<void> {
  await deleteServers(getForDelete().private)
  clearForDelete(true, false)
  for (const guildId of getSetting().privatesServers) {
    try {
      console.log(`·  Private | Started | in ${guildId} | ${commands.length} application (/) commands.`)
      const data = (await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: commands
      })) as any[]

      console.log(`·  Private | Done | in ${guildId} | ${data.length} application (/) commands.`)
    } catch (error: any) {
      console.error(error.rawError)
    }
  }
}
