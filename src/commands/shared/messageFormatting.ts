const rules = {
  color: '<color>',
  userName: '<user_name>',
  userGlobal: '<user_global>',
  userCount: '<user_count>',
  userId: '<user_id>'
}
export default function messageFormatting(str: string, formats: Partial<typeof rules>): string {
  const formatsKeys = Object.keys(formats)
  for (const fk of formatsKeys) {
    str = str.replaceAll(rules[fk as keyof typeof rules], formats[fk as keyof Partial<typeof rules>] ?? '')
  }
  return str
}
