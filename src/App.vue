<script setup lang="ts">
import { ref } from 'vue'

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

  addShip(shipId: number, cellId: number) {
    const ship = ships.ships.find((ship) => ship.id === shipId)
    const cell = this.cells[cellId]
    const cells: Cell[] = []

    console.log(cell);


    if (cell.ship) throw new Error("Ship alredy here");
    if (!cell.isFree) throw new Error('You cant put the ship into this cell')

    if (ship.getType !== 1) {
      const indexes: number[] = []

      for (let i = cell.getX; i < cell.getX + ship.getType; i++) {
        indexes.push(i)
      }

      for (let i = 0; i < indexes.length; i++) {
        const filteredCell = this.cells.find(function (item) {
          if (item.getY !== cell.getY) return
          return item.getX === indexes[i]
        })

        console.log(filteredCell);
        
        if (filteredCell.ship) throw new Error('ship already exits');
        if (!filteredCell.isFree) throw new Error('this cell is not free');
        cells.push(filteredCell)
      }
      
      
      cells.forEach(element => {
        element.ship = ship
      });

    }


    ship.setX = cell.getX
    ship.setY = cell.getY

    cell.ship = ship
    this.lockCells([cell, ...cells])
  }

  lockCells(lockCells: Cell[]) {
    const mustLock: Cell[] = []
    for (const cell of lockCells) {
      const coordinates = [
        //top  
        { x: cell.getX - 1, y: cell.getY - 1, },
        { x: cell.getX, y: cell.getY - 1, },
        { x: cell.getX + 1, y: cell.getY - 1, },
        // left-right
        { x: cell.getX - 1, y: cell.getY, },
        { x: cell.getX + 1, y: cell.getY, },
        //bottom
        { x: cell.getX - 1, y: cell.getY + 1, },
        { x: cell.getX, y: cell.getY + 1, },
        { x: cell.getX + 1, y: cell.getY + 1, },
      ]

      for (let i = 0; i < coordinates.length; i++) {
        const filteredCell = this.cells.find(function (item) {
          return item.getX === coordinates[i].x && item.getY === coordinates[i].y
        })

        mustLock.push(filteredCell)
      }
    }

    mustLock.forEach((cell) => cell !== undefined ? cell.isFree = false : null)
  }
}

class Cell {
  private x: number
  private y: number
  isFree = true
  ship: BattleShip | null = null

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
  ships: BattleShip[] = []

  constructor() {
    this.ships = this.crateBattleShips()
  }

  private crateBattleShips() {
    const ships: BattleShip[] = []
    const shipsTypes = [1, 1, 1, 2, 2, 2, 3, 3, 4, 5]


    shipsTypes.forEach(function (element, idx) {
      ships.push(new BattleShip(element, idx))
    });

    return ships
  }

  public removeShip(id: number) {
    const idx = this.ships.findIndex((ship) => ship.id === id)
    this.ships.splice(idx, 1)
  }
}

class BattleShip {
  private type: number
  id: number
  x: number | null = null
  y: number | null = null

  constructor(type: number, id: number) {
    this.type = type
    this.id = id
  }

  get getType() {
    return this.type
  }

  public set setX(value: number) {
    this.x = value;
  }

  public set setY(value: number) {
    this.y = value;
  }
}

const board = new Board
const ships = new BattleShips

console.log(board.getCells);


const selectedShip = ref<number | null>(null)

const selectShip = (id: number) => selectedShip.value = selectedShip.value === id ? null : id

function addShip(cellId: number) {
  if (selectedShip.value === null) return

  try {
    board.addShip(selectedShip.value, cellId)
  } catch (error) {
    throw new Error(error);
  }

  ships.removeShip(selectedShip.value)
  selectedShip.value = null
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
          <div @click="addShip(idx)" class="cell" :class="{
            'has-ship': id.ship,
            'isnt-free': !id.isFree && !id.ship,
            active: selectedShip !== null,
          }" v-for="(id, idx) in board.getCells" :key="idx">
          </div>
        </div>
      </div>
    </div>
    <div class="battle-ships">
      {{ selectedShip }}
      <div @click="selectShip(ship.id)" class="ship"
        :class="'ship-' + ship.getType.toString(), selectedShip === ship.id ? 'selected' : ''" :id="ship.id.toString()"
        v-for="(ship, idx) in ships.ships" :key="idx" :style="{ width: 50 * ship.getType + 'px' }"></div>
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

.cell.has-ship {
  background-color: #BABDC2;
  border: 2px solid #838383;
}

.cell.isnt-free {
  background-color: #c05c5c6e;
}

.cell.active:hover {
  background-color: #d1cccc;
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

.ship.selected {
  border: 4px dashed #828283;
}
</style>