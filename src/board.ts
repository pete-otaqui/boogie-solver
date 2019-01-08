import { rollDice } from "./die";
import { IBoard, RolledDice } from "./types";

export function create(width: number, height: number): IBoard {
  const board: IBoard = {
    dice: rollDice(width, height),
    height,
    width,
  };
  return board;
}

export function liftDice(dice: RolledDice): IBoard {
  const width = dice[0].length;
  const height = dice.length;
  return {
    dice,
    height,
    width,
  };
}
