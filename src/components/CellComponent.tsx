import { FC } from "react";
import styled from "styled-components";
import Ship, { ShipDirection } from "../models/Ship";

import hittedIcon from "../assets/hitted.png";
import fireIcon from "../assets/fire.png";
import missIcon from "../assets/missing.png";
import { Cell } from "../models/Cell";
import { CellStatus } from "../models/enums/CellStatus";

const CellStyle = styled.div<{ isRow?: boolean }>`
  height: 40px;
  width: 40px;
  border: 0.5px solid black;
  display: flex;
  flex-direction: ${(p) => (p.isRow ? "column" : "row")};
  position: relative;
`;

interface CellProps {
  cell: Cell;
  onClick: () => void;
  onSelectShip?: (ship: Ship) => void;
  isEnemy?: boolean;
}

const CellComponent: FC<CellProps> = ({
  cell,
  onClick,
  onSelectShip,
  isEnemy,
}) => {
  const ship = cell?.Ship;
  if (isEnemy) {
    return (
      <CellStyle onClick={() => onClick()}>
        {cell.CellStatus == CellStatus.DESTROYED_SHIP && cell.Ship ? (
          <img
            height={ship?.Icon?.height}
            width={ship?.Icon?.width}
            src={cell.Ship.Icon?.icon}
            style={{
              margin: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
            }}
            onClick={() => {
              cell.Ship && onSelectShip && onSelectShip(cell.Ship);
            }}
          />
        ) : null}

        {cell.CellStatus === CellStatus.DESTROYED_SHIP ? (
          <img
            width={25}
            style={{
              margin: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 11,
            }}
            src={fireIcon}
          />
        ) : null}

        {cell.CellStatus === CellStatus.DESTROYED_SHIP && cell.Ship ? (
          <>
            <img
              height={ship?.Icon?.height}
              width={ship?.Icon?.width}
              src={cell.Ship.Icon?.icon}
              style={{
                margin: "auto",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
              onClick={() => {
                cell.Ship && onSelectShip && onSelectShip(cell.Ship);
              }}
            />
            <img
              width={25}
              style={{
                margin: "auto",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 11,
              }}
              src={fireIcon}
            />
          </>
        ) : null}

        {cell.CellStatus === CellStatus.HIT ? (
          <img width={38} height={38} src={hittedIcon} />
        ) : null}
        {cell.CellStatus === CellStatus.MISSING ? (
          <img
            style={{ margin: "auto" }}
            width={25}
            height={25}
            src={missIcon}
          />
        ) : null}
      </CellStyle>
    );
  }

  return (
    <CellStyle
      isRow={ship?.Direction === ShipDirection.HORIZONTAL}
      onClick={() => onClick()}
    >
      {cell.CellStatus == CellStatus.SHIP && cell.Ship ? (
        <img
          height={ship?.Icon?.height}
          width={ship?.Icon?.width}
          src={cell.Ship.Icon?.icon}
          style={{
            margin: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
          }}
          onClick={() => {
            cell.Ship && onSelectShip && onSelectShip(cell.Ship);
          }}
        />
      ) : null}

      {cell.CellStatus === CellStatus.HIT ? (
        <img
          width={25}
          style={{
            margin: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 11,
          }}
          src={fireIcon}
        />
      ) : null}

      {cell.CellStatus === CellStatus.HIT && cell.Ship ? (
        <>
          <img
            height={ship?.Icon?.height}
            width={ship?.Icon?.width}
            src={cell.Ship.Icon?.icon}
            style={{
              margin: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
            }}
            onClick={() => {
              cell.Ship && onSelectShip && onSelectShip(cell.Ship);
            }}
          />
          <img
            width={25}
            style={{
              margin: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 11,
            }}
            src={fireIcon}
          />
        </>
      ) : null}

      {cell.CellStatus === CellStatus.MISSING ? (
        <img style={{ margin: "auto" }} width={25} height={25} src={missIcon} />
      ) : null}
    </CellStyle>
  );
};

export default CellComponent;
