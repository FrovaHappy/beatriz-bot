import { type GuildMember, SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { validateCanvas } from './validate'
import { formatZodError } from '../../shared/validate'
import { SendWelcome } from '@prisma/client'
import messageFormatting from '../shared/messageFormatting'
import db from '../../db'
import { stringToJson } from '../../shared/general'
import SendWelcomeWith from '../../shared/sendWelcomeWith'

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
          { name: 'alone message', value: SendWelcome.alone_message },
          { name: 'Alone Image', value: SendWelcome.alone_image },
          { name: 'none', value: SendWelcome.none },
          { name: 'All', value: SendWelcome.all }
        )
        .setRequired(true)
    )
    .addStringOption(op => op.setName('message').setDescription('Customize the welcome message').setRequired(false))
    .addStringOption(op =>
      op.setName('image').setDescription('Customize the welcome image, se espera un formato JSON.').setRequired(false)
    ),
  async execute(i) {
    const serverId = i.guild?.id
    if (!serverId) return await i.editReply({ content: 'error with server id' })
    const image = stringToJson(i.options.getString('image') ?? '')
    const imageMock = stringToJson(readFileSync(path.join(__dirname, '../../mocks/welcome.json'), 'utf-8'))
    const message = i.options.getString('message') ?? 'welcome <user_name> with you we are <user_count>.'
    const channelId = i.options.getChannel('channel', true).id
    const send = i.options.getString('send', true) as SendWelcome

    const invalidJson = image ? validateCanvas(image) : undefined
    if (invalidJson) return await i.editReply({ content: formatZodError(invalidJson) })
    const messageReply = messageFormatting(message, {
      userName: i.user.username,
      userGlobal: i.user.globalName ?? '<error UserGlobal>',
      userId: i.user.id,
      userCount: i.guild?.memberCount.toString() ?? '<Error Count>'
    })
    await db.server.update({
      where: { serverId },
      data: {
        welcome: {
          upsert: { create: { channelId, message, send, image }, update: { channelId, message, send, image } }
        }
      }
    })

    await i.editReply(
      await SendWelcomeWith({ image: image ?? imageMock, message: messageReply, member: i.member as GuildMember, send })
    )
  }
})
