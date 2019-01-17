import { cellIsInList, getAdjacentCells, getCell, liftDice } from "./board";
import { wordToDieFaces } from "./die";
import { calcTimeDiff } from "./timer";
import {
  Board,
  BoardCell,
  DieFace,
  Path,
  PathPair,
  RolledDice,
  Solution,
  WordTrie,
} from "./types";
import sowpods from "./word-lists/sowpods.json";

export async function solveTrie(
  dice: RolledDice,
  trie: WordTrie,
): Promise<Solution> {
  const start = process.hrtime();
  const board = liftDice(dice);
  let paths: Path[] = [];
  board.cells.forEach(cell => {
    const newPaths = solveTrieCell(cell, board, trie);
    paths = paths.concat(newPaths);
  });
  const words = Array.from(new Set(paths.map(p => p.word)));
  const end = process.hrtime();
  const time = calcTimeDiff(start, end);
  const solution: Solution = {
    board,
    paths,
    time,
    words,
  };
  return Promise.resolve(solution);
}

export function solveTrieCell(
  cell: BoardCell,
  board: Board,
  trie: WordTrie,
): Path[] {
  const pathTries: BoardCell[][] = [];
  function _solve(
    curCell: BoardCell,
    trieNode: WordTrie,
    pathTrie: BoardCell[],
  ) {
    if (cellIsInList(curCell, pathTrie)) {
      return;
    }
    const curFace = curCell.face;
    if (typeof trieNode[curFace] === "undefined") {
      return;
    }
    trieNode = trieNode[curFace] as WordTrie;
    const { x, y } = curCell;
    const left = x > 0;
    const right = x < board.width - 1;
    const up = y > 0;
    const down = y < board.height - 1;
    const nextPathTrie = pathTrie.concat([curCell]);
    if (up && left) {
      _solve(getCell(board, x - 1, y - 1), trieNode, nextPathTrie);
    }
    if (up) {
      _solve(getCell(board, x + 0, y - 1), trieNode, nextPathTrie);
    }
    if (up && right) {
      _solve(getCell(board, x + 1, y - 1), trieNode, nextPathTrie);
    }
    if (left) {
      _solve(getCell(board, x - 1, y + 0), trieNode, nextPathTrie);
    }
    if (right) {
      _solve(getCell(board, x + 1, y + 0), trieNode, nextPathTrie);
    }
    if (down && left) {
      _solve(getCell(board, x - 1, y + 1), trieNode, nextPathTrie);
    }
    if (down) {
      _solve(getCell(board, x + 0, y + 1), trieNode, nextPathTrie);
    }
    if (down && right) {
      _solve(getCell(board, x + 1, y + 1), trieNode, nextPathTrie);
    }
    if (trieNode._) {
      pathTries.push(pathTrie.concat([curCell]));
    }
  }
  _solve(cell, trie, []);
  return pathTries.map(pt => {
    const letters = pt;
    const faces = letters.map(bc => bc.face);
    const word = faces.join("");
    return {
      faces,
      letters,
      word,
    };
  });
}

/**
 * Note this function is somewhat unnecessarily async now, because it's likely
 * that any solution for parallelising in the future would demand it. For the
 * sake of a vague example of this, we split the word list into chunks and then
 * search for the words in each chunk,
 */
export async function solve(
  dice: RolledDice,
  wordlist: string[] = sowpods,
): Promise<Solution> {
  const start = process.hrtime();
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
  const end = process.hrtime();
  const time = calcTimeDiff(start, end);
  return Promise.resolve({
    board,
    paths,
    time,
    words,
  });
}

/**
 * As with `solve()`, this is pointlessly async right now, with a view to being
 * able to offload the search to some async style in the future without needing
 * to change the API.
 */
export function searchForWords(words: string[], board: Board): Promise<Path[]> {
  let allPaths: Path[] = [];
  words.forEach(word => {
    const paths = searchForWord(word, board);
    allPaths = allPaths.concat(paths);
  });
  return Promise.resolve(allPaths);
}

/**
 * Unlike `solve()` and `searchForWords()`, this function is synchronous.  It
 * may be that in the future we would even want a single word search to be async
 * but since this isn't intended to be a public API, it's not really a problem.
 */
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

/**
 * Here we do a little mutation of the `found[]` property. This might well be
 * better avoided, however it seems like a waste to keep cloning an array of the
 * same objects over and over again, especially if you aren't cloning the refs
 * inside.
 * We *don't* mutate the `inProgress[]` property, since we're creating whole
 * new paths all the time anyway.
 */
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

/**
 * Simple pure function to get an array of the next possible cells for a given
 * path. We look at the next `Face`, based on the length of the `letters` - this
 * is important to handle multi-letter-faces, i.e. the "qu" die face.
 */
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
