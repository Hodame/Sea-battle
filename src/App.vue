<script setup lang="ts">
import { ref } from 'vue'
import Board, { Cell } from './logic/board'
import BattleShips, { BattleShip } from './logic/ships'

const symbols = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
const figures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const board = ref(new Board)
const ships = ref(new BattleShips)

const selectedShip = ref<number | null>(null)
const isRotate = ref(false)
const previewCellId = ref<number | null>(null)

const selectShip = (id: number) => selectedShip.value = selectedShip.value === id ? null : id

function addShip(cellId: number) {
  const ship = ships.value.ships.find(ship => ship.id === selectedShip.value)
  if (selectedShip.value === null) return

  try {
    board.value.addShip(ship, cellId, isRotate.value)
  } catch (error) {
    throw new Error(error);
  }

  ships.value.removeShip(selectedShip.value)
  selectedShip.value = null
}

function previewShip(cellId: number) {
  if (selectedShip.value === null) return

  const ship = ships.value.ships.find(ship => ship.id === selectedShip.value)  
  board.value.previewShip(ship, cellId, isRotate.value)
  previewCellId.value = cellId
}

function removeShipFromBoard(cellId: number) {
  const cell = board.value.getCells[cellId]
  if(!cell.ship) return  
  board.value.removeShip(cell.ship)
  ships.value.ships.push(cell.ship)
}

window.onwheel = function() {
  isRotate.value = !isRotate.value
  board.value.deletePreview()
  previewShip(previewCellId.value)
}
</script>

<template>
  <div class="wrapper">
    <div class="table">
      <div>
        <ul class="symbols">
          <div style="width: 50px; height: 50px;"></div>
          <li v-for="(symbol, idx) in symbols" :key="idx">
            {{ symbol }}
          </li>
        </ul>
      </div>
      <div>
        <ul class="figures">
          <li v-for="(figure, idx) in figures" :key="idx">
            {{ figure }}
          </li>
        </ul>
        <div class="board">
          <div @click="() => { removeShipFromBoard(idx), addShip(idx) }" @mouseenter.prevent="previewShip(idx)" @mouseleave.prevent="board.deletePreview" class="cell" :class="{
            'has-ship': cell.ship,
            'isnt-free': !cell.isFree && !cell.ship,
            preview: cell.isPreview
          }" v-for="(cell, idx) in board.getCells" :key="idx">
          </div>
        </div>
      </div>
    </div>
    <div class="battle-ships">
      <div @click="selectShip(ship.id)" class="ship" :class="{
        selected: selectedShip === ship.id
      }" :id="ship.id.toString()" v-for="(ship, idx) in ships.ships" :key="idx"
        :style="{ width: 50 * ship.getType + 'px', top: ship.posY, left: ship.posX }"></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table {
  display: flex;
}

.board {
  border-radius: 5px;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
}

.cell {
  height: 50px;
  width: 50px;
  background-color: #ebebeb;
  border-right: 2px solid #C6C6CC;
  border-bottom: 2px solid #C6C6CC;
}

.cell.has-ship {
  background-color: #BABDC2;
  border: none;
}

.cell.has-ship:hover {
  cursor: pointer;
}

.cell.isnt-free {
  background-color: #c05c5c6e;
}
.cell.preview {
  background-color: #d1cccc;
}

.cell.preview:hover {
  cursor: pointer;
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
  display: flex;
  font-size: 25px;
}

.figures li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
}

.battle-ships {
  position: relative;
  margin-left: 50px;
  gap: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.ship {
  overflow: hidden;
  cursor: pointer;
  height: 50px;
  background-color: #BABDC2;
}

.ship.selected {
  border: 2px solid #828283;
}
</style>