import { isValidCoordinates } from "../heplers/additionals";
import { Cell } from "./Cell";
import Field, { GenerateShipsType } from "./Field";
import Ship, { ShipDirection } from "./Ship";
import Shot from "./Shot";
import ShotResponse from "./ShotResponse";
import { CellStatus } from "./enums/CellStatus";

export class Bot {
  public field: Field = new Field();
  private myField: Field;
  private potentialTargets: Shot[] = [];
  public potentialByStrategy: Shot[] = [];
  private hitsShip: Shot[] = [];
  private directionShip?: ShipDirection;

  constructor(myField: Field) {
    this.myField = myField;
    this.field.generateShips(GenerateShipsType.RANDOM);
  }

  public doShot(shotRes?: ShotResponse): Shot {
    if (shotRes === undefined) {
      if (this.potentialTargets.length !== 0) {
        console.log(this.potentialTargets);
        return this.potentialTargets.pop();
      }
      return this.getShot();
    } else {
      if (shotRes.desroyedShip === undefined) {
        this.hitsShip.push({ x: shotRes.x, y: shotRes.y });
        this.updateCellSurroundings(shotRes);
        console.log(this.potentialTargets);
        return this.potentialTargets.pop();
      } else {
        this.hitsShip = [];
        this.potentialTargets = [];
        return this.getShot();
      }
    }
  }

  public setСombatStrategy(type: CombatStrategyType) {
    switch (type) {
      case CombatStrategyType.CHESS: {
        for (let r = 0; r < 10; r++) {
          for (let c = 0; c < 10; c++) {
            if ((r + c) % 2 === 0) {
              this.potentialByStrategy.push({ x: c, y: r });
            }
          }
        }
        break;
      }

      case CombatStrategyType.LOCATOR: {
        const coords: Shot[] = [
          { x: 0, y: 0 },
          { x: 0, y: 6 },
          { x: 6, y: 6 },
          { x: 6, y: 0 },
        ];

        coords.forEach((s) => {
          for (let i = 0; i < 4; i++) {
            const row = s.y + i;
            const col = s.x + i;
            this.potentialByStrategy.push({ x: col, y: row });

            const oppositeRow = s.y + i;
            const oppositeCol = s.x + 3 - i;

            this.potentialByStrategy.push({ x: oppositeCol, y: oppositeRow });
          }
        });
        break;
      }

      case CombatStrategyType.GOOSE_FEETS: {
        const coords1: Shot[] = [
          { x: 3, y: 0 },
          { x: 2, y: 1 },
          { x: 0, y: 2 },
          { x: 1, y: 3 },
        ];

        coords1.map((c) => {
          this.potentialByStrategy.push({ x: c.x, y: c.y });
        });
        coords1.map((c) => {
          c.x += 4;
          this.potentialByStrategy.push({ x: c.x, y: c.y });
        });
        coords1.map((c) => {
          c.y += 4;
          this.potentialByStrategy.push({ x: c.x, y: c.y });
        });
        coords1.map((c) => {
          c.y += 4;
          c.x += 4;
          this.potentialByStrategy.push({ x: c.x, y: c.y });
        });

        this.potentialByStrategy.push({ x: 2, y: 9 });
        this.potentialByStrategy.push({ x: 3, y: 8 });

        this.potentialByStrategy.push({ x: 8, y: 2 });
        this.potentialByStrategy.push({ x: 9, y: 3 });

        this.potentialByStrategy.push({ x: 8, y: 6 });
        this.potentialByStrategy.push({ x: 9, y: 7 });

        break;
      }

      default:
        break;
    }
  }

  public getCellSurroundings(x: number, y: number): Cell[] {
    const cells = this.myField.cells;

    return [
      ...[
        cells[y + 1]?.[x],
        cells[y - 1]?.[x],
        cells[y]?.[x + 1],
        cells[y]?.[x - 1],
      ].filter((cell) => cell && cell.CellStatus !== CellStatus.MISSING),
    ];
  }

  public updateCellSurroundings(shotRes: ShotResponse) {
    const surr = this.getCellSurroundings(shotRes.x, shotRes.y);

    if (surr.filter((cell) => this.isHitCell(cell)).length > 0) {
      this.potentialTargets = [];
      if (this.hitsShip.length === 2) {
        this.directionShip = this.getDirectionHits(
          this.hitsShip[0],
          this.hitsShip[1]
        );
        console.log("2 hits");
      }
      if (this.directionShip === ShipDirection.HORIZONTAL) {
        const sortHits = [...this.hitsShip].sort((a, b) => a.x - b.x);
        const minHit = sortHits[0];
        const maxHit = sortHits[sortHits.length - 1];

        if (this.checkShot(minHit.x - 1, minHit.y)) {
          this.potentialTargets.push({ x: minHit.x - 1, y: minHit.y });
        }

        if (this.checkShot(maxHit.x + 1, maxHit.y)) {
          this.potentialTargets.push({ x: maxHit.x + 1, y: maxHit.y });
        }
      }

      if (this.directionShip === ShipDirection.VERTICAL) {
        const sortHits = [...this.hitsShip].sort((a, b) => a.y - b.y);
        const minHit = sortHits[0];
        const maxHit = sortHits[sortHits.length - 1];
        if (this.checkShot(minHit.x, minHit.y - 1)) {
          this.potentialTargets.push({ x: minHit.x, y: minHit.y - 1 });
        }
        if (this.checkShot(maxHit.x, maxHit.y + 1)) {
          this.potentialTargets.push({ x: maxHit.x, y: maxHit.y + 1 });
        }
      }

      console.log("targets", this.potentialTargets);
    } else {
      for (const cell of surr) {
        if (this.checkShot(cell.X, cell.Y)) {
          this.potentialTargets.push({ x: cell.X, y: cell.Y });
        }
      }
    }
  }

  public checkShot(x: number, y: number) {
    const targets = this.myField.getPotentialTargets();

    if (
      targets.some((s) => s.x === x && s.y === y) &&
      (this.myField.cells[y][x].CellStatus === CellStatus.UNKNOWN ||
        this.myField.cells[y][x].CellStatus === CellStatus.SHIP)
    ) {
      return true;
    }
    return false;
  }

  public getDirectionHits(prevCell: Shot, tempCell: Shot): ShipDirection {
    return prevCell.y === tempCell.y
      ? ShipDirection.HORIZONTAL
      : ShipDirection.VERTICAL;
  }

  public isUnkownCell(cell: Cell): boolean {
    if (cell.CellStatus === CellStatus.UNKNOWN) {
      return true;
    }
    return false;
  }

  public isHitCell(cell: Cell): boolean {
    if (cell.CellStatus === CellStatus.HIT) {
      return true;
    }
    return false;
  }

  public getShot(): Shot {
    let shot: Shot;
    const targets = this.myField.getPotentialTargets();
    do {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);

      if (this.potentialByStrategy.length === 0) {
        shot = { x: x, y: y };
      } else {
        shot = this.potentialByStrategy.shift();
      }
    } while (!targets.some((s) => s.x === shot.x && s.y === shot.y));

    return shot;
  }

  public takeShot(shot: Shot): ShotResponse {
    return this.field.takeShot(shot);
  }
}

export enum CombatStrategyType {
  CHESS,
  LOCATOR,
  GOOSE_FEETS,
}
