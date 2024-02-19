interface Props {
  color: string
}
export default function messageFormatting(str: string, formats: Partial<Props>): string {
  const formatsKeys = Object.keys(formats)
  const rules: Props = {
    color: '<color>'
  }
  for (const fk of formatsKeys) {
    str = str.replaceAll(rules[fk as keyof Props], formats[fk as keyof Partial<Props>] ?? '')
  }
  return str
}
