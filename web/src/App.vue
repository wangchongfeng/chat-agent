<!-- web/src/App.vue -->
<template>
  <div class="app-container">
    <Sidebar
      :conversations="conversations"
      :current-id="currentConversationId"
      @select="selectConversation"
      @new="createNewConversation"
      @delete="deleteConversation"
    />
    <main class="main-content">
      <div class="chat-header" v-if="!currentConversationId">
        <ModelPicker
          :model-id="currentModel"
          @change="handleModelChange"
        />
      </div>
      <ChatPanel
        :messages="messages"
        :is-streaming="isStreaming"
      />
      <ChatInput
        :is-streaming="isStreaming"
        @send="handleSend"
        @stop="handleStop"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from './api/index.js'
import { useChat } from './composables/useChat.js'
import Sidebar from './components/Sidebar.vue'
import ChatPanel from './components/ChatPanel.vue'
import ChatInput from './components/ChatInput.vue'
import ModelPicker from './components/ModelPicker.vue'

const conversations = ref([])
const currentConversationId = ref(null)
const currentModel = ref('qwen2.5:7b')
const messages = ref([])

const { isStreaming, sendMessage, stopGeneration } = useChat(messages)

onMounted(async () => {
  conversations.value = await api.getConversations()
  if (conversations.value.length > 0) {
    selectConversation(conversations.value[0].id)
  }
})

async function createNewConversation() {
  const conv = await api.createConversation({
    model_id: currentModel.value
  })
  conversations.value.unshift(conv)
  currentConversationId.value = conv.id
  messages.value = []
}

async function selectConversation(id) {
  currentConversationId.value = id
  const conv = await api.getConversation(id)
  messages.value = conv.messages || []
}

async function deleteConversation(id) {
  await api.deleteConversation(id)
  conversations.value = conversations.value.filter(c => c.id !== id)
  if (currentConversationId.value === id) {
    currentConversationId.value = null
    messages.value = []
  }
}

async function handleSend({ content, skillId }) {
  if (!currentConversationId.value) {
    await createNewConversation()
  }
  await sendMessage(content, currentConversationId.value, currentModel.value, skillId)
}

function handleStop() {
  stopGeneration()
}

async function handleModelChange(modelId) {
  currentModel.value = modelId
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}
</style>
