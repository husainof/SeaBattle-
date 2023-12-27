import Ship3h from "../assets/pngwing-h.png";
import Ship3v from "../assets/pngwing-v.png";

type ShipIcon = {
  horizontal: { one: Img; two: Img; tree: Img; four: Img };
  vertical: { one: Img; two: Img; tree: Img; four: Img };
};
const shipIcon: ShipIcon = {
  horizontal: {
    one: {
      icon: Ship3h,
      width: 40,
      height: 35,
    },
    two: { icon: Ship3h, width: 80, height: 35 },
    tree: { icon: Ship3h, width: 120, height: 35 },
    four: { icon: Ship3h, width: 150, height: 40 },
  },
  vertical: {
    one: { icon: Ship3v, width: 35, height: 40 },
    two: { icon: Ship3v, width: 35, height: 80 },
    tree: { icon: Ship3v, width: 35, height: 120 },
    four: { icon: Ship3v, width: 40, height: 150 },
  },
};

export type Img = {
  icon: string;
  width: number;
  height: number;
};

export default class Ship {
  private id: number = Math.floor(Math.random() * 100000);
  public x: number;
  public y: number;
  public length: number;
  public direction: ShipDirection;
  private shipIcons: ShipIcon = shipIcon;
  public isDestroyed: boolean = false;
  public constructor(
    x: number,
    y: number,
    length: number,
    direction: ShipDirection
  ) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.direction = direction;
  }
  public get Icon(): Img | undefined {
    if (this.Direction == ShipDirection.HORIZONTAL) {
      switch (this.length) {
        case 1:
          return this.shipIcons.horizontal.one;
        case 2:
          return this.shipIcons.horizontal.two;
        case 3:
          return this.shipIcons.horizontal.tree;
        case 4:
          return this.shipIcons.horizontal.four;
        default:
          break;
      }
    } else {
      switch (this.length) {
        case 1:
          return this.shipIcons.vertical.one;
        case 2:
          return this.shipIcons.vertical.two;
        case 3:
          return this.shipIcons.vertical.tree;
        case 4:
          return this.shipIcons.vertical.four;
        default:
          break;
      }
    }
  }
  public get Direction(): ShipDirection {
    return this.direction;
  }
  public set Direction(direction: ShipDirection) {
    this.direction = direction;
  }
  public get Length(): number {
    return this.length;
  }
  public get Id(): number {
    return this.id;
  }
  public set X(x: number) {
    this.x = x;
  }
  public get X(): number {
    return this.x;
  }
  public set Y(y: number) {
    this.y = y;
  }
  public get Y(): number {
    return this.y;
  }
  public changeDirectionToVertical() {
    this.direction = ShipDirection.VERTICAL;
  }
  public changeDirectionToHorizontal() {
    this.direction = ShipDirection.HORIZONTAL;
  }
}

export enum ShipDirection {
  VERTICAL,
  HORIZONTAL,
}
