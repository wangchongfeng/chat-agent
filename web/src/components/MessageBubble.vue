<!-- web/src/components/MessageBubble.vue -->
<template>
  <div class="message-bubble" :class="[`message-${role}`]">
    <div class="bubble-avatar">
      {{ role === 'user' ? '👤' : '🤖' }}
    </div>
    <div class="bubble-content" v-html="renderedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  role: { type: String, required: true },
  content: { type: String, default: '' }
})

const renderedContent = computed(() => {
  if (!props.content) return ''
  return marked.parse(props.content)
})
</script>

<style scoped>
.message-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
}

.message-user {
  background: var(--color-user-bubble);
  flex-direction: row-reverse;
}

.message-assistant {
  background: var(--color-agent-bubble);
}

.message-system {
  background: var(--color-bg-secondary);
  justify-content: center;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.bubble-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.bubble-content {
  line-height: 1.6;
  max-width: 80%;
}

.bubble-content :deep(pre) {
  background: #1E293B;
  color: #E2E8F0;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.bubble-content :deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.bubble-content :deep(p) {
  margin: 8px 0;
}

.bubble-content :deep(ul), .bubble-content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}
</style>
