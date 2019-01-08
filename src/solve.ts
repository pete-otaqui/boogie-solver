import { getAdjacentCells, liftDice } from "./board";
import { Board, BoardCell, DieFace, Path, RolledDice } from "./types";
import sowpods from "./word-lists/sowpods.json";

export function solve(
  dice: RolledDice,
  words: string[] = sowpods.words,
): Path[] {
  const board: Board = liftDice(dice);
  const paths = [];
  const path: Path = {
    letters: [],
    word: words[0],
  };
  return [];
}

export function findNextLetterCells(path: Path, board: Board): BoardCell[] {
  if (path.letters.length > path.word.length - 1) {
    throw new RangeError("Finding next letter after completion");
  }
  const nextLetter = path.word[path.letters.length];
  let possibleCells;
  if (path.letters.length === 0) {
    // at start, can pick anywhere
    possibleCells = board.cells;
  } else {
    // get cells adjacent to last one in path
    const lastCell = path.letters[path.letters.length - 1];
    possibleCells = getAdjacentCells(
      board,
      lastCell.x,
      lastCell.y,
      path.letters,
    );
  }
  return possibleCells.filter((cell: BoardCell) => {
    return cell.face === nextLetter;
  });
}

export function wordToDieFaces(word: string): DieFace[] {
  const faces: DieFace[] = [];
  let i = 0;
  while (i < word.length) {
    let letter = word[i];
    // @TODO this should be generic and automatically sort through the dice
    // specified.  Maybe some sets have a standalone "q", maybe others have a
    // different multi-letter face
    if (letter === "q" && i < word.length - 1) {
      if (word[i + 1] === "u") {
        letter = "qu";
        i += 1;
      }
    }
    faces.push(letter as DieFace);
    i += 1;
  }
  return faces;
}

export function wordIsVaguelyPossible(
  word: string,
  letters: DieFace[],
): boolean {
  if (!word.length) {
    throw new RangeError("Empty word provided");
  }
  const letterString = letters.join("");
  const wordLetters = word.split("").sort();
  let lastLetter = wordLetters[0];
  let letterCount = 0;
  let matches = letterString.match(new RegExp(lastLetter, "g"));
  for (let i = 0, max = wordLetters.length; i < max; i += 1) {
    const letter = wordLetters[i];
    // quick bail
    if (letters.indexOf(letter as DieFace) === -1) {
      return false;
    }
    if (letter === lastLetter) {
      letterCount += 1;
    } else {
      matches = letterString.match(new RegExp(letter, "g"));
    }
    if (!matches || matches.length < letterCount) {
      return false;
    }
    lastLetter = letter;
  }
  return true;
}
