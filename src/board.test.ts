import tape from "tape";

import { Board, BoardCell, RolledDice } from "./types";

import { cellIsInList, create, getAdjacentCells, liftDice } from "./board";

tape("Board: create() should create a board", t => {
  const board = create(3, 2);
  t.equal(board.dice.length, 2);
  t.equal(board.dice[0].length, 3);
  t.end();
});

tape("Board: liftDice() should turn a set of rolled dice into a board", t => {
  const dice: RolledDice = [["a", "b"], ["a", "b"], ["a", "b"]];
  const board = liftDice(dice);
  t.equal(board.width, 2);
  t.equal(board.height, 3);
  t.end();
});

tape("Board: cellIsInList() should return true if required", t => {
  const cell: BoardCell = { face: "a", x: 1, y: 2 };
  const list: BoardCell[] = [
    { face: "b", x: 2, y: 2 },
    { face: "a", x: 2, y: 3 },
    { face: "a", x: 1, y: 2 },
    { face: "b", x: 1, y: 1 },
  ];
  const result = cellIsInList(cell, list);
  t.ok(result);
  t.end();
});

tape("Board: getAdjacentCells() should return max 8 cells", t => {
  const board: Board = create(3, 3);
  const adjacentCells = getAdjacentCells(board, 1, 1, []);
  t.equal(adjacentCells.length, 8);
  t.end();
});

tape("Board: getAdjacentCells() ignore stuff beyond top left", t => {
  const board: Board = create(3, 3);
  const adjacentCells = getAdjacentCells(board, 0, 0, []);
  t.equal(adjacentCells.length, 3);
  t.end();
});

tape("Board: getAdjacentCells() ignore stuff beyond bottom right", t => {
  const board: Board = create(3, 3);
  const adjacentCells = getAdjacentCells(board, 2, 2, []);
  t.equal(adjacentCells.length, 3);
  t.end();
});

tape("Board: getAdjacentCells() should ignore a provided list", t => {
  const board: Board = create(3, 3);
  const list: BoardCell[] = [
    { face: "a", x: 0, y: 0 },
    { face: "a", x: 0, y: 1 },
    { face: "a", x: 0, y: 2 },
  ];
  const adjacentCells = getAdjacentCells(board, 1, 1, list);
  t.equal(adjacentCells.length, 5);
  t.end();
});
