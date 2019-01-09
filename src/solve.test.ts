import tape from "tape";

import { liftDice } from "./board";
import {
  findNextLetterCells,
  searchForWord,
  searchForWords,
  solve,
  wordIsVaguelyPossible,
  wordToDieFaces,
} from "./solve";
import { Path, RolledDice, Solution } from "./types";

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

tape("wordIsVaguelyPossible() should throw with no word length", t => {
  t.plan(1);
  try {
    wordIsVaguelyPossible("", []);
  } catch (e) {
    t.ok(e instanceof RangeError);
  }
  t.end();
});

tape("findNextLetterCells() finds cells in a fresh board", t => {
  const path: Path = {
    faces: wordToDieFaces("foo"),
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
    faces: wordToDieFaces("foo"),
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

tape("findNextLetterCells() should throw for an invalid length", t => {
  t.plan(1);
  const path: Path = {
    faces: wordToDieFaces("foo"),
    letters: [
      { face: "f", x: 0, y: 0 },
      { face: "o", x: 0, y: 1 },
      { face: "o", x: 1, y: 1 },
    ],
    word: "foo",
  };
  const board = liftDice([["f", "o"], ["o", "f"]]);
  try {
    findNextLetterCells(path, board);
  } catch (e) {
    t.ok(e instanceof RangeError);
  }
  t.end();
});

tape("findNextLetterCells() finds qu cells in a fresh board", t => {
  const path: Path = {
    faces: wordToDieFaces("quiz"),
    letters: [],
    word: "quick",
  };
  const board = liftDice([["qu", "i", "z"]]);
  const nextCells = findNextLetterCells(path, board);
  t.equal(nextCells.length, 1);
  t.equal(nextCells[0].face, "qu");
  t.end();
});

tape("searchForWord() finds a single path word in a board", t => {
  const word = "bar";
  const board = liftDice([["b", "a"], ["r", "f"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 1);
  t.end();
});

tape("searchForWord() finds multiple paths for a word in a board", t => {
  const word = "foo";
  const board = liftDice([["f", "o"], ["o", "f"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 4);
  t.end();
});

tape("searchForWord() finds a single path word with multiple starts", t => {
  const word = "bar";
  const board = liftDice([["b", "a"], ["r", "f"], ["r", "f"], ["r", "b"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 1);
  t.end();
});

tape("searchForWord() finds multiple path word with multiple starts", t => {
  const word = "bar";
  const board = liftDice([["b", "a"], ["r", "f"], ["r", "a"], ["r", "b"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 4);
  t.end();
});

tape("searchForWord() finds nothing for an impossible word", t => {
  const word = "sun";
  const board = liftDice([["b", "a"], ["r", "f"], ["r", "f"], ["r", "b"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 0);
  t.end();
});

tape("searchForWord() finds a single qu path word in a board", t => {
  const word = "quiz";
  const board = liftDice([["qu", "i", "z"]]);
  const paths = searchForWord(word, board);
  t.equal(paths.length, 1);
  t.end();
});

tape("searchForWords(): finds a single word in a board", async t => {
  const board = liftDice([["f", "o"], ["o", "z"]]);
  const words = ["foo", "bar", "baz", "eck"];
  const paths: Path[] = await searchForWords(words, board);
  t.equal(paths.length, 2);
  t.equal(paths[0].word, "foo");
  t.equal(paths[1].word, "foo");
  t.end();
});

tape("searchForWords(): finds multiple words in a board", async t => {
  const board = liftDice([["b", "a"], ["r", "z"]]);
  const words = ["foo", "bar", "baz", "eck"];
  const paths: Path[] = await searchForWords(words, board);
  t.equal(paths.length, 2);
  // check we found the right thing, order-independently
  const foundWords = paths.map(p => p.word);
  t.ok(foundWords.includes("bar"));
  t.ok(foundWords.includes("baz"));
  t.end();
});

tape("solve(): finds a single word in a board", async t => {
  const dice: RolledDice = [["b", "a"], ["r", "k"]];
  const words = ["foo", "bar", "baz", "eck"];
  const solution: Solution = await solve(dice, words);
  t.equal(solution.words.length, 1);
  t.equal(solution.words[0], "bar");
  t.end();
});

tape("solve(): uses sowpods by default", async t => {
  const dice: RolledDice = [["b", "a"], ["r", "z"]];
  const solution: Solution = await solve(dice);
  const expectedWords = ["ab", "ar", "arb", "ba", "bar", "bra", "za"];
  t.equal(solution.words.length, expectedWords.length);
  expectedWords.forEach(word => {
    t.ok(solution.words.includes(word));
  });
  t.end();
});

tape("solve(): finds qu dice", async t => {
  const dice: RolledDice = [["qu", "i"], ["k", "z"]];
  const solution: Solution = await solve(dice);
  const expectedWords = ["quiz", "ki"];
  t.equal(solution.words.length, expectedWords.length);
  expectedWords.forEach(word => {
    t.ok(solution.words.includes(word));
  });
  t.end();
});
