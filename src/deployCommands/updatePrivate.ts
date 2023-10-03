import { REST, Routes } from 'discord.js'
import config from '../config'

const rest = new REST().setToken(config.discordToken)

export default async function updatePrivate(commands: any[]): Promise<void> {
  for (const guildId of config.discordGuild) {
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
