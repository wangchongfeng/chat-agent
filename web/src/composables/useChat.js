// web/src/composables/useChat.js
import { ref } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { api } from '../api/index.js'

export function useChat() {
  const isStreaming = ref(false)
  let abortController = null

  async function sendMessage(content, conversationId, modelId, skillId) {
    isStreaming.value = true
    abortController = new AbortController()

    try {
      await fetchEventSource(`/api/conversations/${conversationId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': localStorage.getItem('chat-session-id')
        },
        body: JSON.stringify({
          message: content,
          model_id: modelId,
          skill_id: skillId
        }),
        signal: abortController.signal,
        onopen(response) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
        },
        onmessage(ev) {
          if (ev.data === '[DONE]') {
            isStreaming.value = false
            return
          }
          try {
            const data = JSON.parse(ev.data)
            if (data.error) {
              console.error('Stream error:', data.error)
              return
            }
            window.dispatchEvent(new CustomEvent('chat-stream', {
              detail: { content: data.content }
            }))
          } catch (e) {
            // Skip malformed messages
          }
        },
        onerror(err) {
          console.error('EventSource error:', err)
          isStreaming.value = false
        },
        onclose() {
          isStreaming.value = false
        }
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Send error:', err)
      }
      isStreaming.value = false
    }
  }

  function stopGeneration() {
    abortController?.abort()
    isStreaming.value = false
  }

  return {
    isStreaming,
    sendMessage,
    stopGeneration
  }
}
