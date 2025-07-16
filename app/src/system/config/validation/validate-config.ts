import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { ValidationError } from 'class-validator'
import { AppConfig } from '../config'
import { AppConfigValidationSchema } from './schemas/config-schema'

export const parseError = (validationError: ValidationError) => {
  const propKey = validationError.property
  const res = {
    [propKey]: {
      message: [],
    },
  }

  if (!validationError.constraints && validationError.children?.length) {
    const childErrors = validationError.children.reduce(
      (acc, child) => ({ ...acc, ...parseError(child) }),
      {} as any
    )

    res[propKey] = { ...childErrors }
  } else {
    res[propKey].message = Object.values(validationError.constraints as any)
  }

  return res
}

export const validateConfig = (config: AppConfig) => {
  const configInstance = plainToInstance(AppConfigValidationSchema, config)
  const validationResult = validateSync(configInstance)

  if (!validationResult.length) {
    return true
  }

  const parsedError = validationResult.reduce(
    (acc, errorItem) => ({ ...acc, ...parseError(errorItem) }),
    {} as Record<string, any>
  )

  throw new Error(JSON.stringify(parsedError, null, 3))
}
