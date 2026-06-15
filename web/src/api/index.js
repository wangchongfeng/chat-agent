// web/src/api/index.js
const BASE_URL = '/api'

let sessionId = localStorage.getItem('chat-session-id')
if (!sessionId) {
  sessionId = crypto.randomUUID().replace(/-/g, '')
  localStorage.setItem('chat-session-id', sessionId)
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId,
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export const api = {
  getConversations: () => request('/conversations'),
  createConversation: (data) => request('/conversations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getConversation: (id) => request(`/conversations/${id}`),
  updateConversation: (id, data) => request(`/conversations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteConversation: (id) => request(`/conversations/${id}`, {
    method: 'DELETE'
  }),
  streamChat: (conversationId, data) => {
    return fetch(`${BASE_URL}/conversations/${conversationId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId
      },
      body: JSON.stringify(data)
    })
  },
  getSkills: () => request('/skills'),
  getModels: () => request('/models')
}

export { sessionId }