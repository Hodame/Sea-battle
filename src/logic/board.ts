import { BattleShip } from "./ships"

export default class Board {
  cells: Cell[] = []
  private readonly boardSize = 100

  constructor() {
    this.cells = this.createBoard()
  }

  private createBoard() {
    const createdCells = [...Array(this.boardSize).map((_, i) => i++)]

    return createdCells.map(function (_cell, index) {
      return new Cell(index % 10, Math.floor(index / 10))
    })
  }

  public attackShip(cell: Cell) {
    if (cell.ship && !cell.isMissed) {
      cell.isHitted = true
    } else {
      cell.isMissed = true
    }

    if (cell.ship) {
      const shipCells = this.cells.filter((cellRef) => cellRef.ship === cell.ship)
      if (!shipCells.some((cell) => !cell.isHitted)) {
        console.log(shipCells)
        const missedCells = this.getLockedCells(shipCells)

        missedCells.forEach(function (cell) {
          if (!cell.ship) {
            return (cell.isMissed = true)
          }
        })
      }
    }
  }

  public addShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (cell.ship) throw new Error("Has ship")
    if (!cell.isFree) throw new Error("Isnt free")

    if (!isRotate) {
      const cellsX = this.getFilteredCells(cell, ship, "x")
      if (!cellsX.length) throw new Error("cant placed here")
      cellsX.forEach((cell) => (cell.ship = ship))

      ship.setX = cell.x
      ship.setY = cell.y

      cell.ship = ship
      this.getLockedCells([cell, ...cellsX]).forEach((cell) => (cell !== undefined ? (cell.isFree = false) : null))
      return
    } else {
      const cellsY = this.getFilteredCells(cell, ship, "y")
      if (!cellsY.length) throw new Error("cant placed here")
      cellsY.forEach((cell) => (cell.ship = ship))

      ship.setX = cell.x
      ship.setY = cell.y

      cell.ship = ship
      this.getLockedCells([cell, ...cellsY]).forEach((cell) => (cell !== undefined ? (cell.isFree = false) : null))
    }
  }

  public previewShip(ship: BattleShip, cellId: number, isRotate: boolean) {
    const cell = this.cells[cellId]

    if (!isRotate) {
      const cellsX = this.getFilteredCells(cell, ship, "x")
      if (!cellsX.length) throw new Error("doesnt fit")
      cellsX.forEach((cell) => (cell.isPreview = true))
      return
    }

    const cellsY = this.getFilteredCells(cell, ship, "y")
    if (!cellsY.length) throw new Error("doesnt fit")
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

  public autoShipPlace(ships: BattleShip[]) {
    let length = ships.length
    let i = 0

    const placeShip = (ship: BattleShip) => {
      try {
        let randomCell = Math.floor(Math.random() * 100)
        let randomRotate = Boolean(Math.floor(Math.round(Math.random())))

        while (this.cells[randomCell].ship && !this.cells[randomCell].isFree) {
          randomCell = Math.floor(Math.random() * 100)
          randomRotate = Boolean(Math.floor(Math.round(Math.random())))
        }

        this.addShip(ship, randomCell, randomRotate)
      } catch (e) {
        placeShip(ship)
      }
    }

    while (length > 0) {
      try {
        placeShip(ships[i])
        i++
        length--
      } catch (e) {
        placeShip(ships[i])
      }
    }
  }

  // needed for get next cells coordinate depended of passed cell
  private getFilteredCells(cell: Cell, ship: BattleShip, coordinate: "x" | "y") {
    let i = cell[coordinate]
    const reversedCoordinate = coordinate === "y" ? "x" : "y"

    const cells = this.cells.filter(function (cellRef) {
      if (
        cellRef[coordinate] === i &&
        cellRef[reversedCoordinate] === cell[reversedCoordinate] &&
        cellRef[coordinate] < cell[coordinate] + ship.getType
      ) {
        if (cellRef.ship || !cellRef.isFree || !cellRef) return null
        i++
        return cellRef
      }
    })

    if (cells.length < ship.getType) return []

    return cells
  }

  // needed for get cells that must be locked or unlocked around cells
  private getLockedCells(shipCells: Cell[]) {
    const mustLock: Cell[] = []

    shipCells.forEach((cell) => {
      const coordinates = [
        //top
        { x: cell.x - 1, y: cell.y - 1 },
        { x: cell.x, y: cell.y - 1 },
        { x: cell.x + 1, y: cell.y - 1 },
        //left-right
        { x: cell.x - 1, y: cell.y },
        { x: cell.x + 1, y: cell.y },
        //bottom
        { x: cell.x - 1, y: cell.y + 1 },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x + 1, y: cell.y + 1 },
      ]

      coordinates.forEach((_, i) => {
        const filteredCell = this.cells.find(function (item) {
          return item.x === coordinates[i].x && item.y === coordinates[i].y
        })
        if (filteredCell) mustLock.push(filteredCell)
      })
    })

    return mustLock
  }
}

export class Cell {
  x: number
  y: number
  isFree = true
  isAnotherShip = false // if cell contains two or more ship around it
  ship: BattleShip | null = null
  isPreview = false
  isMissed = false
  isHitted = false

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
