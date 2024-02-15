import { ZodError, type ZodIssue, type ZodObject } from 'zod'
/**
 * @returns returns a ZodIssue array object if find an problem
 */
export default function validate(obj: any, zodObj: ZodObject<any>): ZodIssue[] | undefined {
  try {
    zodObj.parse(obj)
  } catch (error) {
    if (error instanceof ZodError) {
      return error.issues
    }
  }
}
