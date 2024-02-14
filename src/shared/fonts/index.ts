import path from 'node:path'
import { readdirSync } from 'node:fs'
interface Font {
  nameAlias: string
  patch: string
}
function getFonts(): Font[] {
  const fonts: Font[] = []
  const fontsFiles = readdirSync(__dirname).filter(
    file => file.endsWith('.ttf') || file.endsWith('.woff') || file.endsWith('.woff2')
  )
  for (const fontFile of fontsFiles) {
    const nameAlias = fontFile.split('.')[0].replace('-', ' ')
    fonts.push({ nameAlias, patch: path.join(__dirname, fontFile) })
  }
  return fonts
}

export default getFonts()
