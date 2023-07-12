<script setup lang="ts">
import BackButton from "@/components/BackButton.vue"
import { computed, onDeactivated, onMounted, ref, watch } from "vue"
import { set, ref as fireRef, onValue, get } from "firebase/database"
import { db } from "@/firebase/config"
import { useBoard } from "@/helpers/storePlayerBoard"
import Board, { Cell } from "@/logic/board"
import BoardComponent from "@/components/BoardComponent.vue"
import { useRoute } from "vue-router"
import WinnerScreen from "@/components/WinnerScreen.vue"

type FirebaseGameRef = {
  turn: 'createdPlayer' | 'joinedPlayer',
  gameID: string,
  winner: string,
  createdPlayer: {
    board: Cell[]
  }
  joinedPlayer: {
    isJoined: boolean
    board: Cell[]
  }
}

type Game = {
  turn: 'createdPlayer' | 'joinedPlayer',
  gameID: string,
  winner: string | null,
  createdPlayer: {
    board: Board
  }
  joinedPlayer: {
    isJoined: boolean
    board: Board
  }
}

const gameId = useRoute().query.id
const isJoinedPlayer = ref(Boolean(useRoute().query.isJoined))
const game = ref<Game>({
  winner: null,
  turn: 'createdPlayer',
  gameID: gameId!.toString(),
  createdPlayer: {
    board: new Board()
  },
  joinedPlayer: {
    isJoined: false,
    board: new Board(),
  },
})
const joinedPlayer = computed(() => game.value.joinedPlayer.isJoined)
const getOpponent = computed(() => {
  if(isJoinedPlayer.value) {
    return !Boolean(game.value.turn === 'createdPlayer' )
  }
    return Boolean(game.value.turn === 'createdPlayer')
})

const getWinner = computed(() => {
  if(!game.value.winner) return null
  if(!isJoinedPlayer.value) {
    return !Boolean(game.value.winner === 'createdPlayer' )
  }
    return Boolean(game.value.winner === 'createdPlayer')
})

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
      turn: 'createdPlayer' ,
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
    console.log(gameUpdate);
    

    game.value.createdPlayer.board.cells = gameUpdate.createdPlayer.board
    game.value.joinedPlayer.board.cells = gameUpdate.joinedPlayer.board
    game.value.joinedPlayer.isJoined = gameUpdate.joinedPlayer.isJoined
    game.value.turn = gameUpdate.turn
    game.value.winner = gameUpdate.winner
  }
})

onDeactivated(async function () {})

async function attackOponent(cell: Cell) {
  let winner = null
  const oponnent = game.value.turn === 'createdPlayer' ? 'joinedPlayer' : 'createdPlayer'
  if(isJoinedPlayer.value && game.value.turn !== 'joinedPlayer') return
  if(!isJoinedPlayer.value && game.value.turn !== 'createdPlayer') return
  if (cell.isMissed || cell.isHitted) return
  const board = !isJoinedPlayer.value ? game.value.joinedPlayer.board : game.value.createdPlayer.board
  
  board.attackShip(cell)

  const getShips = () => [...board.cells.filter(cell => cell.ship)]
  console.log(getShips().some(cellRef => !cellRef.isHitted));
  
  if(!getShips().some(cellRef => !cellRef.isHitted)) winner = isJoinedPlayer ? 'joinedPlayer' : 'createdPlayer'
  
  try {
    await set(fireRef(db, "games/" + gameId), {
      winner: winner,
      turn: cell.ship ? game.value.turn : oponnent,
      gameID: gameId,
      createdPlayer: {
        board: game.value.createdPlayer.board.cells,
      },
      joinedPlayer: {
        isJoined: true,
        board: game.value.joinedPlayer.board.cells,
      },
    })
  } catch (error: any) {
    throw new Error(error);
  }
}
</script>

<template>
  <div class="wrapper">
    <WinnerScreen :winner="getWinner" />
    <BackButton />
    <p>Код игры: {{ gameId }}</p>
    <div class="boarders">
      <BoardComponent :turn="!isJoinedPlayer" :board="isJoinedPlayer ? game.joinedPlayer.board : game.createdPlayer.board" />
      <div class="turn-arrow" :class="{rotate: getOpponent}">
        <span></span>
        <span></span>
      </div>
      <BoardComponent
        @click="attackOponent"
        enemy
        :turn="isJoinedPlayer"
        :waiting="!joinedPlayer"
        :board="!isJoinedPlayer ? game.joinedPlayer.board : game.createdPlayer.board"
      />
    </div>
  </div>
</template>

<style>
.boarders {
  display: flex;
  align-items: center;
  gap: 30px;
}

.turn-arrow {
  transition: 0.3s ease;
  transform: translateY(50px);
}

.turn-arrow.rotate {
  transform: translateY(35px) rotate(180deg);
}

.turn-arrow span {
  display: block;
  width: 10px;
  height: 30px;
  background-color: var(--green-light);
  transform: rotate(45deg) translateX(-10px) translateY(-10px);
}
.turn-arrow span:nth-child(1) {
  transform: rotate(-45deg);
}

</style>
