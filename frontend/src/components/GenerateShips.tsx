import { Button, Menu, MenuItem, Popover } from "@mui/material";
import React, { useState } from "react";
import { GenerateShipsType } from "../models/Field";
import Game from "../models/Game";

interface GenerateShipsProps {
  genClick: () => void;
  isHoldShip: boolean;
}

export default function GenerateShips({
  isHoldShip,
  genClick,
}: GenerateShipsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (type?: GenerateShipsType) => {
    if (type !== undefined) {
      Game().myField.generateShips(type);
    }
    genClick();
    setAnchorEl(null);
  };

  return (
    <div>
      <Button disabled={isHoldShip} variant="contained" onClick={handleClick}>
        Авторасстановка
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose(GenerateShipsType.RANDOM)}>
          Случайно
        </MenuItem>
        <MenuItem onClick={() => handleClose(GenerateShipsType.SHORES_1)}>
          Берега, вар.1
        </MenuItem>
        <MenuItem onClick={() => handleClose(GenerateShipsType.SHORES_2)}>
          Берега, вар.2
        </MenuItem>
        <MenuItem onClick={() => handleClose(GenerateShipsType.SHORES_3)}>
          Берега, вар.3
        </MenuItem>
        <MenuItem onClick={() => handleClose(GenerateShipsType.DIAGONALS)}>
          Диагонали
        </MenuItem>
        <MenuItem onClick={() => handleClose(GenerateShipsType.HALF_FIELD)}>
          Половина поля
        </MenuItem>
      </Popover>
    </div>
  );
}
