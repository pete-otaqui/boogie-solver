import { liftDice } from "./board";
import { Board, Path, RolledDice } from "./types";
import sowpods from "./word-lists/sowpods.json";

export function solve(
  dice: RolledDice,
  words: string[] = sowpods.words,
): Path[] {
  const board: Board = liftDice(dice);
  const path: Path = {
    letters: [],
    word: words[0],
  };
  return [path, path];
}
