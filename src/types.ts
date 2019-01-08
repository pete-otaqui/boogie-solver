export interface IBoard {
  width: number;
  height: number;
  dice: RolledDice;
}

export type RolledDice = DieFace[][];

export interface IPath {
  letters: IVisibleFace[];
  word: string;
}

export interface IVisibleFace {
  face: DieFace;
  x: number;
  y: number;
}

export type Die = DieFace[];

export type DieFace =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "qu"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";
