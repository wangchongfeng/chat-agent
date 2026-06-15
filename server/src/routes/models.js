// server/src/routes/models.js
import { Hono } from 'hono'
import { MODELS } from '../llm/index.js'

const models = new Hono()

models.get('/', (c) => {
  const list = Object.entries(MODELS).map(([id, config]) => ({
    id,
    name: config.name,
    provider: config.provider
  }))
  return c.json(list)
})

export default models
