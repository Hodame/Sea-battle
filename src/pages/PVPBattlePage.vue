<script setup lang="ts">
import BackButton from "@/components/BackButton.vue"
import { onDeactivated, onMounted, ref } from "vue"
import { set, ref as fireRef, onValue, get } from "firebase/database"
import { db } from "@/firebase/config"
import { useBoard } from "@/helpers/storePlayerBoard"
import Board, { Cell } from "@/logic/board"
import BoardComponent from "@/components/BoardComponent.vue"
import { useRoute } from "vue-router"

type FirebaseGameRef = {
  gameID: string
  createdPlayer: {
    board: Cell[]
  }
  joinedPlayer: {
    isJoined: boolean
    board: Cell[]
  }
}

const gameId = useRoute().query.id
const isJoinedPlayer = ref(Boolean(useRoute().query.isJoined))
const game = ref({
  gameID: gameId!.toString(),
  createdPlayer: new Board(),
  joinedPlayer: {
    isJoined: false,
    board: new Board(),
  },
})
const joinedPlayer = ref(Boolean(game.value.joinedPlayer.isJoined))

onMounted(async function () {
  const playerBoard = useBoard.get()
  if (playerBoard === null || isJoinedPlayer.value) {
    return
  }

  try {
    const isGameCreated = await get(fireRef(db, "games/" + gameId))
    if (isGameCreated.exists()) {
      return
    }
  } catch (error) {
    return
  }

  try {
    await set(fireRef(db, "games/" + gameId), {
      gameID: gameId,
      createdPlayer: {
        board: playerBoard,
      },
      joinedPlayer: {
        isJoined: false,
        board: new Board().cells,
      },
    })
  } catch (error) {
    console.log(error)
  }
})

onValue(fireRef(db, "games/" + gameId), (snapshot) => {
  if (snapshot.exists()) {
    const gameUpdate = snapshot.val() as FirebaseGameRef

    game.value.createdPlayer.cells = gameUpdate.createdPlayer.board
    game.value.joinedPlayer.board.cells = gameUpdate.joinedPlayer.board
  }
})

onDeactivated(async function () {})

function attackOponent(cell: Cell) {
  if (cell.isMissed || cell.isHitted) return
  const board = !isJoinedPlayer ? game.value.joinedPlayer.board : game.value.createdPlayer

  board.attackShip(cell)
}
</script>

<template>
  <div class="wrapper">
    <BackButton />
    <p>Код игры: {{ gameId }}</p>
    <div class="boarders">
      <BoardComponent :board="isJoinedPlayer ? game.joinedPlayer.board : game.createdPlayer" />
      <BoardComponent
        @click="attackOponent"
        enemy
        :waiting="joinedPlayer"
        :board="!isJoinedPlayer ? game.joinedPlayer.board : game.createdPlayer"
      />
    </div>
  </div>
</template>

<style>
.boarders {
  display: flex;
  gap: 30px;
}
</style>
