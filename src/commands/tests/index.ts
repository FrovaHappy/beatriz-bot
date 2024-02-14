import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import fonts from '../../shared/fonts'
const name = CommandsNames.test
export default BuildCommand({
  cooldown: 60,
  name,
  scope: 'private',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    if (!interaction.guildId) return
    fonts.forEach(font => GlobalFonts.registerFromPath(font.patch, font.nameAlias))
    const c = createCanvas(200, 100)
    const ctx = c.getContext('2d')
    ctx.font = '30px Inter'
    ctx.fillText('Hello World', 10, 50)
    const attachment = new AttachmentBuilder(await c.encode('png'), { name: 'profile-image.png' })
    const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm Ban').setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm)
    interaction.reply({ content: 'test!', components: [row], files: [attachment] })
  }
})
