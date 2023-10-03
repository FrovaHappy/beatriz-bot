import type { BaseFileCommand } from './types/BaseFiles'

export default function BuildCommand(options: BaseFileCommand): BaseFileCommand {
  return {
    data: options.data,
    name: options.name,
    scope: options.scope,
    type: 'command',
    cooldown: options.cooldown,
    execute: options.execute
  }
}
