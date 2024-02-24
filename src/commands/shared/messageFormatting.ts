const rules = {
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
export default function messageFormatting(str: string, formats: Partial<typeof rules & typeof rulesInternal>): string {
  const formatsKeys = Object.keys(formats) as Array<keyof typeof rules & keyof typeof rulesInternal>
  for (const fk of formatsKeys) {
    str = str.replaceAll(rules[fk], formats[fk] ?? '')
  }
  const rulesReqKeys = Object.keys(rulesRequired) as Array<keyof typeof rulesRequired>
  for (const rrk of rulesReqKeys) {
    str = str.replaceAll(rrk, rulesRequired[rrk])
  }
  return str
}
