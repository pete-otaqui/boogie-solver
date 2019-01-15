import fs from "fs";

import { buildTrie } from "./src/word-lists/trie-builder";

const wordListDir = `${__dirname}/src/word-lists`;

fs.readdirSync(wordListDir)
  .filter(file => file.match(/\.json$/))
  .filter(file => !file.match(/\.trie\.json$/))
  .forEach(file => {
    // tslint:disable-next-line:no-console
    console.log(`Building trie for ${file}`);
    const words = require(`${wordListDir}/${file}`);
    const trie = buildTrie(words);
    const trieJson = JSON.stringify(trie);
    const trieFilename = file.replace(/\.json$/, ".trie.json");
    fs.writeFileSync(`${wordListDir}/${trieFilename}`, trieJson);
    // tslint:disable-next-line:no-console
    console.log(` - done, built ${wordListDir}/${trieFilename}`);
  });
