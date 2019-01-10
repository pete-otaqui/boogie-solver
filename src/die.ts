import { Die, DieFace } from "./types";

const DICE: Die[] = [
  ["a", "a", "e", "e", "g", "n"],
  ["e", "l", "r", "t", "t", "y"],
  ["a", "o", "o", "t", "t", "w"],
  ["a", "b", "b", "j", "o", "o"],
  ["e", "h", "r", "t", "v", "w"],
  ["c", "i", "m", "o", "t", "u"],
  ["d", "i", "s", "t", "t", "y"],
  ["e", "i", "o", "s", "s", "t"],
  ["d", "e", "l", "r", "v", "y"],
  ["a", "c", "h", "o", "p", "s"],
  ["h", "i", "m", "n", "qu", "u"],
  ["e", "e", "i", "n", "s", "u"],
  ["e", "e", "g", "h", "n", "w"],
  ["a", "f", "f", "k", "p", "s"],
  ["h", "l", "n", "n", "r", "z"],
  ["d", "e", "i", "l", "r", "x"],
];

export function getDiceForBoardSize(size: number): Die[] {
  // the array of dice we are going to return for this board size
  // note that we will pick randomly from the possible dice, with
  // the minimum possible duplication (i.e. 16 squares will get
  // exactly one of each die type, 32 will get two of each)
  const dice = [];
  // a temp clone of the possible dice
  let tDice = [...DICE];
  while (dice.length < size) {
    // grab an index from the temp clone of dice
    const cDieIndex = Math.floor(Math.random() * tDice.length);
    // splice it out ... next go we won't duplicate it
    const cDie = tDice.splice(cDieIndex, 1)[0];
    // add it to the output
    dice.push(cDie);
    // if we've run out of dice, create a new set
    if (tDice.length === 0) {
      tDice = [...DICE];
    }
  }
  return dice;
}

export function rollDie(die: Die): DieFace {
  // for each die, pick a random face
  const idx = Math.floor(Math.random() * die.length);
  return die[idx];
}

export function rollDice(w: number, h: number): DieFace[][] {
  // use the above function to get a randomized list of dice
  return (
    getDiceForBoardSize(w * h)
      // pick a face for each one
      .map(rollDie)
      // collect into a 2-d array
      .reduce((memo: DieFace[][], dieFace, index) => {
        // collect as a 2-d array of rows
        const rowIndex = Math.floor(index / w);
        if (!memo[rowIndex]) {
          memo[rowIndex] = [];
        }
        memo[rowIndex].push(dieFace);
        return memo;
      }, [])
  );
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
