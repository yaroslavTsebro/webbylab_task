import { Request, Response, NextFunction } from 'express'
import { makeJwtService } from '@/system/jwt/factory'
import { UserService } from '../user/user.service'

export class AuthMiddleware {
  static requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization']
      if (!authHeader) throw new Error('No Authorization header')

      const token = authHeader.split(' ')[1]
      if (!token) throw new Error('No token provided')

      const jwtService = makeJwtService();
      const payload = jwtService.verifyAccess(token);

      const user = UserService.init().getById(payload.id);

      (req as any).user = user

      next()
    } catch (e: any) {
      res.status(401).json({ error: e.message })
    }
  }
} 