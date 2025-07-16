import 'express'
import { IJwtPayload } from 'shared/contracts/system/jwt'

declare module 'express-serve-static-core' {
  interface Request {
    user?: IJwtPayload
  }
} 