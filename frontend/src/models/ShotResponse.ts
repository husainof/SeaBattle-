import Ship from "./Ship";
import { CellStatus } from "./enums/CellStatus";

export default interface ShotResponse {
  x: number;
  y: number;
  cellStatus: CellStatus;
  isWin?: boolean;
  desroyedShip?: Ship;
}
