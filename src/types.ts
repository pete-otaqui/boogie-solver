/*
Why types everywhere rather than the TypeScript recommended Interfaces?

Since you can't actually express everything with an interface that you can with
a type (or at least I don't see how!) such as a union-of-strings, you have to
use some types anyway.  Then you end up with ISomeThing and and NotIOtherThing.

For example below, we could have had an interface such as IBoard.  But we could
*not* have IDieFace (since you can't do string unions).
*/

export declare type Board = {
  cells: BoardCell[];
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
