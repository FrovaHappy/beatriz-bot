import fs from 'node:fs'
import path from 'node:path'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import config from './config'
import type { ClientCustom } from './types/main'
import BuildCollection from './buildCollection'

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
