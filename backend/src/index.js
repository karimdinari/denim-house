import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoutes         from './routes/auth.routes.js'
import userRoutes         from './routes/user.routes.js'
import taskRoutes         from './routes/task.routes.js'
import scoringRoutes      from './routes/scoring.routes.js'
import planningRoutes     from './routes/planning.routes.js'
import absenceRoutes      from './routes/absence.routes.js'
import alertRoutes        from './routes/alert.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import forumRoutes        from './routes/forum.routes.js'
import moodboardRoutes    from './routes/moodboard.routes.js'
import prototypeRoutes    from './routes/prototype.routes.js'

const app    = express()
const server = createServer(app)

// ── Socket.io ────────────────────────────
export const io = new Server(server, {
  cors: { origin: '*' }
})

io.on('connection', socket => {
  console.log(`[ws] client connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`[ws] client disconnected: ${socket.id}`)
  })
})

// ── Middleware ───────────────────────────
app.use(cors())
app.use(express.json())

// ── Routes ───────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/tasks',         taskRoutes)
app.use('/api/scoring',       scoringRoutes)
app.use('/api/planning',      planningRoutes)
app.use('/api/absences',      absenceRoutes)
app.use('/api/alerts',        alertRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/forum',         forumRoutes)
app.use('/api/moodboards',    moodboardRoutes)
app.use('/api/prototypes',    prototypeRoutes)

// ── Health check ─────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Global error handler ─────────────────
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ────────────────────────────────
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})