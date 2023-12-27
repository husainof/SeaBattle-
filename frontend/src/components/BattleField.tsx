import React from "react";
import CellComponent from "./CellComponent";
import styled from "styled-components";
import Game from "../models/Game";
import Cell from "../models/Cell";
import styles from "./style.module.css";
import { removeAllListeners } from "process";

const BattleFieldFieldStyle = styled.div`
  width: calc(40px * 10);
  height: calc(40px * 10);
  display: flex;
  flex-wrap: wrap;
  position: relative;
  margin: 1em;
`;

interface BattleFiledProps {
  onClick?: (x: number, y: number) => void;
  isEnemy?: boolean;
  cells: Cell[][];
  axisX: (n: number) => number;
  axisY: (n: number) => string;
  signed: boolean;
}

function BattleField({
  onClick,
  isEnemy,
  cells,
  axisX,
  axisY,
  signed,
}: BattleFiledProps) {
  return (
    <BattleFieldFieldStyle>
      {cells.map((row, y) => (
        <React.Fragment key={y}>
          {row.map((cell, x) => {
            let markerX = null;
            let markerY = null;
            if (signed) {
              if (x === 0) {
                markerX = (
                  <span className={styles.marker} style={{ left: `-40px` }}>
                    {axisX(y)}
                  </span>
                );
              }

              if (y === 0) {
                markerY = (
                  <span className={styles.marker} style={{ top: `-40px` }}>
                    {axisY(x)}
                  </span>
                );
              }
            }
            return (
              <div style={{ position: "relative" }}>
                {markerX}
                {markerY}
                <CellComponent
                  key={x}
                  onClick={() => {
                    if (onClick !== undefined) {
                      onClick(x, y);
                    }
                  }}
                  cell={cell}
                  isEnemy={isEnemy}
                />
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </BattleFieldFieldStyle>
  );
}

export default BattleField;
