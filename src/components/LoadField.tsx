import { Button, Menu, MenuItem, Popover } from "@mui/material";
import React, { useState } from "react";
import Ship from "../models/Ship";
import Game from "../models/Game";

interface LoadFieldProps {
  setClick: () => void;
  arr?: any[];
  isHoldShip: boolean;
}

export default function LoadField({
  isHoldShip,
  arr,
  setClick,
}: LoadFieldProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (a: any) => {
    if (a) {
      const ships: Ship[] = a.ships.map(
        (ship) => new Ship(ship.x, ship.y, ship.length, ship.direction)
      );

      Game().myField.applayShips(ships);
    }

    setClick();
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [anchorEl]);

  return (
    <div>
      <Button disabled={isHoldShip} variant="contained" onClick={handleClick}>
        Загрузить расстановку
      </Button>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {arr?.length ? (
          arr.map((a) => (
            <MenuItem onClick={() => handleClose(a)}>
              {a.title ?? "Без названия"}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>Сохраненных расстановок нет</MenuItem>
        )}
      </Popover>
    </div>
  );
}
