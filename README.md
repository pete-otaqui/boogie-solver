# Boogie Solver

[![CircleCI](https://circleci.com/gh/pete-otaqui/boogie-solver/tree/master.svg?style=svg)](https://circleci.com/gh/pete-otaqui/boogie-solver/tree/master)

A module for solving [Boggle](https://en.wikipedia.org/wiki/Boggle) boards.

The project is written in Typescript, and provides definitions to consumers.

## Usage

First get the package:

```bash
$ npm install boogie-solver
```

Then you can roll the dice and use the (promise-returning / async-friendly)
`solve()` function to find the possilbe words in the board:

```js
import { rollDice, solveTrie, sowpodsTrie } from "boogie-solver";

async function main() {
  const BOARD_WIDTH = 4;
  const BOARD_HEIGHT = 4;

  const dice = rolleDice(BOARD_WIDTH, BOARD_HEIGHT);
  const solution = await solveTrie(dice, sowpodsTrie);

  console.log(solution.words.length); // unique words found
  console.log(solution.paths.length); // paths for words found, with positions
}

main();
```

You can also provide your own set of "dice" in a 2-d array of rows:

```js
import { solveTrie, sowpodsTrie } from "boogie-solver";

async function main() {
  // provide a 4x4 grid of dice, in an array of row arrays.
  const dice = [
    ["h", "e", "w", "y"],
    ["c", "i", "h", "h"],
    ["l", "v", "a", "o"],
    ["r", "e", "a", "s"],
  ];

  const solution = await solveTrie(dice, sowpodsTrie);

  console.log(solution.words.length); // unique words found
  console.log(solution.paths.length); // paths for words found, with positions
}

main();
```

### About the dice used

Note that the set of dice is a specific one (although there have been multiple
different versions of the original game). It expects one face to be "Qu" rather
than just "Q" on it's own.

### A note about the "trie" structures and TypeScript

It's not possible under many circumstances to `import` a large tree structure
with TypeScript - it uses _much_ more memory than a simple `require` of the same
file.

This limitation means that there a couple of extra hoops to jump through, both
when using this library and also when developing for it.

This library provides two different word tries (trees) - Sowpods and OED.

If you want to provide your own trie, it should be structured based on the
letters of each word, with a `{ _: true }` property for whole words.

```js
import { solveTrie } from "boogie-solver";

// manually construct a trie which contains the words quip, quips, quit, quits.
// note that "qu" is considered a single die face.
const trie = {
  qu: {
    i: {
      p: {
        _: true, // "qu-i-p" is a word
        s: {
          _: true, // "qu-i-p-s" is a word
        },
      },
      t: {
        _: true, // "qu-i-t" is a word
        s: {
          _: true, // "qu-i-t-s" is a word
        },
      },
    },
  },
};

async function main() {
  const dice = [["qu", "i", "s"], ["x", "p", "t"]];

  const solution = await solveTrie(dice, trie);
  console.log(solution.words); // ["quip", "quips", "quit", "quits"]
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
- `npm run demo` - runs a demo of the module, outputting to the console
- `npm run lint` - runs `tslint` on the source code.
- `npm run pre-commit` - useful script to use in a git pre-commit hook: runs
  `lint`, `test` and `build` scripts
- `npm test` - runs the test scripts, collects coverage and puts the report in
  the `./coverage/` directory, as well using `./.nyc_output/`.
- `npm run test:quick` - just runs the native test scripts, really quickly and
  with better error messaging if you need it.
- `npm run tries` - build trie structures from word lists in the
  `/src/word-lists/` directory, only required if you add/update the word lists.

### Notes

Areas that could do with improvement:

1. Make the dice used more flexible, i.e. not always the same set. This also
   requires the `solve()`, `solveTrie()` and other routines to "know" what dice
   are being used, rather than assuming that "qu" will always be the only
   double-letter die face.
2. The trie building / parsing functions are a fairly naïve port from
   https://github.com/pillowfication/pf-boggle and the same user's sowpods repo.
   While these are efficient, there's quite a lot of mutation of things that is
   very effective, but I would prefer to make more purely functional to match
   the style of the rest of the codebase.
3. With the trie-based solutions in place, the non-trie based parts should be
   removed, since they are essentially cruft now.
4. Would be nice to understand why TypeScript explodes when `import`ing the trie
   json files, and if there is any way to make the compiler _not_ try and do
   whatever parsing is causing that (and then we could just `import` them
   normally and skip all the `require` and `cp` shenanigans).
