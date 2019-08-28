import { rollDice } from "./die";
import { solve, solveTrie } from "./solve";
import { liftDice } from "./board";

// tslint:disable-next-line:no-var-requires
const sowpodsTrie = require(`${__dirname}/word-lists/sowpods.trie.json`);
// tslint:disable-next-line:no-var-requires
const oedTrie = require(`${__dirname}/word-lists/oed.trie.json`);

export { rollDice, solve, solveTrie, sowpodsTrie, oedTrie, liftDice };
