import * as signalR from "@microsoft/signalr";
import Shot from "../models/Shot";
import ShotResponse from "../models/ShotResponse";
import { Player } from "../models/enums/Player";
const URL = "https://localhost:44306/battle"; //or whatever your backend port is

class Connector {
  private connection: signalR.HubConnection;

  public events: (
    onMessageReceived: (username: string, message: string) => void
  ) => void;

  public onReceiveSessionId: (onReceiveSessionId: (id: string) => void) => void;

  public onGameInfo: (onGameInfo: (id: string) => void) => void;

  public onSessionStart: (onSessionStart: (signal: boolean) => void) => void;

  public onBattleStart: (onBattleStart: (signal: Player) => void) => void;

  public onShot: (onShot: (x: number, y: number) => void) => void;

  public onShotResponse: (
    onShotResponse: (shotResponse: ShotResponse) => void
  ) => void;

  public onGiveUp: (onGiveUp: () => void) => void;

  static instance: Connector;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start().catch((err) => console.log(err));
    this.events = (onMessageReceived) => {
      this.connection.on("messageReceived", (username, message) => {
        onMessageReceived(username, message);
      });
    };
    this.onReceiveSessionId = (onReceiveSessionId) => {
      this.connection.on("receiveSessionId", (id) => {
        onReceiveSessionId(id);
      });
    };
    this.onGameInfo = (onGameInfo) => {
      this.connection.on("GameInfo", (session) => {
        onGameInfo(session);
      });
    };

    this.onSessionStart = (onSessionStart) => {
      this.connection.on("SessionStart", (session) => {
        onSessionStart(session);
      });
    };

    this.onBattleStart = (onBattleStart) => {
      this.connection.on("BattleStart", (session) => {
        onBattleStart(session);
      });
    };

    this.onShot = (onShot) => {
      this.connection.on("Shot", (x, y) => {
        onShot(x, y);
      });
    };
    this.onShotResponse = (onShotResponse) => {
      this.connection.on("ShotResponse", (session) => {
        onShotResponse(session);
      });
    };

    this.onGiveUp = (onGiveUp) => {
      this.connection.on("GiveUp", () => {
        onGiveUp();
      });
    };
  }

  public newMessage = (messages: string) => {
    this.connection
      .send("createSession", "foo", messages)
      .then((x) => console.log("thien", x));
  };

  public generateSession = (playerName: string) => {
    this.connection.invoke("createGameSession", playerName);
  };

  public cancelSession = (sessionId: string) => {
    this.connection
      .invoke("cancelGameSession", sessionId)
      .catch((e) => console.log(e));
  };

  public connectSession = (sessionId: string, playerName: string) => {
    this.connection
      .send("joinGameSession", sessionId, playerName)
      .catch((x) => console.log(x));
  };

  public ready = () => {
    if (localStorage.getItem("sessionId")) {
      this.connection
        .send("readyToBattle", localStorage.getItem("sessionId"))
        .catch((e) => console.log(e));
    }
  };

  public shot = (x: number, y: number) => {
    if (localStorage.getItem("sessionId")) {
      this.connection
        .send("makeShot", localStorage.getItem("sessionId"), x, y)
        .catch((x) => console.log(x));
    }
  };

  public sendShotResponse = (shot: ShotResponse) => {
    if (localStorage.getItem("sessionId")) {
      this.connection.send(
        "makeShotResponse",
        localStorage.getItem("sessionId"),
        shot
      );
    }
  };

  public giveUp = () => {
    if (localStorage.getItem("sessionId")) {
      this.connection.send("giveUp", localStorage.getItem("sessionId"));
    }
  };

  public static getInstance(): Connector {
    if (!Connector.instance) Connector.instance = new Connector();
    return Connector.instance;
  }
}

export default Connector.getInstance;
