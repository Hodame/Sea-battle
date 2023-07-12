<script setup lang="ts">
withDefaults(
  defineProps<{
    btnText: string
    width?: string
  }>(),
  {
    width: "410px",
  }
)
</script>

<template>
  <button>
    {{ btnText }}
  </button>
</template>

<style scoped>
button {
  min-width: v-bind(width);
  max-width: v-bind(width);
  width: 100%;
  padding: 20px 30px;
  border-radius: 15px;
  background-color: var(--brown);
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  transform: scale(1);
  transition: 0.3s ease transform;
  border: 4px solid var(--brown-light);
}

button:active {
  transform: scale(0.95);
}

/* button:hover {
  background-color: var(--brown-light);
} */
</style>
