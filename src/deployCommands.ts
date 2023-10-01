import { REST, Routes } from 'discord.js'

import fs from 'node:fs'
import path from 'node:path'
import config from './config'
import type { BaseFileCommand } from './types/BaseFiles'

async function GetCommands(): Promise<any[]> {
  const commands = []
  // Grab all the command files from the commands directory you created earlier
  const foldersPath = path.join(__dirname, 'commands')
  const commandFolders = fs.readdirSync(foldersPath)

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'))
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = `./commands/${folder}/${file}`
      const command: BaseFileCommand = require(filePath).default
      if (config.validateCommand(command)) {
        commands.push(command.data.toJSON())
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required ${config.commandKeys} property.`)
      }
    }
  }
  return commands
}
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.discordToken)

// and deploy your commands!
;(async () => {
  try {
    const commands = await GetCommands()
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = (await rest.put(Routes.applicationGuildCommands(config.discordClient, config.discordGuild), {
      body: commands
    })) as any[]

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
