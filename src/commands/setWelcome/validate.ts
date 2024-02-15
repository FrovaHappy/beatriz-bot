import type z from 'zod'
import { any, array, number, object, record, string } from 'zod'
const COLOR = string()
  .regex(/^#([a-f0-9]{6})$/, 'required hex valid with six numbers')
  .nullable()

const baseSchema = object({
  type: string().regex(/^(image|icon|name|text)$/),
  color: COLOR,
  height: number(),
  width: number(),
  x: number(),
  y: number()
}).strict()

const imageSchema = baseSchema
  .extend({
    background: COLOR,
    img: string().url(),
    sheight: number(),
    swidth: number(),
    sx: number(),
    sy: number()
  })
  .strict()

const textSchema = baseSchema
  .omit({ height: true, width: true })
  .extend({
    size: number(),
    family: string(),
    weight: number(),
    content: string()
  })
  .strict()

const iconSchema = imageSchema
  .omit({ background: true, img: true })
  .extend({
    shared: string()
  })
  .strict()
const nameSchema = textSchema.omit({ content: true }).extend({
  nameType: string().regex(/^(globalName|id|username)$/)
})
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
