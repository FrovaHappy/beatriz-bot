import { Colors, EmbedBuilder } from 'discord.js'
import type { EditReplyConstructor } from '../../../types/UtilityTypes'

const requiredPermissions: EditReplyConstructor = {
  content: 'El bot requiere del permiso `Role Manager`, para efectuar esta operación'
}

const serverIdNotFound: EditReplyConstructor = { content: 'server id not Found!' }

const errorInRole: EditReplyConstructor = { content: 'Hubo un problema mientras se creaba el rol!' }

const runSetting: EditReplyConstructor = {
  embeds: [
    new EmbedBuilder()
      .setColor(Colors.Aqua)
      .setTitle('Antes de empezar...')
      .setDescription(
        `
          Debes mover el rol creado manualmente hasta por debajo del rol del bot o donde creas oportuno.
          **NO** sobrepases el del bot.
          Con esto Claro, ¿deseas crear los colores por defecto?
        `
      )
      .setImage('https://media.discordapp.net/attachments/951875024363585558/1159923642822561912/Frame_1.png')
  ]
}
export default {
  requiredPermissions,
  serverIdNotFound,
  errorInRole,
  runSetting
}
