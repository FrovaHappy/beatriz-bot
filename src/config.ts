import 'dotenv/config'
import type { BaseFileCommand } from './types/BaseFiles'

const commandKeys = 'data, execute, scope, type or name'
const validateCommand = (command: BaseFileCommand): boolean => {
  return 'data' in command && 'execute' in command && 'scope' in command && 'type' in command && 'name' in command
}
const discordGuild = (): string[] => {
  try {
    return JSON.parse(process.env.DISCORD_GUILD ?? '')
  } catch {
    return []
  }
}
export default {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? '',
  discordGuild: discordGuild(),
  discordOwner: process.env.DISCORD_OWNER ?? '',
  defaultCooldown: parseInt(process.env.DEFAULT_COOLDOWN ?? '0'),
  validateCommand,
  commandKeys
}
