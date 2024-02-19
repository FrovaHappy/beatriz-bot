import type { BaseFileButton, BaseFileCommand } from './types/BaseFiles'
type BuildCommandFile = Omit<BaseFileCommand, 'type'>
type BuildButtonFile = Omit<BaseFileButton, 'type' | 'scope'>
export function BuildCommand(options: BuildCommandFile): BaseFileCommand {
  return {
    data: options.data,
    name: options.name,
    scope: options.scope,
    cooldown: options.cooldown,
    ephemeral: options.ephemeral ?? false,
    type: 'command',
    execute: options.execute
  }
}
export function BuildButton(options: BuildButtonFile): BaseFileButton {
  return {
    data: options.data,
    execute: options.execute,
    name: options.name,
    ephemeral: options.ephemeral ?? false,
    type: 'button',
    scope: 'public',
    cooldown: options.cooldown
  }
}
