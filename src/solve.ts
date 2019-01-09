import { getAdjacentCells, liftDice } from "./board";
import { Board, BoardCell, DieFace, Path, PathPair, RolledDice } from "./types";
import sowpods from "./word-lists/sowpods.json";

export function solve(
  dice: RolledDice,
  words: string[] = sowpods.words,
): Promise<Path[]> {
  const board: Board = liftDice(dice);
  const paths: Path[] = [];
  const path: Path = {
    letters: [],
    word: words[0],
  };
  return Promise.resolve(paths);
}

export function searchForWord(word: string, board: Board): Path[] {
  const found: Path[] = [];
  if (!wordIsVaguelyPossible(word, board.faces)) {
    return found;
  }
  const bootstrapPath: Path = {
    letters: [],
    word,
  };
  const inProgress: Path[] = findNextLetterCells(bootstrapPath, board).map(
    cell => ({
      letters: [cell],
      word,
    }),
  );
  let pathPair: PathPair = {
    found,
    inProgress,
  };
  let count = 0;
  while (pathPair.inProgress.length) {
    pathPair = extendPaths(pathPair, board);
    if (++count > 1000) {
      throw new Error("range error");
    }
  }
  return found;
}

export function extendPaths(pathPair: PathPair, board: Board): PathPair {
  const { found, inProgress } = pathPair;
  const newPaths: Path[] = [];
  inProgress.forEach(path => {
    const nextLetterCells = findNextLetterCells(path, board);
    nextLetterCells.forEach(cell => {
      const success = path.letters.length + 1 === path.word.length;
      const newPath: Path = {
        letters: path.letters.concat([cell]),
        word: path.word,
      };
      if (success) {
        // @TODO don't mutate this?  Seems really extravagant to be cloning
        // this over and over again
        found.push(newPath);
      } else {
        newPaths.push(newPath);
      }
    });
  });
  return {
    found,
    inProgress: newPaths,
  };
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
