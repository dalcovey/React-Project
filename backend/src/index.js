import dotenv from 'dotenv'
dotenv.config()
import { initDatabase } from './db/init.js'
import { app } from './app.js'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

let io
try {
  await initDatabase()
  const PORT = process.env.PORT
  const server = createServer(app)
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })
  app.set('io', io)
  server.listen(PORT)
  console.info(`express server running on http://localhost:${PORT}`)
} catch (err) {
  console.error('error connecting to database:', err)
}
