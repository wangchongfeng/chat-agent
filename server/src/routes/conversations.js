// server/src/routes/conversations.js
import { Hono } from 'hono'
import { query } from '../db/index.js'

const conversations = new Hono()

conversations.get('/', async (c) => {
  const sessionId = c.get('sessionId')
  const result = await query(
    'SELECT id, title, model_id, skill_id, created_at, updated_at FROM conversations WHERE session_id = $1 ORDER BY updated_at DESC',
    [sessionId]
  )
  return c.json(result.rows)
})

conversations.post('/', async (c) => {
  const sessionId = c.get('sessionId')
  const { title, model_id, skill_id } = await c.req.json()
  const result = await query(
    'INSERT INTO conversations (session_id, title, model_id, skill_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [sessionId, title || 'New Chat', model_id || 'openai-gpt35', skill_id]
  )
  return c.json(result.rows[0], 201)
})

conversations.get('/:id', async (c) => {
  const sessionId = c.get('sessionId')
  const { id } = c.req.param()

  const convResult = await query(
    'SELECT * FROM conversations WHERE id = $1 AND session_id = $2',
    [id, sessionId]
  )
  if (convResult.rows.length === 0) return c.json({ error: 'Not found' }, 404)

  const messagesResult = await query(
    'SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at',
    [id]
  )

  return c.json({
    ...convResult.rows[0],
    messages: messagesResult.rows
  })
})

conversations.put('/:id', async (c) => {
  const sessionId = c.get('sessionId')
  const { id } = c.req.param()
  const updates = await c.req.json()

  const fields = []
  const values = []
  let paramIndex = 1

  for (const [key, value] of Object.entries(updates)) {
    if (['title', 'model_id', 'skill_id'].includes(key)) {
      fields.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  }

  if (fields.length === 0) return c.json({ error: 'No valid fields' }, 400)

  fields.push('updated_at = NOW()')
  values.push(id, sessionId)

  const result = await query(
    `UPDATE conversations SET ${fields.join(', ')} WHERE id = $${paramIndex} AND session_id = $${paramIndex + 1} RETURNING *`,
    values
  )

  if (result.rows.length === 0) return c.json({ error: 'Not found' }, 404)
  return c.json(result.rows[0])
})

conversations.delete('/:id', async (c) => {
  const sessionId = c.get('sessionId')
  const { id } = c.req.param()

  const result = await query(
    'DELETE FROM conversations WHERE id = $1 AND session_id = $2 RETURNING id',
    [id, sessionId]
  )

  if (result.rows.length === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export default conversations
