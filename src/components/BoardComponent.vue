<script setup lang="ts">
import Board, { Cell } from "@/logic/board"

const symbols = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "К"]
const figures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

withDefaults(
  defineProps<{
    board: any // must be board but it display ts error
    enemy?: boolean
    turn?: boolean
    waiting?: boolean
  }>(),
  {
    waiting: false,
  }
)

defineEmits<{
  (e: "click", cell: Cell): void
}>()
</script>

<template>
  <div class="body">
    <div>
      <p class="turn">{{ turn ? "Создатель лобби" : "Приглашённый" }}</p>
    </div>
    <div class="table">
      <div>
        <ul v-if="!enemy" class="symbols">
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
          <div v-if="waiting" class="waiting">
            <p>
              Отправь код другу чтобы <br />
              он смог подключиться
            </p>
          </div>
          <div
            @click="$emit('click', cell)"
            class="cell"
            :class="{
              'has-ship': cell.ship && !enemy && !cell.isHitted,
              'attacked-ship': cell.isHitted,
              hover: enemy && !cell.isHitted && !cell.isMissed,
              preview: cell.isPreview,
            }"
            v-for="(cell, idx) in board.cells"
            :key="idx"
          >
            <div v-if="cell.isMissed" class="cell__missed"></div>
          </div>
        </div>
      </div>
      <ul v-if="enemy" class="symbols">
        <div style="width: 50px; height: 50px"></div>
        <li v-for="(symbol, idx) in symbols" :key="idx">
          {{ symbol }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.table {
  position: relative;
  display: flex;
}

.waiting {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.459);
}

.waiting p {
  line-height: 1.3rem;
  font-size: 15px;
  color: white;
  text-align: center;
}

.board {
  position: relative;
  background-color: var(--brown);
  border-radius: 5px;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: var(--brown-light);
  border-right: 1px solid var(--brown);
  border-bottom: 1px solid var(--brown);
}

.attacked-ship {
  background-color: var(--red);
}

.cell__missed {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--brown);
}

.cell.hover:hover {
  cursor: pointer;
  background-color: var(--green-light);
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
  background-color: var(--green);
  border-right: none;
  border-bottom: none;
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
</style>
