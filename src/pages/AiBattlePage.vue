<script lang="ts" setup>
import BackButton from "@/components/BackButton.vue"
import BoardComponent from "@/components/BoardComponent.vue"
import { useBoard } from "@/helpers/storePlayerBoard"
import Board, { Cell } from "@/logic/board"
import BattleShips from "@/logic/ships"
import { onDeactivated, onMounted, ref, watch } from "vue"

const player = ref(new Board())
const enemy = ref(new Board())
const turn = ref<"player" | "enemy">("player")
const lastSuccessAttack = ref<Cell | null>(null)
const theWinner = ref<"player" | "enemy" | null>(null)

onMounted(function () {
  const ships = new BattleShips()
  const playerBoard = useBoard.get()
  if (playerBoard === null) {
    return
  }
  player.value.cells = playerBoard

  enemy.value.autoShipPlace(ships.ships)
})

function attack(cell: Cell) {
  if (turn.value === "enemy") return
  if (cell.isMissed || cell.isHitted) return
  enemy.value.attackShip(cell)

  if (cell.ship) {
    return
  }

  turn.value = "enemy"
}

function aiAttack() {
  let attack = player.value.cells[Math.floor(Math.random() * 99)]
  console.log(attack)

  while (attack.isMissed && attack.isHitted) {
    attack = player.value.cells[Math.floor(Math.random() * 99)]
  }

  if (lastSuccessAttack.value) {
    const attacked = lastSuccessAttack.value
    const cells = player.value.cells.filter(function (cell) {
      if (cell.isHitted || cell.isMissed) return
      if (cell.y === attacked.y) {
        if (cell.x == attacked.x - 1 || cell.x == attacked.x + 1) {
          return cell
        }
      }
      if (cell.x === attacked.x) {
        if (cell.y == attacked.y - 1 || cell.y == attacked.y + 1) {
          return cell
        }
      }
    })

    if (!cells.length) {
    }

    attack = cells[Math.floor(Math.random() * cells.length)]
  }

  if (attack.ship) {
    lastSuccessAttack.value = attack
  }

  if (!player.value.cells.filter((cell) => cell.ship === attack.ship).some((cell) => !cell.isHitted)) {
    lastSuccessAttack.value = null
  }

  player.value.attackShip(attack)
  if (attack.ship) {
    aiAttack()

    return
  }

  turn.value = "player"
}

watch(turn, function () {
  if (turn.value === "enemy") {
    setTimeout(() => {
      aiAttack()
    }, 300)
  }
})

onDeactivated(() => useBoard.set([]))
</script>

<template>
  <div class="wrapper">
    <BackButton />
    <div class="boarders">
      <BoardComponent :board="player" />
      <BoardComponent @click="attack" enemy :board="enemy" />
    </div>
  </div>
</template>

<style>
.boarders {
  display: flex;
  gap: 30px;
}
</style>
