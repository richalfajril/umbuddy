import { validate } from 'class-validator'

export interface ValidationFailure {
  field: string
  message: string
}

type DtoConstructor<T extends object> = new () => T

export async function validateDto<T extends object>(
  DtoClass: DtoConstructor<T>,
  payload: unknown
): Promise<{ data: T; errors: [] } | { data: null; errors: ValidationFailure[] }> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      data: null,
      errors: [{ field: 'body', message: 'Request body harus berupa objek JSON' }],
    }
  }

  const dto = Object.assign(new DtoClass(), payload)
  const validationErrors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
  })

  if (validationErrors.length === 0) {
    return { data: dto, errors: [] }
  }

  return {
    data: null,
    errors: validationErrors.flatMap((error) => {
      const constraints = Object.values(error.constraints ?? {})
      if (constraints.length === 0) {
        return [{ field: error.property, message: 'Field tidak valid' }]
      }

      return constraints.map((message) => ({
        field: error.property,
        message,
      }))
    }),
  }
}
