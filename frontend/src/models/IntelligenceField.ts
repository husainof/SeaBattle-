import { renderToString } from "react-dom/server";
import { isNormalPosition, isValidCoordinates } from "../heplers/additionals";
import { Cell } from "./Cell";
import Ship, { ShipDirection } from "./Ship";
import Shot from "./Shot";
import ShotResponse from "./ShotResponse";
import { CellStatus } from "./enums/CellStatus";
import { deepOrange } from "@mui/material/colors";

export default class IntelligenceField {
  public shots: Shot[] = [];
  public cells: Cell[][] = [];
  public constructor() {
    this.initCells();
  }

  public initCells() {
    for (let i = 0; i < 10; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 10; j++) {
        row.push({ X: i, Y: j, CellStatus: CellStatus.UNKNOWN });
      }
      this.cells.push(row);
    }
  }

  public getPotentialTargets() {
    const targets: Shot[] = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.cells[i][j].CellStatus === CellStatus.UNKNOWN) {
          targets.push({ x: j, y: i });
        }
      }
    }
    return targets;
  }

  public clear() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.cells[i][j].CellStatus = CellStatus.UNKNOWN;
        this.cells[i][j].Ship = undefined;
      }
    }
  }

  public renderShot(shotRes: ShotResponse): boolean | undefined {
    if (this.cells[shotRes.y][shotRes.x].CellStatus !== CellStatus.UNKNOWN) {
      return false;
    }
    switch (shotRes.cellStatus) {
      case CellStatus.MISSING:
        this.cells[shotRes.y][shotRes.x].CellStatus = CellStatus.MISSING;
        return true;
      case CellStatus.HIT: {
        this.cells[shotRes.y][shotRes.x].CellStatus = CellStatus.HIT;
        if (shotRes.desroyedShip !== undefined) {
          const ship = shotRes.desroyedShip;
          this.renderDestroyShip(shotRes.desroyedShip);
          this.addDestroyedShip(
            new Ship(ship.x, ship.y, ship.length, ship.direction)
          );
        }
        return true;
      }
    }
  }

  public addDestroyedShip(ship: Ship) {
    this.cells[ship.y][ship.x].Ship = ship;

    const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
    const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

    for (let i = 0; i < ship.Length; i++) {
      const x = ship.x + dx * i;
      const y = ship.y + dy * i;
      this.cells[y][x].CellStatus = CellStatus.DESTROYED_SHIP;
    }
  }

  public renderDestroyShip(ship: Ship) {
    if (ship.direction === ShipDirection.HORIZONTAL) {
      for (let y = ship.y - 1; y <= ship.y + 1; y++) {
        for (let x = ship.x - 1; x <= ship.x + ship.length; x++) {
          if (isValidCoordinates(x, y)) {
            if (this.cells[y][x].CellStatus === CellStatus.HIT) {
              continue;
            }
            this.cells[y][x].CellStatus = CellStatus.MISSING;
          }
        }
      }
    } else {
      for (let y = ship.y - 1; y <= ship.y + ship.length; y++) {
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
