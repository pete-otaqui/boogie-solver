import { rollDice } from "./die";

import { Board, BoardCell, RolledDice } from "./types";

export function create(width: number, height: number): Board {
  const board: Board = {
    dice: rollDice(width, height),
    height,
    width,
  };
  return board;
}

export function liftDice(dice: RolledDice): Board {
  const width = dice[0].length;
  const height = dice.length;
  return {
    dice,
    height,
    width,
  };
}

export function cellIsInList(cell: BoardCell, list: BoardCell[]): boolean {
  return !!list.find(item => {
    return item.x === cell.x && item.y === cell.y;
  });
}

export function getAdjacentCells(
  board: Board,
  x: number,
  y: number,
  ignoreCells: BoardCell[],
): BoardCell[] {
  const adjacentCells: BoardCell[] = [];
  for (let y1 = y - 1; y1 <= y + 1; y1 += 1) {
    if (y1 < 0 || y1 >= board.height) {
      continue;
    }
    for (let x1 = x - 1; x1 <= x + 1; x1 += 1) {
      if (x1 < 0 || x1 >= board.width) {
        continue;
      }
      if (x1 === x && y1 === y) {
        continue;
      }
      const curCell: BoardCell = {
        face: board.dice[y1][x1],
        x: x1,
        y: y1,
      };
      if (cellIsInList(curCell, ignoreCells)) {
        continue;
      }
      adjacentCells.push(curCell);
    }
  }
  return adjacentCells;
}
