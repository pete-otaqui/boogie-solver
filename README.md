# Boogie Solver

A module for solving [Boggle](https://en.wikipedia.org/wiki/Boggle) boards.

The project is written in Typescript, and provides definitions to consumers.

## Threads

Note that, if available, this module will use
[Worker Threads](https://nodejs.org/api/worker_threads.html). These have a small
performance improvement on normal 4x4 boards, but the larger the board the
larger the benefit of using threads.

Informal testing suggests that with boards of 8x8 or more, a 2 times speed up
can be expected by using threads.

## Usage

First get the package:

```bash
$ npm install boggle-solver
```

Then you can roll the dice and use the (promise-returning / async-friendly)
`solve()` function to find the possilbe words in the board:

```js
import { rollDice, solve } from "boggle-solver";

async function main() {
  const BOARD_WIDTH = 4;
  const BOARD_HEIGHT = 4;

  const dice = rolleDice(BOARD_WIDTH, BOARD_HEIGHT);
  const solution = await solve(dice);

  console.log(solution.words.length); // unique words found
  console.log(solution.paths.length); // paths for words found, with positions
}

main();
```

You can also provide your own set of "dice" in a 2-d array of rows:

```js
import { solve } from "boggle-solver";

async function main() {
  // provide a 4x4 grid of dice, in an array of row arrays.
  const dice = [
    ["h", "e", "w", "y"],
    ["c", "i", "h", "h"],
    ["l", "v", "a", "o"],
    ["r", "e", "a", "s"],
  ];

  const solution = await solve(dice);

  console.log(solution.words.length); // unique words found
  console.log(solution.paths.length); // paths for words found, with positions
}

main();
```

### About the dice used

Note that the set of dice is a specific one (although there have been multiple
different versions of the original game). It expects one face to be "Qu" rather
than just "Q" on it's own.

### Specifying a word list

The default set of words is from
[Sowpods](https://en.wikipedia.org/wiki/Sowpods). You can specify your own list
when calling `solve()`:

```js
import { solve } from "boogie-solver";

async function main() {
  const dice = [["a", "b", "c"], ["d", "e", "f"]];
  const words = ["cab", "cafe", "deaf"];

  const solution = await solve(dice, words);
}

main();
```

## Development Notes

### Project structure

All the code is in the `./src/` directory, and is compiled to `./build/`.

You will notice that there is a `./src/types.ts` file that declares all the
types for the project - these are manually imported into the other files.

### Scripts

- `npm run build` - cleans and comiles the project to the `./build/` directory
- `npm run build:clean` - deletes the `./build/` directory
- `npm run build:compile` - compiles the typescript to the `./build/` directory
- `npm run demo` - runs a demo of the module, outputting to the console (note
  that you need to `build` first)
- `npm run demo:threads` - runs a demo of the module with threads (if available
  on your `node` version), outputting to the console (note that you need to
  `build` first)
- `npm run lint` - runs `tslint` on the source code.
- `npm run pre-commit` - useful script to use in a git pre-commit hook: runs
  `lint`, `test` and `build` scripts
- `npm test` - runs the test scripts, collects coverage and puts the report in
  the `./coverage/` directory, as well using `./.nyc_output/`.
- `npm run test:quick` - just runs the native test scripts, really quickly and
  with better error messaging if you need it.

### Notes

There are two main areas that could do with improvement:

1. Make the dice used more flexible, i.e. not always the same set. This also
   requires the `solve()` routines to "know" what dice are being used, rather
   than assuming that "qu" will always be the only double-letter die face.
2. Provide a simple way for consumers to parallelize the "chunks" of words that
   are solved, e.g. to use available cores.
