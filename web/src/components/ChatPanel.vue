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
        <div class="welcome-icon">🤖</div>
        <h3>Welcome to Chat Agent</h3>
        <p>Start a conversation by typing a message below</p>
        <div class="tips">
          <span>💡 Type <code>@</code> to select a skill</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  messages: { type: Array, default: () => [] },
  isStreaming: { type: Boolean, default: false }
})

const panelRef = ref(null)

function scrollToBottom() {
  if (panelRef.value) {
    panelRef.value.scrollTop = panelRef.value.scrollHeight
  }
}

watch(() => props.messages.length, () => {
  nextTick(scrollToBottom)
})

watch(() => props.messages[props.messages.length - 1]?.content, () => {
  nextTick(scrollToBottom)
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
  text-align: center;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  margin-bottom: 20px;
}

.tips {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-bg-secondary);
  border-radius: 20px;
  font-size: 13px;
}

.tips code {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
</style>
