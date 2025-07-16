import { StageEnviroments } from '@/config/config'

type Operation = (stageName: StageEnviroments) => boolean

export const Equals: Operation = (stageName: StageEnviroments) =>
  process.env.STAGE_NAME === stageName

export const NotEquals: Operation = (stageName: StageEnviroments) =>
  process.env.STAGE_NAME !== stageName

export const checkEnvironment = (operation: Operation, providedEnv: StageEnviroments) => () =>
  operation(providedEnv)
