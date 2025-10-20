<template>
  <div class="tag-container" :class="getTagClass">
    {{ formattedValue }}%
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  }
})

const formattedValue = computed(() => {
  const numValue = Number(props.value)
  return isNaN(numValue) ? 0 : numValue
})

const getTagClass = computed(() => {
  const numValue = Number(props.value)
  if (isNaN(numValue)) {
    return 'danger'
  }

  if (numValue >= 90) {
    return 'success'
  } else if (numValue >= 70) {
    return 'warning'
  } else {
    return 'danger'
  }
})
</script>

<script>
import { computed } from 'vue'

export default {
  name: 'ProgressDisplay'
}
</script>

<style scoped>
.tag-container {
  display: inline-block;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  font-weight: bold;
}

.tag-container.success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.tag-container.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.tag-container.danger {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>