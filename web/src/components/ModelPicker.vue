<!-- web/src/components/ModelPicker.vue -->
<template>
  <el-select
    :model-value="modelId"
    @change="$emit('change', $event)"
    placeholder="Select Model"
    size="default"
  >
    <el-option
      v-for="model in models"
      :key="model.id"
      :label="model.name"
      :value="model.id"
    />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api/index.js'

defineProps({
  modelId: { type: String, default: 'openai-gpt35' }
})

defineEmits(['change'])

const models = ref([])

onMounted(async () => {
  models.value = await api.getModels()
})
</script>
