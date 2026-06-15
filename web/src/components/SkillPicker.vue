<!-- web/src/components/SkillPicker.vue -->
<template>
  <el-select
    :model-value="skillId"
    @change="$emit('change', $event)"
    placeholder="Select Skill"
    clearable
    size="default"
  >
    <el-option
      v-for="skill in skills"
      :key="skill.id"
      :label="`${skill.icon} ${skill.name}`"
      :value="skill.id"
    />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api/index.js'

defineProps({
  skillId: { type: String, default: null }
})

defineEmits(['change'])

const skills = ref([])

onMounted(async () => {
  skills.value = await api.getSkills()
})
</script>
