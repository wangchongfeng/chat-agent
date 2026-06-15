// server/src/index.js
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import dotenv from 'dotenv'

import conversations from './routes/conversations.js'
import chat from './routes/chat.js'
import skills from './routes/skills.js'
import models from './routes/models.js'

dotenv.config()

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'X-Session-Id']
}))

app.use('*', async (c, next) => {
  let sessionId = c.req.header('X-Session-Id')
  if (!sessionId) {
    sessionId = crypto.randomUUID().replace(/-/g, '')
  }
  c.set('sessionId', sessionId)
  await next()
})

app.route('/api/conversations', conversations)
app.route('/api/conversations', chat)
app.route('/api/skills', skills)
app.route('/api/models', models)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = process.env.PORT || 3000
console.log(`Server running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
