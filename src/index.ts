import { rollDice } from "./die";
import { solve as actualSolve } from "./solve";

import { DieFace } from "./types";
import sowpods from "./word-lists/sowpods.json";

function solve(dice: DieFace[][], wordlist: string[] = sowpods.words) {
  return actualSolve(dice, wordlist);
}

export { rollDice, solve };
