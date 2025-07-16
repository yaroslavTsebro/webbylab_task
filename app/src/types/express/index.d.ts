import 'express'
import { IJwtPayload } from '../../shared/contracts/system/jwt'
import { User } from '../../shared/contracts/entities/user'

declare module 'express-serve-static-core' {
  interface Request {
    user: User
  }
} 