import tape from "tape";

import { getDiceForBoardSize, rollDice } from "./die";

tape("Die: getDiceForBoardSize() gets dice", t => {
  const dice = getDiceForBoardSize(16);
  t.equal(dice.length, 16);
  t.end();
});

tape("Die: rollDice() sorts into rows", t => {
  const height = 3;
  const width = 2;
  const dice = rollDice(width, height);
  // First level is an array of rows, should have `height` length
  t.equal(dice.length, height);
  // Each item in the second level is a row, should have `width` length
  t.equal(dice[0].length, width);
  t.end();
});
