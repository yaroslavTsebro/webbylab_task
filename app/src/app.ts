import 'reflect-metadata'
import { sequelize } from './system/db/db'
import app from './server'

const PORT = 80

async function start() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (e) {
    console.error('Failed to start app:', e)
    process.exit(1)
  }
}

start()
