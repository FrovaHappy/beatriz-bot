import type { BaseFileCommand } from '../types/BaseFiles'
import updatePublic from './updatePublic'
import updatePrivate from './updatePrivate'
import config from '../config'
import { type REST, Routes, type Collection } from 'discord.js'
async function GetCommands(
  collection: Collection<string, BaseFileCommand>
): Promise<Record<'public' | 'private' | 'owner', string[]>> {
  const commands: Record<BaseFileCommand['scope'], string[]> = {
    owner: [],
    private: [],
    public: []
  }
  collection.forEach(command => {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  })
  return commands
}
export const deleteServers = async (guildsIds: string[], rest: REST): Promise<void> => {
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

export default async function deployCommand(collection: Collection<string, BaseFileCommand>): Promise<void> {
  const commands = await GetCommands(collection)
  await updatePublic(commands.public)
  await updatePrivate(commands.private)
}
