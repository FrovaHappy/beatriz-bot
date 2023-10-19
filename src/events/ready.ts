import type { ClientCustom } from '../types/main'

import { Events } from 'discord.js'
import updateBot from './ready/updateBot'

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ClientCustom) {
    console.log(`Ready! Logged in as ${client.user?.tag}`)
    updateBot(client)
  }
}
