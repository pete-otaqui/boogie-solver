import { liftDice } from "./board";
import { IBoard, IPath, RolledDice } from "./types";
import sowpods from "./word-lists/sowpods.json";

export function solve(
  dice: RolledDice,
  words: string[] = sowpods.words,
): IPath[] {
  const board: IBoard = liftDice(dice);
  const path: IPath = {
    letters: [],
    word: words[0],
  };
  return [path, path];
}
