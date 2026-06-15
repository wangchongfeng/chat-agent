<!-- web/src/components/ModelPicker.vue -->
<template>
  <el-select
    :model-value="currentValue"
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
import { ref, computed, onMounted } from 'vue'
import { api } from '../api/index.js'

const props = defineProps({
  modelId: { type: String, default: 'qwen2.5:7b' }
})

defineEmits(['change'])

const models = ref([])

const currentValue = computed(() => {
  if (models.value.length === 0) return props.modelId
  const found = models.value.find(m => m.id === props.modelId)
  return found ? props.modelId : models.value[0]?.id || props.modelId
})

onMounted(async () => {
  models.value = await api.getModels()
})
</script>
