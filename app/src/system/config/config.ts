import 'dotenv/config'

import { validateConfig } from './validation/validate-config'

export type AppConfig = {
  dbUri: string

  jwt: {
    public_key: string
    private_key: string
    secret: string
    rtSecret: string
    expireTime: number
    refreshTokenExpireTime: number
  }

}

const envConfig: AppConfig = {
  dbUri: process.env.DB_URI || '',

  jwt: {
    public_key: process.env.JWT_PUBLIC_KEY || '',
    private_key: process.env.JWT_PRIVATE_KEY || '',
    secret: process.env.JWT_SECRET || '',
    rtSecret: process.env.JWT_RT_SECRET || '',
    expireTime: Number(process.env.JWT_EXPIRE_TIME) || 30 * 60,
    refreshTokenExpireTime:
      Number(process.env.JWT_REFRESH_EXPIRE_TIME) || 14 * 24 * 60 * 60,
  },
}

validateConfig(envConfig)

export { envConfig }
