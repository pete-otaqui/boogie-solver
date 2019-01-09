import { getAdjacentCells, liftDice } from "./board";
import {
  Board,
  BoardCell,
  DieFace,
  Path,
  PathPair,
  RolledDice,
  Solution,
} from "./types";
import sowpods from "./word-lists/sowpods.json";

export async function solve(
  dice: RolledDice,
  wordlist: string[] = sowpods.words,
): Promise<Solution> {
  const board: Board = liftDice(dice);
  let paths: Path[] = [];
  const chunkSize = 1000;
  const numberOfChunks = Math.ceil(wordlist.length / chunkSize);
  for (let i = 0; i < numberOfChunks; i += 1) {
    const chunkOfWords = wordlist.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkOfPaths = await searchForWords(chunkOfWords, board);
    paths = paths.concat(chunkOfPaths);
  }
  const words = Array.from(new Set(paths.map(p => p.word)));
  return Promise.resolve({
    board,
    paths,
    words,
  });
}

export function searchForWords(words: string[], board: Board): Promise<Path[]> {
  let allPaths: Path[] = [];
  words.forEach(word => {
    const paths = searchForWord(word, board);
    allPaths = allPaths.concat(paths);
  });
  return Promise.resolve(allPaths);
}

export function searchForWord(word: string, board: Board): Path[] {
  const found: Path[] = [];
  const faces = wordToDieFaces(word);
  if (!wordIsVaguelyPossible(word, board.faces)) {
    return found;
  }
  const bootstrapPath: Path = {
    faces,
    letters: [],
    word,
  };
  const inProgress: Path[] = findNextLetterCells(bootstrapPath, board).map(
    cell => ({
      faces,
      letters: [cell],
      word,
    }),
  );
  let pathPair: PathPair = {
    found,
    inProgress,
  };
  while (pathPair.inProgress.length) {
    pathPair = extendPaths(pathPair, board);
  }
  return found;
}

export function extendPaths(pathPair: PathPair, board: Board): PathPair {
  const { found, inProgress } = pathPair;
  const newPaths: Path[] = [];
  inProgress.forEach(path => {
    const nextLetterCells = findNextLetterCells(path, board);
    nextLetterCells.forEach(cell => {
      const success = path.letters.length + 1 === path.faces.length;
      const newPath: Path = {
        faces: path.faces,
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
  const nextFace = path.faces[path.letters.length];
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
    return cell.face === nextFace;
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
  // @TODO This should be more optimized, step 1 is not calculating the "counts"
  // for the letters every time since they will often be the same
  if (!word.length) {
    throw new RangeError("Empty word provided");
  }
  const faces = wordToDieFaces(word);

  const letterFaceCounts = faceCounts(letters);
  const wordFaceCounts = faceCounts(faces);

  for (const [face, count] of wordFaceCounts.entries()) {
    const letterCount = letterFaceCounts.get(face) || 0;
    if (letterCount < count) {
      return false;
    }
  }
  return true;
}

export function faceCounts(faces: DieFace[]): Map<DieFace, number> {
  // @TODO this should probably be a plain object type, instead of a map
  // since maps are a lot slower, and this will be a high usage fn.
  return faces.reduce(
    (counter, face) => {
      const result = counter.get(face) || 0;
      counter.set(face, result + 1);
      return counter;
    },
    new Map() as Map<DieFace, number>,
  );
}
