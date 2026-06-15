// server/src/llm/anthropic.js
export class AnthropicProvider {
  constructor(config) {
    this.apiKey = config.apiKey
    this.model = config.model
  }

  async *streamChat(messages, options = {}) {
    const systemMsg = messages.find(m => m.role === 'system')
    const chatMessages = messages.filter(m => m.role !== 'system')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.max_tokens || 4096,
        system: systemMsg?.content || '',
        messages: chatMessages,
        stream: true
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Anthropic API error: ${response.status} ${error}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue

        try {
          const parsed = JSON.parse(trimmed.slice(6))
          if (parsed.type === 'content_block_delta') {
            yield parsed.delta.text
          }
        } catch (e) {
          // Skip malformed chunks
        }
      }
    }
  }
}
