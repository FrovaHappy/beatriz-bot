import { type GuildMember } from 'discord.js'

const userRules = {
  userName: '<user_name>',
  userGlobal: '<user_global>',
  userCount: '<user_count>',
  userId: '<user_id>'
}
const rulesInternal = {
  color: '<color>'
}
const rulesRequired = {
  '\\n': '\n',
  '\\t': '\t',
  '\\r': '\r'
}

export function userSecuencies(str: string, m: GuildMember): string {
  str = messageFormatting(str, {
    userCount: m.guild.memberCount.toString(),
    userGlobal: m.user.globalName ?? m.user.username,
    userId: m.user.id,
    userName: m.user.username
  })
  return str
}

export default function messageFormatting(
  str: string,
  formats: Partial<typeof userRules & typeof rulesInternal>
): string {
  const formatsKeys = Object.keys(formats) as Array<keyof typeof userRules & keyof typeof rulesInternal>
  for (const fk of formatsKeys) {
    str = str.replaceAll(userRules[fk], formats[fk] ?? '')
  }
  const rulesReqKeys = Object.keys(rulesRequired) as Array<keyof typeof rulesRequired>
  for (const rrk of rulesReqKeys) {
    str = str.replaceAll(rrk, rulesRequired[rrk])
  }
  return str
}
