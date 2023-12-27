import {
  isNormalPosition,
  isValidCoordinates,
  randomize,
} from "../heplers/additionals";
import { Cell } from "./Cell";
import Ship, { ShipDirection } from "./Ship";
import Shot from "./Shot";
import ShotResponse from "./ShotResponse";
import { CellStatus } from "./enums/CellStatus";

export default class Field {
  public cells: Cell[][] = [];
  public ships: Ship[] = [];
  public destroyedShips: Ship[] = [];
  public shots: Shot[] = [];

  public constructor() {
    this.initCells();
  }

  public initCells() {
    for (let i = 0; i < 10; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 10; j++) {
        row.push({ X: j, Y: i, CellStatus: CellStatus.UNKNOWN });
      }
      this.cells.push(row);
    }
  }

  private addShipGen(ship: Ship) {
    this.cells[ship.y][ship.x].Ship = ship;

    const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
    const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

    for (let i = 0; i < ship.Length; i++) {
      const x = ship.x + dx * i;
      const y = ship.y + dy * i;
      this.cells[y][x].CellStatus = CellStatus.SHIP;
    }
  }

  public generateShips(type: GenerateShipsType) {
    this.clearShips();
    this.clear();
    switch (type) {
      case GenerateShipsType.RANDOM:
        this.ships = randomize();
        this.ships.forEach((ship) => this.addShipGen(ship));
        return;
      case GenerateShipsType.SHORES_1: {
        let newShips: Ship[] = [];

        while (newShips.length <= 10) {
          for (let i = 0; i < 10000; i++) {
            if (newShips.length === 10) {
              this.ships = newShips;
              this.ships.forEach((ship) => this.addShipGen(ship));
              return;
            }
            const lengths = this.getAvailableLength(newShips);
            const ship = new Ship(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
              lengths[Math.floor(Math.random() * lengths.length)],
              Math.floor(Math.random() * 2)
            );

            if (ship.length === 1) {
              if (
                ship.y === 0 ||
                ship.y === 9 ||
                ship.x === 0 ||
                ship.x === 9
              ) {
                if (isNormalPosition([...newShips, ship])) {
                  newShips.push(ship);
                }
              }
              continue;
            }
            if (
              ship.direction === ShipDirection.HORIZONTAL &&
              (ship.y === 0 || ship.y === 9)
            ) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }
            if (
              ship.direction === ShipDirection.VERTICAL &&
              (ship.x === 0 || ship.x === 9)
            ) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }
          }
          if (newShips.length !== 10) {
            newShips = [];
          }
        }

        this.ships = newShips;
        this.ships.forEach((ship) => this.addShipGen(ship));
        break;
      }
      case GenerateShipsType.SHORES_2: {
        let newShips: Ship[] = [];

        while (newShips.length <= 10) {
          for (let i = 0; i < 10000; i++) {
            if (newShips.length === 10) {
              this.ships = newShips;
              this.ships.forEach((ship) => this.addShipGen(ship));
              return;
            }
            const lengths = this.getAvailableLength(newShips);
            const ship = new Ship(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
              lengths[Math.floor(Math.random() * lengths.length)],
              Math.floor(Math.random() * 2)
            );

            if (ship.length === 1) {
              if (
                ship.y !== 0 &&
                ship.y !== 9 &&
                ship.x !== 0 &&
                ship.x !== 9
              ) {
                if (isNormalPosition([...newShips, ship])) {
                  newShips.push(ship);
                }
              }
              continue;
            }

            if (
              ship.direction === ShipDirection.HORIZONTAL &&
              (ship.y === 0 || ship.y === 9)
            ) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }
            if (
              ship.direction === ShipDirection.VERTICAL &&
              (ship.x === 0 || ship.x === 9)
            ) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }
          }
          if (newShips.length !== 10) {
            newShips = [];
          }
        }
        break;
      }
      case GenerateShipsType.SHORES_3: {
        let newShips: Ship[] = [];

        while (newShips.length <= 10) {
          const half = Math.floor(Math.random() * 4);
          for (let i = 0; i < 10000; i++) {
            if (newShips.length === 10) {
              this.ships = newShips;
              this.ships.forEach((ship) => this.addShipGen(ship));
              return;
            }
            const lengths = this.getAvailableLength(newShips);
            const ship = new Ship(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
              lengths[Math.floor(Math.random() * lengths.length)],
              Math.floor(Math.random() * 2)
            );

            if (newShips.length >= 6) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }

            if (ship.length !== 1) {
              switch (half) {
                case 0: {
                  if (
                    ship.direction === ShipDirection.HORIZONTAL &&
                    [0, 1, 2].includes(ship.y)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(ship.x, 0, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(ship.x, 0, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  if (
                    ship.direction === ShipDirection.VERTICAL &&
                    [0, 1, 2].includes(ship.x)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(0, ship.y, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(0, ship.y, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  break;
                }
                case 1: {
                  if (
                    ship.direction === ShipDirection.HORIZONTAL &&
                    [0, 1, 2].includes(ship.y)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(ship.x, 0, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(ship.x, 0, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  if (
                    ship.direction === ShipDirection.VERTICAL &&
                    [7, 8, 9].includes(ship.x)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(9, ship.y, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(9, ship.y, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  break;
                }
                case 2: {
                  if (
                    ship.direction === ShipDirection.HORIZONTAL &&
                    [7, 8, 9].includes(ship.y)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(ship.x, 9, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(ship.x, 9, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  if (
                    ship.direction === ShipDirection.VERTICAL &&
                    [7, 8, 9].includes(ship.x)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(9, ship.y, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(9, ship.y, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  break;
                }
                case 3: {
                  if (
                    ship.direction === ShipDirection.HORIZONTAL &&
                    [7, 8, 9].includes(ship.y)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(ship.x, 9, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(ship.x, 9, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  if (
                    ship.direction === ShipDirection.VERTICAL &&
                    [0, 1, 2].includes(ship.x)
                  ) {
                    if (
                      isNormalPosition([
                        ...newShips,
                        new Ship(0, ship.y, ship.length, ship.direction),
                      ])
                    ) {
                      newShips.push(
                        new Ship(0, ship.y, ship.length, ship.direction)
                      );
                    } else {
                      if (isNormalPosition([...newShips, ship])) {
                        newShips.push(ship);
                      }
                    }
                  }
                  break;
                }
              }
            }
          }
          if (newShips.length !== 10) {
            newShips = [];
          }
        }
        break;
      }
      case GenerateShipsType.DIAGONALS: {
        let newShips: Ship[] = [];
        const banned_cells: { x: number; y: number }[] = [];
        for (let i = 0; i < 10; i++) {
          banned_cells.push({ x: i, y: i });
        }

        for (let j = 0; j < 10; j++) {
          for (let i = 9; i >= 0; i--) {
            if (i + j === 9) {
              banned_cells.push({ x: i, y: j });
            }
          }
        }
        while (newShips.length <= 10) {
          for (let i = 0; i < 1000; i++) {
            if (newShips.length === 10) {
              this.ships = newShips;
              this.ships.forEach((ship) => this.addShipGen(ship));
              return;
            }
            const lengths = this.getAvailableLength(newShips);
            const ship = new Ship(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
              lengths[Math.floor(Math.random() * lengths.length)],
              Math.floor(Math.random() * 2)
            );

            if (
              !this.isCellsInShip(ship, banned_cells) &&
              isNormalPosition([...newShips, ship])
            ) {
              newShips.push(ship);
            }
          }

          newShips = [];
        }
        break;
      }
      case GenerateShipsType.HALF_FIELD: {
        let newShips: Ship[] = [];

        while (newShips.length <= 10) {
          const half = Math.floor(Math.random() * 4);
          for (let i = 0; i < 1000; i++) {
            if (newShips.length === 10) {
              this.ships = newShips;
              this.ships.forEach((ship) => this.addShipGen(ship));
              return;
            }
            const lengths = this.getAvailableLength(newShips);
            const ship = new Ship(
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
              lengths[Math.floor(Math.random() * lengths.length)],
              Math.floor(Math.random() * 2)
            );
            if (newShips.length >= 6) {
              if (isNormalPosition([...newShips, ship])) {
                newShips.push(ship);
              }
            }
            if (ship.length !== 1) {
              switch (half) {
                case 0: {
                  ship.direction = ShipDirection.VERTICAL;
                  ship.x = Math.floor(Math.random() * 5) + 5;
                  if (isNormalPosition([...newShips, ship])) {
                    newShips.push(ship);
                  }
                  break;
                }
                case 1: {
                  ship.direction = ShipDirection.VERTICAL;
                  ship.x = Math.floor(Math.random() * 5);
                  if (isNormalPosition([...newShips, ship])) {
                    newShips.push(ship);
                  }
                  break;
                }
                case 2: {
                  ship.direction = ShipDirection.HORIZONTAL;
                  ship.y = Math.floor(Math.random() * 5) + 5;
                  if (isNormalPosition([...newShips, ship])) {
                    newShips.push(ship);
                  }
                  break;
                }
                case 3: {
                  ship.direction = ShipDirection.HORIZONTAL;
                  ship.y = Math.floor(Math.random() * 5);
                  if (isNormalPosition([...newShips, ship])) {
                    newShips.push(ship);
                  }
                  break;
                }
              }
            }
          }

          newShips = [];
        }

        console.log("asdf");
        break;
      }

      default:
        break;
    }
  }

  public isCellsInShip(
    ship: Ship,
    banned_cells: { x: number; y: number }[]
  ): boolean {
    const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
    const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

    for (let i = 0; i < ship.Length; i++) {
      const x = ship.x + dx * i;
      const y = ship.y + dy * i;
      if (banned_cells.some((a) => a.x === x && a.y === y)) {
        return true;
      }
    }
    return false;
  }

  public getAvailableLength(ships: Ship[]) {
    const arrlen = ships.map((ship) => ship.length);
    const one = arrlen.filter((l) => l === 1).length;
    const two = arrlen.filter((l) => l === 2).length;
    const three = arrlen.filter((l) => l === 3).length;
    const four = arrlen.filter((l) => l === 4).length;
    return [
      ...Array(4 - one).fill(1),
      ...Array(3 - two).fill(2),
      ...Array(2 - three).fill(3),
      ...Array(1 - four).fill(4),
    ];
  }
  // public checkShips(ships: Ship[], ship: Ship) {
  //   if (ship.direction === ShipDirection.HORIZONTAL) {
  //             ship.y = 0;
  //             ship.x = Math.floor(Math.random() * 10);
  //   } else {
  //             ship.x = 0;
  //             ship.y = Math.floor(Math.random() * 10);
  //   }
  //   const shipsNew = [...ships, ship]
  //   isNormalPosition([...ships, ship.Direction === ShipDirection.HORIZONTAL ? ship.y = 0 : ship.x = 0])
  // }

  // public getCorrectShip(ship: Ship): Ship {
  //   if(ship.Direction === ShipDirection.HORIZONTAL)
  //   {
  //     ship.y = 0
  //   }
  // }

  public applayShips(ships: Ship[]) {
    this.clearShips();
    this.clear();
    this.ships = ships;
    this.ships.forEach((ship) => this.addShipGen(ship));
  }

  public addShip(ship: Ship) {
    const normal = isNormalPosition([...this.ships, ship]);
    if (normal) {
      this.cells[ship.y][ship.x].Ship = ship;

      const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
      const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

      for (let i = 0; i < ship.Length; i++) {
        const x = ship.x + dx * i;
        const y = ship.y + dy * i;
        this.cells[y][x].CellStatus = CellStatus.SHIP;
      }
      this.ships.push(ship);
    }
  }

  public clear() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.cells[i][j].CellStatus = CellStatus.UNKNOWN;
      }
    }
    this.ships = [];
    this.destroyedShips = [];
  }

  public clearShips() {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.Ship) {
          const dx = cell.Ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
          const dy = cell.Ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

          for (let i = 0; i < cell.Ship.Length; i++) {
            const x = cell.Ship.x + dx * i;
            const y = cell.Ship.y + dy * i;
            this.cells[y][x].CellStatus = CellStatus.UNKNOWN;
          }
          cell.Ship = undefined;
        }
      });
    });
    this.ships.splice(0, this.ships.length);
    this.ships.length = 0;
  }

  public removeShip(shipId: number) {
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.Ship && cell.Ship.Id == shipId) {
          const dx = cell.Ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
          const dy = cell.Ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

          for (let i = 0; i < cell.Ship.Length; i++) {
            const x = cell.Ship.x + dx * i;
            const y = cell.Ship.y + dy * i;
            this.cells[y][x].CellStatus = CellStatus.SHIP;
          }
          cell.Ship = undefined;
        }
      });
    });
    const ind = this.ships.findIndex((ship) => ship.Id === shipId);
    this.ships.splice(ind, 1);
  }

  public takeShot(shot: Shot): ShotResponse {
    const cell = this.cells[shot.y][shot.x];
    switch (cell.CellStatus) {
      case CellStatus.SHIP: {
        cell.CellStatus = CellStatus.HIT;
        const ship = this.findShipCell(cell);
        if (ship) {
          if (this.isShipDestroyed(ship)) {
            this.renderDestroyShip(ship);
            this.destroyedShips.push(ship);
            if (this.destroyedShips.length === 10) {
              return {
                x: cell.X,
                y: cell.Y,
                cellStatus: cell.CellStatus,
                desroyedShip: ship,
                isWin: true,
              };
            }
            return {
              x: cell.X,
              y: cell.Y,
              cellStatus: cell.CellStatus,
              desroyedShip: ship,
            };
          }
        }
        return {
          x: cell.X,
          y: cell.Y,
          cellStatus: cell.CellStatus,
        };
      }
      default: {
        cell.CellStatus = CellStatus.MISSING;
        return {
          x: cell.X,
          y: cell.Y,
          cellStatus: cell.CellStatus,
        };
      }
    }
  }

  public getPotentialTargets() {
    const targets: Shot[] = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (
          !(
            this.cells[i][j].CellStatus === CellStatus.MISSING ||
            this.cells[i][j].CellStatus === CellStatus.HIT
          )
        ) {
          targets.push({ x: j, y: i });
        }
      }
    }
    return targets;
  }

  // public getCellSurroundings(x: number, y: number) {
  //   const targets: Shot[] = [];
  //   if (this.fiel [y][x]) {
  //   }
  //   targets.push({ x: this.cells[y][x].X - 1, y: this.cells[y][x].Y });
  //   targets.push({ x: this.cells[y][x].X + 1, y: this.cells[y][x].Y });
  //   targets.push({ x: this.cells[y][x].X, y: this.cells[y][x].Y + 1 });
  //   targets.push({ x: this.cells[y][x].X, y: this.cells[y][x].Y - 1 });
  //   return targets;
  // }

  public findShipCell(cell: Cell): Ship | undefined {
    for (const ship of this.ships) {
      const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
      const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

      for (let i = 0; i < ship.Length; i++) {
        const x = ship.x + dx * i;
        const y = ship.y + dy * i;

        const shipCell = this.cells[y][x];

        if (shipCell.X === cell.X && shipCell.Y === cell.Y) {
          return ship;
        }
      }
    }
  }

  public isShipDestroyed(ship: Ship): boolean {
    const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
    const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

    for (let i = 0; i < ship.Length; i++) {
      const x = ship.x + dx * i;
      const y = ship.y + dy * i;
      if (this.cells[y][x].CellStatus === CellStatus.SHIP) {
        return false;
      }
    }
    return true;
  }

  public renderDestroyShip(ship: Ship) {
    if (ship.Direction === ShipDirection.HORIZONTAL) {
      for (let y = ship.y - 1; y <= ship.y + 1; y++) {
        for (let x = ship.x - 1; x <= ship.x + ship.Length; x++) {
          if (isValidCoordinates(x, y)) {
            if (this.cells[y][x].CellStatus === CellStatus.HIT) {
              continue;
            }
            this.cells[y][x].CellStatus = CellStatus.MISSING;
          }
        }
      }
    } else {
      for (let y = ship.y - 1; y <= ship.y + ship.Length; y++) {
        for (let x = ship.x - 1; x <= ship.x + 1; x++) {
          if (isValidCoordinates(x, y)) {
            if (this.cells[y][x].CellStatus === CellStatus.HIT) {
              continue;
            }
            this.cells[y][x].CellStatus = CellStatus.MISSING;
          }
        }
      }
    }
  }
}

export enum GenerateShipsType {
  RANDOM,
  SHORES_1,
  SHORES_2,
  SHORES_3,
  HALF_FIELD,
  DIAGONALS,
}
