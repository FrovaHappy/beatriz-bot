import 'dotenv/config'
import type { BaseFileCommand } from './types/BaseFiles'

const commandKeys = 'data, execute, scope, type or name'
const validateCommand = (command: BaseFileCommand): boolean => {
  return 'data' in command && 'execute' in command && 'scope' in command && 'type' in command && 'name' in command
}
export default {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? '',
  discordGuild: process.env.DISCORD_GUILD ?? '',
  defaultCooldown: parseInt(process.env.DEFAULT_COOLDOWN ?? '0'),
  validateCommand,
  commandKeys
}
