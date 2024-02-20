import { SlashCommandBuilder } from 'discord.js'
import { CommandsNames, WelcomeOptions } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { validateCanvas } from './validate'
import { formatZodError } from '../../shared/validate'

const name = CommandsNames.setWelcome
export default BuildCommand({
  cooldown: 0,
  name,
  ephemeral: true,
  scope: 'private',
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Setting the welcome of this server.')
    .addChannelOption(op =>
      op.setName('channel').setDescription('Channel where welcomes will be sent.').setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('send')
        .setDescription('Choose how the welcome will be sent.')
        .addChoices(
          { name: 'alone message', value: WelcomeOptions.aloneMessage },
          { name: 'Alone Image', value: WelcomeOptions.aloneImage },
          { name: 'All', value: WelcomeOptions.all }
        )
        .setRequired(true)
    )
    .addStringOption(op => op.setName('message').setDescription('Customize the welcome message').setRequired(false))
    .addStringOption(op =>
      op.setName('image').setDescription('Customize the welcome image, se espera un formato JSON.').setRequired(false)
    ),
  async execute(i) {
    const image = i.options.getString('image')
    const message = i.options.getString('message')
    const channel = i.options.getChannel('channel', true)
    console.log(message, channel.id, image?.slice(0, 50))
    if (!i.guildId) return
    const mock = JSON.parse(readFileSync(path.join(__dirname, '../../mocks/welcome.json'), 'utf-8'))
    const invalidJson = validateCanvas(mock)
    console.log(invalidJson)
    if (invalidJson) return await i.editReply({ content: formatZodError(invalidJson) })
    await i.editReply({ content: 'data valid' })
  }
})
