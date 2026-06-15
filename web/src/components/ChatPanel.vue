<!-- web/src/components/ChatPanel.vue -->
<template>
  <div class="chat-panel" ref="panelRef">
    <div class="messages-container">
      <MessageBubble
        v-for="(msg, index) in messages"
        :key="index"
        :role="msg.role"
        :content="msg.content"
      />
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <p>Start a conversation</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  isStreaming: { type: Boolean, default: false }
})

const panelRef = ref(null)
const streamingContent = ref('')

function scrollToBottom() {
  if (panelRef.value) {
    panelRef.value.scrollTop = panelRef.value.scrollHeight
  }
}

function handleStreamEvent(e) {
  streamingContent.value += e.detail.content
  scrollToBottom()
}

onMounted(() => {
  window.addEventListener('chat-stream', handleStreamEvent)
})

onUnmounted(() => {
  window.removeEventListener('chat-stream', handleStreamEvent)
})

watch(() => props.messages.length, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-panel {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg);
}

.messages-container {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>
