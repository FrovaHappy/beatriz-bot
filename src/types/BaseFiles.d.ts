import type { BaseEventInteractionCreate } from './main'
import type { CustomButtonInteraction, CustomCommandInteraction } from './InteractionsCreate'
import type { ButtonsNames, CommandsNames } from '../enums'
export interface BaseFileCommand extends BaseEventInteractionCreate {
  data: SlashCommandBuilder
  name: CommandsNames
  type: 'command'
  execute: (interaction: CustomCommandInteraction) => Promise<unknown>
}

export interface BaseFileButton extends BaseEventInteractionCreate {
  data: ButtonBuilder
  name: ButtonsNames
  type: 'button'
  execute: (interaction: CustomButtonInteraction) => Promise<unknown>
}
