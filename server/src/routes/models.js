// server/src/routes/models.js
import { Hono } from 'hono'
import { MODELS } from '../llm/index.js'

const models = new Hono()

models.get('/', (c) => {
  const list = MODELS.map(({ id, name, provider, baseUrl }) => ({
    id,
    name,
    provider,
    baseUrl
  }))
  return c.json(list)
})

export default models
