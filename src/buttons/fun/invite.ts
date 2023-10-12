import { BuildButton } from '../../buildersSchema'
import config from '../../config'
import { ButtonsNames } from '../../enums'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

const name = ButtonsNames.invite
export default BuildButton({
  name,
  data: new ButtonBuilder().setLabel('Únete a Discord').setStyle(ButtonStyle.Link).setURL(config.discordUrlInvite),
  async execute(interaction) {}
})
