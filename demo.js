const { rollDice, solve } = require("./build");

async function demo() {
  const dice = rollDice(16, 16);
  const start = process.hrtime();
  const solution = await solve(dice);
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
  console.log(str);
}

demo();
