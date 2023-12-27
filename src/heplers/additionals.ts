// Вспомогательные функции.

import Ship, { ShipDirection } from "../models/Ship";

// Функция проверяет координаты на валидность.
export const isValidCoordinates = (x: number, y: number) =>
  0 <= x && x < 10 && 0 <= y && y < 10;

// Функция возвращает стандартный набор кораблей.
export const getDefaultShips = (): Ship[] => [
  /*
		placed - флаг, который показывает, стоит ли корабль на игровом поле.
		Если он false, значит корабль ещё в доке.
	*/
  new Ship(0, 0, 4, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 3, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 3, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 2, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 2, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 2, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 1, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 1, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 1, ShipDirection.HORIZONTAL),
  new Ship(0, 0, 1, ShipDirection.HORIZONTAL),
];

/*
	Функция определяет допустимо ли принятое расположение кораблей.
	Принимает массив кораблей.
*/
export const isNormalPosition = (ships: Ship[]) => {
  /*
		Вспомогательная матрица.
		Если в ячейку нельзя ставить корабль, записываем в неё 1.
	*/
  const matrix = Array(10)
    .fill(0)
    .map(() => Array(10).fill(0));

  if (ships.length === 0) return true;

  for (const ship of ships) {
    const dx = ship.Direction === ShipDirection.HORIZONTAL ? 1 : 0;
    const dy = ship.Direction === ShipDirection.VERTICAL ? 1 : 0;

    for (let i = 0; i < ship.Length; i++) {
      const x = ship.x + dx * i;
      const y = ship.y + dy * i;
      if (!isValidCoordinates(x, y) || matrix[y][x]) {
        return false;
      }
    }

    if (ship.Direction === ShipDirection.HORIZONTAL) {
      for (let y = ship.y - 1; y <= ship.y + 1; y++) {
        for (let x = ship.x - 1; x <= ship.x + ship.Length; x++) {
          if (isValidCoordinates(x, y)) {
            matrix[y][x] = 1;
          }
        }
      }
    } else {
      for (let y = ship.y - 1; y <= ship.y + ship.Length; y++) {
        for (let x = ship.x - 1; x <= ship.x + 1; x++) {
          if (isValidCoordinates(x, y)) {
            matrix[y][x] = 1;
          }
        }
      }
    }
  }

  return true;
};

// Функция выставляет корабли случайным образом.
export const randomize = () => {
  const ships = getDefaultShips();

  for (let i = 0; i < 100000; i++) {
    for (const ship of ships) {
      ship.x = Math.floor(Math.random() * 10);
      ship.y = Math.floor(Math.random() * 10);
      ship.Direction = Math.floor(Math.random() * 2);
    }

    if (isNormalPosition(ships)) {
      return ships;
    }
  }

  return getDefaultShips();
};
