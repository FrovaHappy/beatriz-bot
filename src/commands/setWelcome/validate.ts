import type z from 'zod'
import { any, array, number, object, record, string } from 'zod'
const LIMIT_NUMBER = 1024
const COLOR = string()
  .regex(/^#([a-f0-9]{6})$/, 'required hex valid with six numbers')
  .nullable()

const baseSchema = object({
  type: string().regex(/^(image|icon|name|text)$/),
  color: COLOR,
  height: number().positive().max(LIMIT_NUMBER),
  width: number().positive().max(LIMIT_NUMBER),
  x: number().positive().max(LIMIT_NUMBER),
  y: number().positive().max(LIMIT_NUMBER)
}).strict()

const textSchema = baseSchema
  .omit({ height: true, width: true })
  .extend({
    size: number().positive().max(LIMIT_NUMBER),
    family: string(),
    weight: number().positive().max(1000).default(400),
    limitLetters: number().positive().max(LIMIT_NUMBER).default(0),
    content: string(),
    align: string()
      .regex(/^(start|end|left|right|center)$/)
      .default('start'),
    baseline: string()
      .regex(/^(top|hanging|middle|alphabetic|ideographic|bottom)$/)
      .default('alphabetic')
  })
  .strict()
const nameSchema = textSchema.omit({ content: true }).extend({
  nameType: string().regex(/^(globalName|id|username)$/)
})

const imageSchema = baseSchema
  .extend({
    img: string().url()
  })
  .strict()

const iconSchema = imageSchema
  .omit({ img: true })
  .extend({
    shape: string().regex(/^(circle|square(5|10|15){0,1})$/)
  })
  .strict()

const canvasSchema = object({
  background: COLOR,
  height: number(),
  width: number(),
  colorDominate: COLOR,
  layers: array(record(string(), any()))
})

export const imageZod = imageSchema
export const iconZod = iconSchema
export const textZod = textSchema
export const nameZod = nameSchema
export const canvasZod = canvasSchema

export type Image = z.infer<typeof imageZod>
export type Name = z.infer<typeof nameZod>
export type Icon = z.infer<typeof iconZod>
export type Text = z.infer<typeof textZod>
export type Canvas = z.infer<typeof canvasZod>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function obtainType(type: 'name' | 'icon' | 'text' | 'image') {
  const types = {
    name: nameZod,
    text: textZod,
    icon: iconZod,
    image: imageZod
  }
  return types[type] ?? null
}
