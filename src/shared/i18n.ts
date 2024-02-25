import path from 'node:path'
import { readFileSync } from 'node:fs'
import { type Root } from '../types/Lang'
const pathFolder = path.join(__dirname, '../../i18n')
const EN = JSON.parse(readFileSync(path.join(pathFolder, 'en.json'), 'utf-8'))
const ES = JSON.parse(readFileSync(path.join(pathFolder, 'es.json'), 'utf-8'))
const languages = {
  en: EN,
  es: { ...EN, ...ES }
}

export default function i18n(lang: string): Root {
  lang = lang.slice(0, 2)
  console.log(lang)
  return languages[lang as keyof typeof languages] ?? EN
}
