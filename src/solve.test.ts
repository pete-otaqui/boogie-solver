import tape from "tape";

import { liftDice } from "./board";
import {
  findNextLetterCells,
  solve,
  wordIsVaguelyPossible,
  wordToDieFaces,
} from "./solve";
import { Path } from "./types";

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

tape("wordIsVaguelyPossible() should find possible words", t => {
  const result = wordIsVaguelyPossible("foo", ["f", "f", "o", "o"]);
  t.ok(result);
  t.end();
});

tape("wordIsVaguelyPossible() shouldn't find impossible words by letter", t => {
  const result = wordIsVaguelyPossible("bar", ["f", "f", "o", "o"]);
  t.notOk(result);
  t.end();
});

tape("wordIsVaguelyPossible() shouldn't find impossible words by number", t => {
  const result = wordIsVaguelyPossible("foo", ["f", "f", "o"]);
  t.notOk(result);
  t.end();
});

tape("findNextLetterCells() finds cells in a fresh board", t => {
  const path: Path = {
    letters: [],
    word: "foo",
  };
  const board = liftDice([["f", "o"], ["o", "f"]]);
  const nextCells = findNextLetterCells(path, board);
  t.equal(nextCells.length, 2);
  t.equal(nextCells[0].face, "f");
  t.equal(nextCells[1].face, "f");
  t.end();
});

tape("findNextLetterCells() finds cells from an initial path", t => {
  const path: Path = {
    letters: [{ face: "f", x: 0, y: 0 }],
    word: "foo",
  };
  const board = liftDice([["f", "o"], ["o", "f"]]);
  const nextCells = findNextLetterCells(path, board);
  t.equal(nextCells.length, 2);
  t.equal(nextCells[0].face, "o");
  t.equal(nextCells[1].face, "o");
  t.end();
});

// const words = ["foo", "bar", "baz", "eck"];

// tape("solve: finds a single word in a set of dice", t => {
//   const solutions = solve([["f", "o"], ["o", "z"]], words);
//   t.equal(solutions.length, 1);
//   t.equal(solutions[0], "foo");
//   t.end();
// });
