import tape from "tape";

import { create, liftDice } from "./board";
import { RolledDice } from "./types";

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
