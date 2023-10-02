import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import type { BaseFileCommand } from '../../types/BaseFiles'
import { CommandsNames } from '../../enums'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const name = CommandsNames.test
export default {
  cooldown: 60,
  type: 'command',
  name,
  scope: 'public',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    if (!interaction.guildId) return
    const res = await prisma.server.upsert({
      where: { serverId: interaction.guildId },
      create: { accessCommand: 'public', serverId: interaction.guildId, colorRoleId: '' },
      update: {}
    })
    console.log(res)
    console.log(typeof interaction)
    const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.reply({ content: 'test!', components: [row] })
  }
} satisfies BaseFileCommand
