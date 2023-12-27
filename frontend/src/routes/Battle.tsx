import { useEffect, useState } from "react";
import Game, { GameMode } from "../models/Game";
import { Player } from "../models/enums/Player";
import Connector from "../socket";
import { CellStatus } from "../models/enums/CellStatus";
import ShotResponse from "../models/ShotResponse";
import Shot from "../models/Shot";
import { Box, Button, Card, Typography } from "@mui/material";
import BattleField from "../components/BattleField";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "./router";

export default function Battle() {
  const navigate = useNavigate();
  const game = Game();
  console.log(game);
  const { shot, onShot, onShotResponse, sendShotResponse, onGiveUp, giveUp } =
    Connector();
  const [click, setClick] = useState<boolean>();

  const [_, setShot] = useState<Shot>();
  const [__, setShotResponse] = useState<ShotResponse>();

  useEffect(() => {
    if (game.Mode === GameMode.Network) {
      onGiveUp(() => {
        game.winner = Player.Me;
        setClick(!click);
      });
    }
  });

  useEffect(() => {
    if (game.Mode === GameMode.Network) {
      onShot((x, y) => {
        if (
          game.myField.cells[y][x].CellStatus === CellStatus.UNKNOWN ||
          game.myField.cells[y][x].CellStatus === CellStatus.SHIP
        ) {
          const shotRes1 = game.takeShot({ x: x, y: y });
          console.log(shotRes1);
          onShotHanbler(shotRes1);
          sendShotResponse(shotRes1);
        }
        setShot({ x: x, y: y });
      });
    }
  });

  useEffect(() => {
    if (game.Mode === GameMode.Network) {
      onShotResponse((shotResponse) => {
        if (game.intelligenceField.renderShot(shotResponse)) {
          onShotResHandler(shotResponse);
        }
        setShotResponse(shotResponse);
      });
    }
  });

  function onShotHanbler(shotRes: ShotResponse) {
    if (shotRes.isWin === true) {
      game.winner = Player.Emeny;
    }
    if (shotRes.isWin === false) {
      game.winner = Player.Me;
    }
    if (shotRes.cellStatus === CellStatus.HIT) {
      game.whoseTurn = Player.Emeny;
    } else {
      game.whoseTurn = Player.Me;
    }
  }

  function onShotResHandler(shotRes: ShotResponse) {
    if (shotRes.isWin === true) {
      game.winner = Player.Me;
    }
    if (shotRes.isWin === false) {
      game.winner = Player.Emeny;
    }
    if (shotRes.cellStatus === CellStatus.HIT) {
      game.whoseTurn = Player.Me;
    } else {
      game.whoseTurn = Player.Emeny;
    }
  }

  const showWinner = (winner: Player | undefined) => {
    switch (winner) {
      case Player.Me:
        return "Вы победили!";
      case Player.Emeny:
        return "Вы проиграли!";
      case Player.Bot:
        return "Вы проиграли!";
      default:
        null;
    }
  };

  const move = (x: number, y: number) => {
    if (game.winner === undefined) {
      if (game.Mode === GameMode.Network) {
        if (game.whoseTurn === Player.Me) {
          if (
            game.intelligenceField
              .getPotentialTargets()
              .some((s) => s.x === x && s.y === y)
          ) {
            shot(x, y);
          }
        }
      } else {
        game.makeMove(x, y);
      }
    }
    setClick(!click);
  };

  return (
    <Card sx={{ p: 6, borderRadius: 3 }}>
      <Typography variant="h5" fontSize={35} align="center">
        {showWinner(game.winner)}
      </Typography>
      <Typography m={2} mb={3} fontSize={25} align="center">
        {game.winner === undefined &&
          (game.whoseTurn === Player.Me ? "Ваш ход" : "Противник ходит...")}
      </Typography>
      <Box display={"flex"} gap={10}>
        <BattleField
          signed={true}
          axisX={(n) => n + 1}
          axisY={(n) => "АБВГДЕЖЗИК"[n]}
          cells={game.myField.cells}
        />
        <BattleField
          signed={true}
          axisX={(n) => n + 1}
          axisY={(n) => "АБВГДЕЖЗИК"[n]}
          cells={game.intelligenceField.cells}
          onClick={(x, y) => {
            move(x, y);
          }}
          isEnemy={true}
        />
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            if (game.Mode === GameMode.Network && game.winner === undefined) {
              giveUp();
            }
            game.reset();
            navigate(RouteNames.SET_MODE);
          }}
        >
          {game.winner === undefined ? "Сдаться" : "Начать новую игру"}
        </Button>
      </Box>
    </Card>
  );
}
