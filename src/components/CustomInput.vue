<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{ modelValue: string }>()

const emits = defineEmits<{
  (e: "update:modelValue", v: string): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits("update:modelValue", value)
  },
})
</script>

<template>
  <input v-model="value" type="text" />
</template>

<style scoped>
input {
  border: 4px solid var(--brown-light);
  padding: 20px 20px;
  border-radius: 15px;
  background-color: var(--brown);
  color: white;
  font-size: 24px;
}
</style>
