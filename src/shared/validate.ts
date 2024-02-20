import { ZodError, type ZodIssue, type ZodObject } from 'zod'
interface DataError {
  issues: ZodIssue[]
  type: string
}
/**
 * @returns returns a ZodIssue array object if find an problem
 */
export default function validate(obj: any, zodObj: ZodObject<any>): DataError | undefined {
  try {
    zodObj.parse(obj)
  } catch (error) {
    if (error instanceof ZodError) {
      return { type: obj.type, issues: error.issues }
    }
  }
}

export function formatZodError(data: DataError): string {
  let str = ''
  const { type, issues } = data
  for (const e of issues) {
    const path = e.path.length === 0 ? '?' : e.path.join('.')
    str += `* ${type} in ${path} -> ${e.message}`
  }
  return str
}
