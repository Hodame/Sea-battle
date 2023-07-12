<script setup lang="ts">
import CustomButton from "@/components/CustomButton.vue"
</script>

<template>
  <div class="wrapper">
    <h1 class="menu__title">Морской бой</h1>
    <div class="menu__buttons">
      <RouterLink
        :to="{
          path: '/find',
        }"
      >
        <CustomButton btn-text="Найти игру" />
      </RouterLink>
      <RouterLink
        :to="{
          path: '/preparation',
          query: {
            from: 'pvp',
          },
        }"
      >
        <CustomButton btn-text="Играть против друга" />
      </RouterLink>
      <RouterLink
        :to="{
          path: '/preparation',
          query: {
            from: 'ai',
          },
        }"
      >
        <CustomButton btn-text="Играть против ИИ" />
      </RouterLink>
      <RouterLink to="/settings">
        <CustomButton btn-text="Настройки" />
      </RouterLink>
      <CustomButton btn-text="Статистика" />
    </div>
  </div>
</template>

<style>
.menu__buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu__title {
  margin-bottom: 100px;
  font-size: 5rem;
  font-weight: 800;
  color: var(--brown);
}
</style>
