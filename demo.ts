import { rollDice, solveTrie, sowpodsTrie } from "./src";

async function demo() {
  for (let i = 0; i < 20; i += 1) {
    await demoBoard(4, 4);
  }
  for (let i = 0; i < 20; i += 1) {
    await demoBoard(16, 16);
  }
  for (let i = 0; i < 20; i += 1) {
    await demoBoard(32, 32);
  }
}

async function demoBoard(width: number, height: number) {
  const dice = rollDice(width, height);
  const solution = await solveTrie(dice, sowpodsTrie);
  const str = `
Board (${width}, ${height})
Found: ${solution.words.length} words
Found: ${solution.paths.length} paths
Took: ${solution.time} seconds
`;
  // tslint:disable-next-line:no-console
  console.log(str);
}

demo();
