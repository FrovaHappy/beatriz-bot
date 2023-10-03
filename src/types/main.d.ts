import type { Client, Collection } from 'discord.js'
import type { BaseFileButton, BaseFileCommand } from './BaseFiles'
import type { ButtonsNames, CommandsNames } from '../enums'

export interface ClientCustom extends Client {
  commands: Collection<string, BaseFileCommand>
  cooldowns: Collection<string, Collection<string, number>>
  buttons: Collection<string, BaseFileButton>
}

export interface BaseEventInteractionCreate {
  name: CommandsNames | ButtonsNames
  type: 'command' | 'button'
  scope: 'public' | 'private' | 'owner'
  cooldown?: number
}
