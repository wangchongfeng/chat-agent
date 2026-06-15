// web/src/composables/useChat.js
import { ref, nextTick } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export function useChat(messages) {
  const isStreaming = ref(false)
  let abortController = null

  async function sendMessage(content, conversationId, modelId, skillId) {
    messages.value.push({ role: 'user', content })

    const assistantIndex = messages.value.length
    messages.value.push({ role: 'assistant', content: '' })

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
        openWhenHidden: false,
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
              const msg = messages.value[assistantIndex]
              messages.value[assistantIndex] = { ...msg, content: msg.content + `\n\nError: ${data.error}` }
              isStreaming.value = false
              return
            }
            if (data.content) {
              const msg = messages.value[assistantIndex]
              messages.value[assistantIndex] = { ...msg, content: msg.content + data.content }
            }
          } catch (e) {}
        },
        onerror(err) {
          console.error('EventSource error:', err)
          isStreaming.value = false
          throw err
        },
        onclose() {
          isStreaming.value = false
        }
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        const msg = messages.value[assistantIndex]
        messages.value[assistantIndex] = { ...msg, content: msg.content + `\n\nError: ${err.message}` }
      }
      isStreaming.value = false
    }
  }

  function stopGeneration() {
    abortController?.abort()
    isStreaming.value = false
  }

  return { isStreaming, sendMessage, stopGeneration }
}
