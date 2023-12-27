//import { Button } from "./About";

import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "./router";
import Game, { GameMode } from "../models/Game";

function SelectMode() {
  const navigate = useNavigate();

  function onClick(mode: GameMode) {
    Game().Mode = mode;
    if (mode === GameMode.Network) {
      navigate(RouteNames.GEN_NET_GAME);
    } else {
      navigate(RouteNames.SET_LEVEL);
    }
  }

  return (
    <>
      <h1>Выберите режим игры</h1>
      <Button variant="contained" onClick={() => onClick(GameMode.Local)}>
        Одиночный
      </Button>
      <Button variant="contained" onClick={() => onClick(GameMode.Network)}>
        Против игрока
      </Button>
    </>
  );
}

export default SelectMode;
