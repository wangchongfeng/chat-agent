<!-- web/src/components/ChatInput.vue -->
<template>
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <div class="input-area">
        <div v-if="showSkillMenu" class="skill-menu">
          <div
            v-for="skill in skills"
            :key="skill.id"
            class="skill-item"
            @click="selectSkill(skill)"
          >
            <span class="skill-icon">{{ skill.icon }}</span>
            <span class="skill-name">{{ skill.name }}</span>
          </div>
        </div>
        <div v-if="selectedSkill" class="selected-skill">
          <span>{{ selectedSkill.icon }} {{ selectedSkill.name }}</span>
          <span class="remove-skill" @click="removeSkill">×</span>
        </div>
        <textarea
          ref="textareaRef"
          v-model="input"
          :placeholder="isStreaming ? 'Generating...' : 'Type message... (@ for skills)'"
          :disabled="isStreaming"
          @keydown.enter.exact.prevent="handleSend"
          @input="handleInput"
          @keydown.up.prevent="navigateSkill(-1)"
          @keydown.down.prevent="navigateSkill(1)"
          @keydown.enter.exact="selectHighlightedSkill"
          rows="1"
        ></textarea>
      </div>
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
import { ref, onMounted, nextTick } from 'vue'
import { api } from '../api/index.js'

const props = defineProps({
  isStreaming: { type: Boolean, default: false }
})

const emit = defineEmits(['send', 'stop'])

const input = ref('')
const textareaRef = ref(null)
const skills = ref([])
const selectedSkill = ref(null)
const showSkillMenu = ref(false)
const highlightedIndex = ref(-1)

onMounted(async () => {
  skills.value = await api.getSkills()
})

function handleInput() {
  const lastChar = input.value.slice(-1)
  if (lastChar === '@') {
    showSkillMenu.value = true
    highlightedIndex.value = 0
  } else if (!input.value.includes('@')) {
    showSkillMenu.value = false
  }
}

function selectSkill(skill) {
  selectedSkill.value = skill
  showSkillMenu.value = false
  input.value = input.value.replace(/@$/, '')
}

function removeSkill() {
  selectedSkill.value = null
}

function navigateSkill(dir) {
  if (!showSkillMenu.value) return
  highlightedIndex.value = Math.max(0, Math.min(skills.value.length - 1, highlightedIndex.value + dir))
}

function selectHighlightedSkill(e) {
  if (showSkillMenu.value && highlightedIndex.value >= 0) {
    e.preventDefault()
    selectSkill(skills.value[highlightedIndex.value])
  }
}

function handleSend() {
  if (!input.value.trim() || props.isStreaming) return
  emit('send', {
    content: input.value.trim(),
    skillId: selectedSkill.value?.id || null
  })
  input.value = ''
  selectedSkill.value = null
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
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

.input-area {
  flex: 1;
  position: relative;
}

textarea {
  width: 100%;
  min-height: 44px;
  max-height: 200px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  line-height: 1.5;
}

textarea:focus {
  border-color: var(--color-primary);
}

textarea:disabled {
  background: var(--color-bg-secondary);
  cursor: not-allowed;
}

.selected-skill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  margin-bottom: 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 16px;
  font-size: 13px;
}

.remove-skill {
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
}

.remove-skill:hover {
  opacity: 1;
}

.skill-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-bottom: 8px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.skill-item:hover,
.skill-item.highlighted {
  background: var(--color-bg-secondary);
}

.skill-icon {
  font-size: 18px;
}

.skill-name {
  font-size: 14px;
}

.send-btn,
.stop-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
}
</style>
