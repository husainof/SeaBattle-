import Field from "./Field";
import Ship, { ShipDirection } from "./Ship";

export class Dock {
  private field: Field;
  constructor(field: Field) {
    this.field = field;
  }
  public shipsOneDesk() {
    return Array(
      4 - this.field.ships.filter((ship) => ship.Length === 1).length >= 0
        ? 4 - this.field.ships.filter((ship) => ship.Length === 1).length
        : 0
    ).fill(new Ship(0, 0, 1, ShipDirection.HORIZONTAL));
  }
  public shipsTwoDesk() {
    return Array(
      3 - this.field.ships.filter((ship) => ship.Length === 2).length >= 0
        ? 3 - this.field.ships.filter((ship) => ship.Length === 2).length
        : 0
    ).fill(new Ship(0, 0, 2, ShipDirection.HORIZONTAL));
  }
  public shipsThreeDesk() {
    return Array(
      2 - this.field.ships.filter((ship) => ship.Length === 3).length >= 0
        ? 2 - this.field.ships.filter((ship) => ship.Length === 3).length
        : 0
    ).fill(new Ship(0, 0, 3, ShipDirection.HORIZONTAL));
  }
  public shipsFourDesk() {
    return Array(
      1 - this.field.ships.filter((ship) => ship.Length === 4).length >= 0
        ? 1 - this.field.ships.filter((ship) => ship.Length === 4).length
        : 0
    ).fill(new Ship(0, 0, 4, ShipDirection.HORIZONTAL));
  }
  public isDockEmpty(): boolean {
    if (
      this.shipsOneDesk().length === 0 &&
      this.shipsTwoDesk().length === 0 &&
      this.shipsThreeDesk().length === 0 &&
      this.shipsFourDesk().length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }
}
