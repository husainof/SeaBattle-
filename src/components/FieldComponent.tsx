import React, { useState } from "react";
import CellComponent from "./CellComponent";
import styled from "styled-components";
import Ship from "../models/Ship";
import Game from "../models/Game";

const FieldStyle = styled.div`
  width: calc(40px * 10);
  height: calc(40px * 10);
  display: flex;
  flex-wrap: wrap;
`;

interface ShipProps {
  ship?: Ship;
  resetShip: () => void;
  selectShip: (ship: Ship) => void;
}

function FieldComponent({ ship, resetShip, selectShip }: ShipProps) {
  const game = Game();

  return (
    <FieldStyle>
      {game.myField.cells.map((row, y) => (
        <React.Fragment key={y}>
          {row.map((cell, x) => (
            <CellComponent
              onClick={() => {
                if (ship) {
                  game.myField.addShip(
                    new Ship(x, y, ship.Length, ship.Direction)
                  );
                  resetShip();
                }
              }}
              onSelectShip={selectShip}
              cell={cell}
            />
          ))}
        </React.Fragment>
      ))}
    </FieldStyle>
  );
}

export default FieldComponent;
