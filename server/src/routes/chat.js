// server/src/routes/chat.js
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { query } from '../db/index.js'
import { getProvider, MODELS } from '../llm/index.js'
import { getSkill } from '../skills/index.js'

const chat = new Hono()

chat.post('/:id/chat', async (c) => {
  const sessionId = c.get('sessionId')
  const { id } = c.req.param()
  const { message, model_id, skill_id } = await c.req.json()

  const convResult = await query(
    'SELECT * FROM conversations WHERE id = $1 AND session_id = $2',
    [id, sessionId]
  )
  if (convResult.rows.length === 0) {
    return c.json({ error: 'Conversation not found' }, 404)
  }

  const conversation = convResult.rows[0]
  const useModel = model_id || conversation.model_id

  const historyResult = await query(
    'SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at',
    [id]
  )

  const messages = []

  const skill = getSkill(skill_id || conversation.skill_id)
  if (skill) {
    messages.push({ role: 'system', content: skill.prompt })
  }

  for (const msg of historyResult.rows) {
    messages.push({ role: msg.role, content: msg.content })
  }

  messages.push({ role: 'user', content: message })

  let provider
  try {
    provider = getProvider(useModel)
  } catch (e) {
    return c.json({ error: e.message }, 400)
  }

  await query(
    'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
    [id, 'user', message]
  )

  if (historyResult.rows.length === 0) {
    const title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
    await query(
      'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2',
      [title, id]
    )
  }

  return streamSSE(c, async (stream) => {
    let fullResponse = ''

    try {
      for await (const chunk of provider.streamChat(messages)) {
        fullResponse += chunk
        await stream.writeSSE({
          data: JSON.stringify({ content: chunk })
        })
      }

      await query(
        'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
        [id, 'assistant', fullResponse]
      )

      await query(
        'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
        [id]
      )

      await stream.writeSSE({ data: '[DONE]' })
    } catch (error) {
      await stream.writeSSE({
        data: JSON.stringify({ error: error.message })
      })
    }
  })
})

export default chat
