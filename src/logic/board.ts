import { BattleShip } from "./ships"

export default class Board {
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

  addShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (cell.ship) throw new Error('Has ship')
    if (!cell.isFree) throw new Error('Isnt free')

    if (!isRotate) {
      const cellsX = this.getFilteredCellsByX(cell, ship).cells
      cellsX.forEach((cell) => cell.ship = ship)

      ship.setX = cell.getX
      ship.setY = cell.getY

      cell.ship = ship
      this.lockCells([cell, ...cellsX])

      return
    }
    else {
      const cellsY = this.getFilteredCellsByY(cell, ship).cells
      cellsY.forEach((cell) => cell.ship = ship)

      ship.setX = cell.getX
      ship.setY = cell.getY

      cell.ship = ship
      this.lockCells([cell, ...cellsY])
    }
  }

  previewShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (!isRotate) {
      this.getFilteredCellsByX(cell, ship).cells.forEach((cell) => cell.isPreview = true)
      return
    }

    this.getFilteredCellsByY(cell, ship).cells.forEach((cell) => cell.isPreview = true)
  }

  deletePreview() {
    this.cells.forEach(element => element.isPreview = false)
  }

  private getFilteredCellsByX(cell: Cell, ship: BattleShip) {
    const cells: Cell[] = []
    const indexes = []

    for (let i = cell.getX; i < cell.getX + ship.getType; i++) {
      indexes.push(i)
    }

    for (let i = 0; i < indexes.length; i++) {
      const filteredCell = this.cells.find(function (item) {
        if (item.getY !== cell.getY) return
        return item.getX === indexes[i]
      })

      if (filteredCell.ship) return
      if (!filteredCell.isFree) return

      cells.push(filteredCell)
    }
    return {
      cells,
      indexes
    }
  }

  removeShip(ship: BattleShip) {
    this.cells.forEach(function(cell) {
      if(cell.ship === ship) return cell.ship = null
    })
    
  }

  private getFilteredCellsByY(cell: Cell, ship: BattleShip) {
    const cells: Cell[] = []
    const indexes = []

    for (let i = cell.getY; i < cell.getY + ship.getType; i++) {
      indexes.push(i)
    }

    for (let i = 0; i < indexes.length; i++) {
      const filteredCell = this.cells.find(function (item) {
        if (item.getX !== cell.getX) return
        return item.getY === indexes[i]
      })

      if (filteredCell.ship) return
      if (!filteredCell.isFree) return
      cells.push(filteredCell)
    }
    return {
      cells,
      indexes
    }
  }

  private lockCells(lockCells: Cell[]) {
    const mustLock: Cell[] = []
    for (const cell of lockCells) {
      const coordinates = [
        //top  
        { x: cell.getX - 1, y: cell.getY - 1, },
        { x: cell.getX, y: cell.getY - 1, },
        { x: cell.getX + 1, y: cell.getY - 1, },
        //left-right
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

export class Cell {
  private x: number
  private y: number
  isFree = true
  ship: BattleShip | null = null
  isPreview = false;

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