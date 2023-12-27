import Field, { GenerateShipsType } from "./Field";
import { Player } from "./enums/Player";
import Ship from "./Ship";
import { Dock } from "./Dock";
import IntelligenceField from "./IntelligenceField";
import Shot from "./Shot";
import { Bot, CombatStrategyType } from "./Bot";
import { CellStatus } from "./enums/CellStatus";

class Game {
  private static instance: Game;
  private mode: GameMode = GameMode.Local;
  private method: NetworkMethod = NetworkMethod.Connect;
  private level: Level = Level.Low;

  public winner?: Player;

  public whoseTurn: Player = Player.Me;

  private enemyShips?: Ship[];

  public enemyField: Field = new Field();

  private myShips?: Ship[];

  public myField: Field = new Field();

  public intelligenceField: IntelligenceField = new IntelligenceField();

  public dock: Dock = new Dock(this.myField);

  public enemyBot = new Bot(this.myField);

  private constructor() {}

  public set Mode(mode: GameMode) {
    this.mode = mode;
  }

  public get Mode(): GameMode {
    return this.mode;
  }

  public set Level(level: Level) {
    this.level = level;
  }

  public get Level(): Level {
    return this.level;
  }

  public set Method(level: NetworkMethod) {
    this.method = level;
  }

  public get Method(): NetworkMethod {
    return this.method;
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public takeShot(shot: Shot) {
    const shotRes = this.myField.takeShot(shot);
    return shotRes;
  }

  public makeMove(x: number, y: number) {
    if (
      !this.intelligenceField
        .getPotentialTargets()
        .some((s) => s.x === x && s.y === y)
    ) {
      return;
    }
    let shotRes = this.enemyBot.takeShot({ x, y });

    this.intelligenceField.renderShot(shotRes);

    if (shotRes.isWin === true) {
      this.winner = Player.Me;
      return;
    }

    if (shotRes.cellStatus === CellStatus.HIT) {
      return;
    }

    let shot = this.enemyBot.doShot();
    shotRes = this.myField.takeShot(shot);
    if (shotRes !== undefined) {
      while (shotRes.cellStatus === CellStatus.HIT) {
        if (shotRes.isWin === true) {
          this.winner = Player.Bot;
          return;
        }

        shot = this.enemyBot.doShot(shotRes);
        shotRes = this.myField.takeShot(shot);
      }
    }
  }

  public reset() {
    this.winner = undefined;

    this.whoseTurn = Player.Me;

    this.myField.clear();

    this.enemyBot.field.clear();
    this.enemyBot.potentialByStrategy = [];

    this.intelligenceField.clear();
  }

  public createNetworkGame() {
    this.mode = GameMode.Network;
  }

  public createLevel() {
    switch (this.level) {
      case Level.Low: {
        this.enemyBot.field.generateShips(GenerateShipsType.SHORES_1);
        this.enemyBot.setСombatStrategy(CombatStrategyType.CHESS);
        return;
      }
      case Level.Medium: {
        this.enemyBot.field.generateShips(GenerateShipsType.DIAGONALS);
        this.enemyBot.setСombatStrategy(CombatStrategyType.LOCATOR);
        return;
      }
      case Level.Hard: {
        this.enemyBot.field.generateShips(GenerateShipsType.HALF_FIELD);
        this.enemyBot.setСombatStrategy(CombatStrategyType.GOOSE_FEETS);
        return;
      }
    }
  }
}

export default Game.getInstance;

export enum GameMode {
  Local,
  Network,
}

export enum NetworkMethod {
  Generate,
  Connect,
}

export enum Level {
  Low,
  Medium,
  Hard,
}
