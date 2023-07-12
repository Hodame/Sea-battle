export default class BattleShips {
  ships: BattleShip[] = []

  constructor() {
    this.ships = this.crateBattleShips()
  }

  private crateBattleShips() {
    const ships: BattleShip[] = []
    const shipsTypes = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4]

    shipsTypes.forEach(function (element, idx) {
      ships.push(new BattleShip(element, idx))
    })

    return ships
  }

  public removeShip(id: number) {
    const idx = this.ships.findIndex((ship) => ship.id === id)
    this.ships.splice(idx, 1)
  }
}

export class BattleShip {
  type: number
  id: number
  x: number | null = null
  y: number | null = null
  posX: number = 0
  posY: number = 0
  isRotate = false

  constructor(type: number, id: number) {
    this.type = type
    this.id = id
  }

  get getType() {
    return this.type
  }

  public set setX(value: number) {
    this.x = value
  }

  public set setY(value: number) {
    this.y = value
  }
}
