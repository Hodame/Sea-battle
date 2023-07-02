<script setup lang="ts">
import draggable from 'vuedraggable';

const symbols = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
const figures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

class Board {
  private cells: Cell[] = []
  private readonly boardSize = 100

  constructor() {
    this.cells = this.createBoard().map(function (_cell, index) {
      return new Cell(
        index % 10,
        Math.floor(index / 10)
      )
    })
  }

  get getCells() {
    return this.cells
  }

  get size() {
    return this.boardSize
  }

  private createBoard() {
    const newCells = []

    for (let i = 0; i < this.boardSize; i++) {
      newCells.push(i)
    }

    return newCells
  }



}

class Cell {
  private x
  private y

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  get getX() {
    return this.x
  }

  get getY() {
    return this.y
  }
}

class BattleShips {
  battleShips: BattleShip[] = []

  constructor() {

    this.battleShips = this.crateBattleShips()
  }

  private crateBattleShips() {
    const ships: BattleShip[] = []
    const shipsTypes = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5]

    shipsTypes.forEach(element => {
      ships.push(new BattleShip(element))
    });

    return ships
  }


}

class BattleShip {
  private type

  constructor(type: number) {
    this.type = type
  }

  get getType() {
    return this.type
  }
}

const board = new Board
const ships = new BattleShips
console.log(board.getCells);
console.log(ships.battleShips);


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
          <div class="cell" v-for="i in board.size" :key="i">
          </div>
        </div>
      </div>
    </div>
    <UseDropZone />
    <div class="battle-ships">
      <draggable>
        <div class="ship" :class="'ship-' + ship.getType.toString()" v-for="(ship, idx) in ships.battleShips" :key="idx"
          :style="{ width: 50 * ship.getType + 'px' }"></div>
      </draggable>
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
  border-right: 2px dashed #C6C6CC;
  border-bottom: 2px dashed #C6C6CC;
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
  margin-left: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ship {
  overflow: hidden;
  cursor: pointer;
  height: 50px;
  background-color: #BABDC2;
  border-radius: 10px;
}
</style>