import type { BaseFileCommand } from '../types/BaseFiles'
import updatePublic from './updatePublic'
import updatePrivate from './updatePrivate'
import BuildCollection from '../buildCollection'

async function GetCommands(): Promise<Record<'public' | 'private' | 'owner', string[]>> {
  const commands: Record<BaseFileCommand['scope'], string[]> = {
    owner: [],
    private: [],
    public: []
  }
  const collection = await BuildCollection<string, BaseFileCommand>('commands')
  collection.forEach(command => {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  })
  return commands
}
export default async function deployCommand(): Promise<void> {
  const commands = await GetCommands()
  await updatePublic(commands.public)
  await updatePrivate(commands.private)
}
