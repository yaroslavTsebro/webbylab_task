import app from './server'
import { sequelize } from '@/system/db/db'

const PORT = process.env.APP_PORT || 8050

async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (e) {
    console.error('Failed to start app:', e)
    process.exit(1)
  }
}

start()
