import Ship from "./Ship";
import { CellStatus } from "./enums/CellStatus";

export type Cell = {
  X: number;
  Y: number;
  CellStatus: CellStatus;
  Ship?: Ship;
};

export enum HiddenCellStatus {
  Missing,
  Hitted,
  Destroy,
  Clear,
}
