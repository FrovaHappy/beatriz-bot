import fs from 'node:fs'
import path from 'node:path'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import config from './config'
import type { ClientCustom } from './types/main'

async function BuildCollection<G, T>(pointFolder: string): Promise<Collection<G, T>> {
  const collection = new Collection<G, T>()
  const foldersPath = path.join(__dirname, pointFolder)
  const commandFolders = fs.readdirSync(foldersPath)

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'))
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath).default
      if (config.validateCommand(command)) {
        collection.set(command.name, command)
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required ${config.commandKeys} property.`)
      }
    }
  }
  return collection
}
export default async function startClient(): Promise<void> {
  const client: ClientCustom = new Client({ intents: [GatewayIntentBits.Guilds] }) as ClientCustom

  client.commands = await BuildCollection('commands')
  client.buttons = await BuildCollection('buttons')
  client.cooldowns = new Collection()

  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath).default
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }

  client.login(config.discordToken)
}
