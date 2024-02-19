import { SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
import validate from '../../shared/validate'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { canvasZod, obtainType } from './validate'

const name = CommandsNames.setWelcome
export default BuildCommand({
  cooldown: 0,
  name,
  ephemeral: true,
  scope: 'private',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    if (!interaction.guildId) return
    const mock = JSON.parse(readFileSync(path.join(__dirname, '../../mocks/welcome.json'), 'utf-8'))
    const invalidObj = validate(mock, canvasZod) ?? false
    if (invalidObj) return await interaction.reply({ content: JSON.stringify(invalidObj).slice(0, 2000) })
    for (const layer of mock.layers) {
      const typeZod = obtainType(layer.type)
      const invalidLayer = validate(layer, typeZod)
      console.log(invalidLayer)
      if (invalidLayer) return await interaction.reply({ content: JSON.stringify(invalidLayer).slice(0, 2000) })
    }
    await interaction.reply({ content: 'test!' })
  }
})
