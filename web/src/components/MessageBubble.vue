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
import DOMPurify from 'dompurify'

const props = defineProps({
  role: { type: String, required: true },
  content: { type: String, default: '' }
})

marked.setOptions({
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  if (!props.content) return ''
  const rawHtml = marked.parse(props.content)
  return DOMPurify.sanitize(rawHtml)
})
</script>

<style scoped>
.message-bubble {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 16px;
}

.message-user {
  background: var(--color-user-bubble);
  flex-direction: row-reverse;
}

.message-assistant {
  background: var(--color-agent-bubble);
}

.bubble-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bubble-content {
  line-height: 1.7;
  max-width: 85%;
  word-break: break-word;
}

.bubble-content :deep(pre) {
  background: #1E293B;
  color: #E2E8F0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  font-size: 13px;
  line-height: 1.5;
}

.bubble-content :deep(code) {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
}

.bubble-content :deep(p code) {
  background: rgba(13, 148, 136, 0.1);
  color: var(--color-primary);
  padding: 2px 6px;
  border-radius: 4px;
}

.bubble-content :deep(p) {
  margin: 8px 0;
}

.bubble-content :deep(ul),
.bubble-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.bubble-content :deep(li) {
  margin: 4px 0;
}

.bubble-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 12px;
  margin: 8px 0;
  color: var(--color-text-secondary);
}

.bubble-content :deep(table) {
  border-collapse: collapse;
  margin: 12px 0;
  width: 100%;
}

.bubble-content :deep(th),
.bubble-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}

.bubble-content :deep(th) {
  background: var(--color-bg-secondary);
  font-weight: 600;
}
</style>
