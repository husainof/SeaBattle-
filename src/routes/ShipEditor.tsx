import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Typography,
} from "@mui/material";

import FieldComponent from "../components/FieldComponent";
import Dock from "../components/Dock";
import Ship from "../models/Ship";
import DragabbleShip from "../components/DragabbleShip";
import Game, { GameMode } from "../models/Game";
import LoadField from "../components/LoadField";
import SaveFieldModal from "../components/SaveFieldModal";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "./router";
import GenerateShips from "../components/GenerateShips";
import Connector from "../socket";
import BASE_URL from "../serer";

function ShipEditor() {
  const game = Game();
  const { ready, onBattleStart } = Connector();
  const navigate = useNavigate();
  const [ship, setShip] = useState<Ship>();
  const [selectShip, setSelectShip] = useState<Ship>();
  const [genClick, setGenClick] = useState<boolean>();
  const [arr, setArr] = useState<any[]>();
  const isHoldShip = () => !!ship;

  const deleteShip = () => {
    const field = game.myField;
    if (selectShip) field.removeShip(selectShip.Id);
    setSelectShip(undefined);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const load = async () => {
      try {
        const response = await fetch(
          BASE_URL + `Arrangements?username=${username}`
        );

        if (response.ok) {
          const data = await response.json();
          setArr(data);
        } else {
          const error = await response.json();
          console.error("Ошибка при входе:", error.error);
          // Дополнительные действия по обработке ошибки входа
        }
      } catch (error) {
        console.error("Ошибка при входе:", error);
        // Дополнительные действия по обработке ошибки входа
      }
    };

    load();
  });

  useEffect(() => {
    onBattleStart((whoseTurn) => {
      game.whoseTurn = whoseTurn;
      navigate(RouteNames.BATTLE);
    });
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        // Обработка события клика на клавишу Esc
        console.log("Нажата клавиша Esc", ship);
        if (selectShip) {
          setSelectShip(undefined);
        }

        setShip(undefined);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [coord, setCoord] = useState({
    x: 0,
    y: 0,
  });

  const readyButton = () => {
    if (game.Mode === GameMode.Local) {
      game.intelligenceField.clear();
      game.createLevel();
      navigate(RouteNames.BATTLE);
    } else {
      game.createNetworkGame();
      ready();
    }
  };

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      {isHoldShip() ? (
        <DragabbleShip
          coord={coord}
          onHold={isHoldShip()}
          ship={ship}
          toVertical={() => {
            if (ship) {
              ship.changeDirectionToVertical();
            }
            setShip(ship);
          }}
          toHorizontal={() => {
            if (ship) {
              ship.changeDirectionToHorizontal();
            }
            setShip(ship);
          }}
        />
      ) : null}
      <Container>
        <Typography fontSize={30} variant="h4" align={"center"}>
          Подготовка в бою
        </Typography>

        <Box sx={{ p: 2, display: "flex", gap: 2 }}>
          <Box sx={{}}>
            <FieldComponent
              ship={ship}
              selectShip={(ship: Ship) => setSelectShip(ship)}
              resetShip={() => setShip(undefined)}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography fontSize={20}>Доступные корабли</Typography>
              <Dock
                setClick={(x, y) => setCoord({ x, y })}
                tShip={ship}
                setShip={setShip}
              />
            </Box>
            <Button
              disabled={isHoldShip() || !selectShip}
              variant="contained"
              onClick={() => deleteShip()}
            >
              Удалить выбранный корабль
            </Button>
            <Button
              disabled={isHoldShip() || !game.dock.isDockEmpty()}
              variant="contained"
              onClick={handleOpenModal}
            >
              Сохранить расстановку
            </Button>
            <SaveFieldModal open={openModal} onClose={handleCloseModal} />
            <LoadField
              setClick={() => setGenClick(!genClick)}
              arr={arr}
              isHoldShip={isHoldShip()}
            />
            <GenerateShips
              genClick={() => setGenClick(!genClick)}
              isHoldShip={isHoldShip()}
            />
            <Divider />
            <Button
              disabled={isHoldShip() || !game.dock.isDockEmpty()}
              variant="contained"
              onClick={() => readyButton()}
            >
              Готов
            </Button>
          </Box>
        </Box>
      </Container>
    </Card>
  );
}

export default ShipEditor;
