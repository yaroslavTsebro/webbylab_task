import { Request, Response } from 'express'
import { RegisterDto, LoginDto, RefreshDto } from '@/shared/contracts/system/jwt'
import { AuthService } from './auth.service'

export class AuthController {
  private readonly authService = AuthService.init()

  public register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body as RegisterDto)

      res.status(201).json({ user })
    } catch (e: any) {
      res.status(400).json({ error: e.message })
    }
  }

  public login = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.login(req.body as LoginDto)

      res.json(result)
    } catch (e: any) {
      res.status(401).json({ error: e.message })
    }
  }

  public refresh = async (req: Request, res: Response) => {
    try {
      const tokens = await this.authService.refresh(req.body as RefreshDto)
      
      res.json(tokens)
    } catch (e: any) {
      res.status(401).json({ error: e.message })
    }
  }
}