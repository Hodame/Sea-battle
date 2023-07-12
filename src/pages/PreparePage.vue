<script lang="ts" setup>
import { ref } from "vue"
import Board from "@/logic/board"
import BattleShips from "@/logic/ships"
import BackButton from "@/components/BackButton.vue"
import CustomButton from "@/components/CustomButton.vue"
import { useBoard } from "@/helpers/storePlayerBoard"
import { useRoute, useRouter } from "vue-router"
import { RouteNames } from "@/router/routeNames"
import { getRandom } from "@/helpers/randomID"

const router = useRouter()

const symbols = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"]
const figures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const board = ref(new Board())
const ships = ref(new BattleShips())
const playerBoard = useBoard
const route = useRoute()
const id = getRandom()

const selectedShip = ref<number | null>(null)
const isRotate = ref(false)
const previewCellId = ref<number | null>(null)

const selectShip = (id: number) => (selectedShip.value = selectedShip.value === id ? null : id)

function addShip(cellId: number) {
  const ship = ships.value.ships.find((ship) => ship.id === selectedShip.value)
  if (selectedShip.value === null || !ship) return

  try {
    board.value.addShip(ship, cellId, isRotate.value)
  } catch (error: any) {
    throw new Error(error)
  }

  ships.value.removeShip(selectedShip.value)
  selectedShip.value = null
}

function previewShip(cellId: number) {
  if (selectedShip.value === null) return
  const ship = ships.value.ships.find((ship) => ship.id === selectedShip.value)
  if (!ship) return
  board.value.previewShip(ship, cellId, isRotate.value)
  previewCellId.value = cellId
}

function removeShipFromBoard(cellId: number) {
  if (selectedShip.value) return
  const cell = board.value.cells[cellId]
  const ship = cell.ship
  if (!ship) return
  board.value.removeShip(ship)
  ships.value.ships.push(ship)
}

function autoPlace() {
  board.value.autoShipPlace(ships.value.ships)
  ships.value.ships = []
}

function resetBoard() {
  board.value = new Board()
  ships.value = new BattleShips()
}

function startGame(connect: boolean) {
  playerBoard.set(board.value.cells)
  if (connect) {
    router.push({
      name: RouteNames.FIND,
    })
    return
  }
  if (route.query.from === "pvp") {
    router.replace({
      name: RouteNames.PVP,
      query: {
        id: id,
      },
    })
    return
  }
  router.replace({ name: RouteNames.AI })
}

window.onwheel = function () {
  isRotate.value = !isRotate.value
  board.value.deletePreview()
  if (previewCellId.value) previewShip(previewCellId.value)
}
</script>

<template>
  <div class="wrapper">
    <BackButton />
    <div class="body">
      <div class="table">
        <div>
          <ul class="symbols">
            <div style="width: 50px; height: 50px"></div>
            <li v-for="(symbol, idx) in symbols" :key="idx">
              {{ symbol }}
            </li>
          </ul>
        </div>
        <div>
          <ul class="symbols figures">
            <li v-for="(figure, idx) in figures" :key="idx">
              {{ figure }}
            </li>
          </ul>
          <div class="board">
            <div
              @click="
                () => {
                  removeShipFromBoard(idx), addShip(idx)
                }
              "
              @mouseenter.prevent="previewShip(idx)"
              @mouseleave.prevent="board.deletePreview"
              class="cell"
              :class="{
                'has-ship': cell.ship,
                'isnt-free': !cell.isFree && !cell.ship,
                'anothoer-ship': cell.isAnotherShip,
                preview: cell.isPreview,
              }"
              v-for="(cell, idx) in board.cells"
              :key="idx"
            ></div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <CustomButton @click="resetBoard" btn-text="Очистить поле" />
        <CustomButton @click="autoPlace" btn-text="Автоматически" />
        <CustomButton v-if="ships.ships.length === 0" @click="startGame(false)" btn-text="Старт" />
        <CustomButton v-if="ships.ships.length === 0" @click="startGame(true)" btn-text="Подключиться к игре" />
      </div>
      <div class="battle-ships">
        <p class="plain-text">* Используйте колесеко мыши чтобы вращать корабль.</p>
        <div class="ships">
          <div
            @click="selectShip(ship.id)"
            class="ship"
            :class="{
              selected: selectedShip === ship.id,
            }"
            :id="ship.id.toString()"
            v-for="(ship, idx) in ships.ships"
            :key="idx"
            :style="{ width: 50 * ship.getType + 'px', top: ship.posY, left: ship.posX }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  overflow: hidden;
}

.body {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.table {
  display: flex;
}

.board {
  background-color: var(--brown);
  border-radius: 5px;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
}

.cell {
  width: 50px;
  height: 50px;
  background-color: var(--brown-light);
  border-right: 1px solid var(--brown);
  border-bottom: 1px solid var(--brown);
}

.cell.isnt-free {
  background-color: var(--brown);
}

.cell:nth-child(10n) {
  border-right: none;
}

.cell:nth-last-child(-n + 10) {
  border-bottom: none;
}

.cell.preview {
  background-color: var(--green-light);
  cursor: pointer;
  border-right: none;
  border-bottom: none;
}

.cell.has-ship {
  cursor: pointer;
  background-color: var(--green);
  border-right: none;
  border-bottom: none;
}

.battle-ships {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.ships {
  display: flex;
  gap: 10px;
}

.ship {
  height: 50px;
  background-color: var(--green);
  border-radius: 5px;
}

.ship.selected {
  box-shadow: 0px 0px 0px 5px var(--green-light);
}

.symbols {
  display: flex;
  flex-direction: column;
  font-size: 25px;
}

.symbols li {
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.figures {
  flex-direction: row;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
}
</style>
@/helpers/storePlayerBoard
