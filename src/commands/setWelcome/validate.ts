import type z from 'zod'
import { type ZodObject, any, array, number, object, record, string } from 'zod'
import validate from '../../shared/validate'
const LIMIT_NUMBER = 1024
const COLOR = string()
  .regex(/^(#[a-fA-F0-9]{6}|transparent)$/, 'required hex valid with six numbers')
  .optional()
  .nullish()

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
    limitLetters: number().int().min(0).max(LIMIT_NUMBER).default(0),
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
  .omit({ color: true })
  .extend({
    img: string().url()
  })
  .strict()

const iconSchema = baseSchema
  .extend({
    shape: string().regex(/^(circle|square(5|10|15|20){0,1})$/)
  })
  .strict()

const canvasSchema = object({
  background: COLOR,
  height: number(),
  width: number(),
  colorDominate: COLOR,
  layers: array(record(string(), any())).min(0).max(15)
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

const types: Record<string, ZodObject<any>> = {
  name: nameZod,
  text: textZod,
  icon: iconZod,
  image: imageZod
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateCanvas(data: any) {
  const invalidObj = validate(data ?? {}, canvasZod) ?? false
  if (invalidObj) return invalidObj
  for (const layer of data.layers) {
    const typeZod = types[layer.type] ?? null
    const invalidLayer = validate(layer, typeZod)
    if (invalidLayer) return invalidLayer
  }
}
