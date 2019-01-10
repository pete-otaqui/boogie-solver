import tape from "tape";

import { getDiceForBoardSize, rollDice, wordToDieFaces } from "./die";

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
tape("wordToDieFaces() should get a set of die faces", t => {
  const faces = wordToDieFaces("bar");
  t.equal(faces.length, 3);
  t.equal(faces[0] as string, "b");
  t.equal(faces[1] as string, "a");
  t.equal(faces[2] as string, "r");
  t.end();
});
tape("wordToDieFaces() should collect q and u together", t => {
  const faces = wordToDieFaces("queue");
  t.equal(faces.length, 4);
  t.equal(faces[0] as string, "qu");
  t.equal(faces[1] as string, "e");
  t.equal(faces[2] as string, "u");
  t.equal(faces[3] as string, "e");
  t.end();
});

tape("wordToDieFaces() should allow ending q letters", t => {
  const faces = wordToDieFaces("banq");
  t.equal(faces.length, 4);
  t.equal(faces[0] as string, "b");
  t.equal(faces[1] as string, "a");
  t.equal(faces[2] as string, "n");
  t.equal(faces[3] as string, "q");
  t.end();
});

tape("wordToDieFaces() should allow q without u letters", t => {
  const faces = wordToDieFaces("cinqfoil");
  t.equal(faces.length, 8);
  t.equal(faces[0] as string, "c");
  t.equal(faces[1] as string, "i");
  t.equal(faces[2] as string, "n");
  t.equal(faces[3] as string, "q");
  t.equal(faces[4] as string, "f");
  t.equal(faces[5] as string, "o");
  t.equal(faces[6] as string, "i");
  t.equal(faces[7] as string, "l");
  t.end();
});
