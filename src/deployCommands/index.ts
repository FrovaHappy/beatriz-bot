import fs from 'node:fs'
import path from 'node:path'
import config from '../config'
import type { BaseFileCommand } from '../types/BaseFiles'
import updatePublic from './updatePublic'
import updatePrivate from './updatePrivate'

async function GetCommands(): Promise<Record<'public' | 'private' | 'owner', string[]>> {
  const commands: Record<BaseFileCommand['scope'], string[]> = {
    owner: [],
    private: [],
    public: []
  }
  const foldersPath = path.join(__dirname, '../commands')
  const commandFolders = fs.readdirSync(foldersPath)

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file: string) => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of commandFiles) {
      const filePath = `../commands/${folder}/${file}`
      const command: BaseFileCommand = require(filePath).default
      if (config.validateCommand(command)) {
        commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required ${config.commandKeys} property.`)
      }
    }
  }
  return commands
}
export default async function deployCommand(): Promise<void> {
  const commands = await GetCommands()
  await updatePublic(commands.public)
  await updatePrivate(commands.private)
}
