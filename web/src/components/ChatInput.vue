<!-- web/src/components/ChatInput.vue -->
<template>
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <el-input
        v-model="input"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 5 }"
        placeholder="Type your message... (Shift+Enter for new line)"
        @keydown.enter.exact.prevent="handleSend"
        :disabled="isStreaming"
      />
      <el-button
        v-if="isStreaming"
        type="danger"
        circle
        @click="$emit('stop')"
        class="stop-btn"
      >
        ⏹
      </el-button>
      <el-button
        v-else
        type="primary"
        circle
        @click="handleSend"
        :disabled="!input.trim()"
        class="send-btn"
      >
        ➤
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isStreaming: { type: Boolean, default: false }
})

const emit = defineEmits(['send', 'stop'])
const input = ref('')

function handleSend() {
  if (!input.value.trim() || props.isStreaming) return
  emit('send', input.value.trim())
  input.value = ''
}
</script>

<style scoped>
.chat-input-container {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
}

.chat-input-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.chat-input-wrapper :deep(.el-textarea__inner) {
  resize: none;
  border-radius: 12px;
  padding: 12px 16px;
}

.send-btn, .stop-btn {
  flex-shrink: 0;
}
</style>
