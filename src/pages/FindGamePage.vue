<script setup lang="ts">
import BackButton from "@/components/BackButton.vue"
import CustomButton from "@/components/CustomButton.vue"
import CustomInput from "@/components/CustomInput.vue"
import { ref } from "vue"
import { ref as fireREf, child, get, update } from "firebase/database"
import { db } from "@/firebase/config"
import router from "@/router"
import { RouteNames } from "@/router/routeNames"
import { useBoard } from "@/helpers/storePlayerBoard"

const input = ref("")
const playerBoard = useBoard.get()

async function findGame() {
  if (!input.value.length) return

  try {
    await get(child(fireREf(db), "games/" + input.value)).then(async function (snapshot) {
      if (snapshot.exists()) {
        await update(fireREf(db, "games/" + input.value), {
          joinedPlayer: {
            isJoined: true,
            board: playerBoard,
          },
        })
        router.replace({
          name: RouteNames.PVP,
          query: {
            id: input.value,
            isJoined: "true",
          },
        })
      } else {
        alert("не тот айди")
      }
    })
  } catch (error) {}
}
</script>

<template>
  <div class="wrapper">
    <BackButton />
    <div class="content">
      <p class="plain-text">* Введи код игры чтобы подключиться</p>
      <p class="plain-text">* Код должен тебе сказать твой друг</p>
      {{ input }}
      <CustomInput v-model:model-value="input" />
      <CustomButton @click="findGame()" btn-text="Подключиться" />
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}
</style>
