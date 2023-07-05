import { BattleShip } from "./ships"

export default class Board {
  cells: Cell[] = []
  private readonly boardSize = 100

  constructor() {
    this.cells = this.createBoard().map(function (_cell, index) {
      return new Cell(index % 10, Math.floor(index / 10))
    })
  }

  private createBoard() {
    const newCells = []

    for (let i = 0; i < this.boardSize; i++) {
      newCells.push(i)
    }

    return newCells
  }

  public addShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (cell.ship) throw new Error("Has ship")
    if (!cell.isFree) throw new Error("Isnt free")

    if (!isRotate) {
      const cellsX = this.getFilteredCellsByX(cell, ship)
      if (!cellsX.length) throw new Error("cant placed here")
      cellsX.forEach((cell) => (cell.ship = ship))

      ship.setX = cell.getX
      ship.setY = cell.getY

      cell.ship = ship
      this.getLockedCells([cell, ...cellsX]).forEach((cell) => (cell !== undefined ? (cell.isFree = false) : null))
      return
    } else {
      const cellsY = this.getFilteredCellsByY(cell, ship)
      if (!cellsY.length) throw new Error("cant placed here")
      cellsY.forEach((cell) => (cell.ship = ship))

      ship.setX = cell.getX
      ship.setY = cell.getY

      cell.ship = ship
      this.getLockedCells([cell, ...cellsY]).forEach((cell) => (cell !== undefined ? (cell.isFree = false) : null))
    }
  }

  public previewShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (!isRotate) {
      const cellsX = this.getFilteredCellsByX(cell, ship)
      if (!cellsX) return
      cellsX.forEach((cell) => (cell.isPreview = true))
      return
    }

    const cellsY = this.getFilteredCellsByY(cell, ship)
    if (!cellsY) return
    cellsY.forEach((cell) => (cell.isPreview = true))
  }

  public deletePreview() {
    this.cells.forEach((element) => (element.isPreview = false))
  }

  public removeShip(ship: BattleShip) {
    const cells: Cell[] = []

    this.cells.forEach(function (cell) {
      if (cell.ship === ship) {
        cells.push(cell)
        return (cell.ship = null)
      }
    })

    const cellsWithShip = this.cells.filter((cell) => cell.ship)

    this.getLockedCells(cells).forEach((cell) => (cell !== undefined ? (cell.isFree = true) : null))
    this.getLockedCells(cellsWithShip).forEach((cell) => (cell !== undefined ? (cell.isFree = false) : null))
  }

  // needed for get next cells by X depended of passed cell
  private getFilteredCellsByX(cell: Cell, ship: BattleShip) {
    const cells: Cell[] = []
    const indexes: number[] = []

    for (let i = cell.getX; i < cell.getX + ship.getType; i++) {
      indexes.push(i)
    }

    for (let i = 0; i < indexes.length; i++) {
      const filteredCell = this.cells.find(function (item) {
        if (item.getY !== cell.getY) return
        return item.getX === indexes[i]
      })

      if (!filteredCell) return []
      if (filteredCell.ship) return []
      if (!filteredCell.isFree) return []

      cells.push(filteredCell)
    }
    return cells
  }

  // needed for get next cells by Y depended of passed cell
  private getFilteredCellsByY(cell: Cell, ship: BattleShip) {
    const cells: Cell[] = []
    const indexes: number[] = []

    for (let i = cell.getY; i < cell.getY + ship.getType; i++) {
      indexes.push(i)
    }

    for (let i = 0; i < indexes.length; i++) {
      const filteredCell = this.cells.find(function (item) {
        if (item.getX !== cell.getX) return
        return item.getY === indexes[i]
      })

      if (!filteredCell) return []
      if (filteredCell.ship) return []
      if (!filteredCell.isFree) return []
      cells.push(filteredCell)
    }
    return cells
  }

  // needed for get cells that must be locked or unlocked around cells
  private getLockedCells(shipCells: Cell[]) {
    const mustLock: Cell[] = []
    for (const cell of shipCells) {
      const coordinates = [
        //top
        { x: cell.getX - 1, y: cell.getY - 1 },
        { x: cell.getX, y: cell.getY - 1 },
        { x: cell.getX + 1, y: cell.getY - 1 },
        //left-right
        { x: cell.getX - 1, y: cell.getY },
        { x: cell.getX + 1, y: cell.getY },
        //bottom
        { x: cell.getX - 1, y: cell.getY + 1 },
        { x: cell.getX, y: cell.getY + 1 },
        { x: cell.getX + 1, y: cell.getY + 1 },
      ]

      for (let i = 0; i < coordinates.length; i++) {
        const filteredCell = this.cells.find(function (item) {
          return item.getX === coordinates[i].x && item.getY === coordinates[i].y
        })

        if (filteredCell) mustLock.push(filteredCell)
      }
    }
    return mustLock
  }
}

export class Cell {
  private x: number
  private y: number
  isFree = true
  isAnotherShip = false // if cell contains two or more ship around it
  ship: BattleShip | null = null
  isPreview = false

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
