import { rollDice, solveTrie, sowpodsTrie } from "./src";

async function demo() {
  const dice = rollDice(4, 4);
  const start = process.hrtime();
  const solution = await solveTrie(dice, sowpodsTrie);
  const end = process.hrtime();
  const str = `
Board:
  ${dice.map(row => row.join(",")).join("\n  ")}

Words:
  ${solution.words.sort().join(",")}

Found: ${solution.words.length} words
Found: ${solution.paths.length} paths

Took: ${end[0] - start[0]}.${end[1]} seconds
`;
  // tslint:disable-next-line:no-console
  console.log(str);
}

demo();
