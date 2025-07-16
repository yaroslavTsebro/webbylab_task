import { ValidationError } from 'class-validator'

export const getErrorMessage = (error: unknown): string => {
  if (Array.isArray(error) && error.every(e => e instanceof ValidationError)) {
    return error
      .map(err => formatValidationError(err))
      .filter(Boolean)
      .join('; ')
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown error occurred'
}

const formatValidationError = (error: ValidationError): string => {
  const messages = error.constraints
    ? Object.values(error.constraints)
    : []

  const childMessages = error.children?.map(formatValidationError) || []

  return [...messages, ...childMessages].join(', ')
}
