export declare type Board = {
  width: number;
  height: number;
  dice: RolledDice;
};
export declare type RolledDice = DieFace[][];

export declare type Path = {
  letters: BoardCell[];
  word: string;
};

export declare type BoardCell = {
  face: DieFace;
  x: number;
  y: number;
};

export declare type Die = DieFace[];

export declare type DieFace =
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
