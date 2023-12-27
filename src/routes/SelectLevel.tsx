import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Game, { Level } from "../models/Game";
import { RouteNames } from "./router";

function SelectLevel() {
  const navigate = useNavigate();

  function onClickHandler(level: Level): void {
    Game().Level = level;
    navigate(RouteNames.EDIT);
  }
  return (
    <>
      <h1>Выберите уровень сложности</h1>
      <Button variant="contained" onClick={() => onClickHandler(Level.Low)}>
        Низкий
      </Button>
      <Button variant="contained" onClick={() => onClickHandler(Level.Medium)}>
        Нормальный
      </Button>
      <Button variant="contained" onClick={() => onClickHandler(Level.Hard)}>
        Сложный
      </Button>
    </>
  );
}

export default SelectLevel;
