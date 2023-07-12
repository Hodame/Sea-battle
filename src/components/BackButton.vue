<script lang="ts" setup>
import { useRouter } from "vue-router"
import CustomButton from "./CustomButton.vue"

const router = useRouter()
</script>

<template>
  <div class="back-button"><CustomButton @click="router.go(-1)" width="150px" btn-text="Назад" /></div>
</template>

<style scoped>
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
