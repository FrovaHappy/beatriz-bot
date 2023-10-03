import { REST, Routes } from 'discord.js'
import config from '../config'

const rest = new REST().setToken(config.discordToken)

export default async function updatePublic(commands: any[]): Promise<void> {
  try {
    console.log(`·  Public | Started | ${commands.length} application (/) commands.`)
    const data = (await rest.put(Routes.applicationCommands(config.discordClient), {
      body: commands
    })) as any[]

    console.log(`·  Public | Done | ${data.length} application (/) commands.`)
  } catch (error: any) {
    console.error(error.rawError)
  }
}
