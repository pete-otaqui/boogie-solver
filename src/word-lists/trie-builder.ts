import fs from "fs";
import { DieFace, WordTrie } from "../types";

export function buildTrie(wordlist: string[]): WordTrie {
  const trie: WordTrie = {};
  /**
   * Loop over every word in the list, turning into a tree of letter-keyed
   * objects.  The final letter-keyed object will have a "_" boolean propertybuildTrie
   * to denote that it is a whole word.
   */
  for (const word of wordlist) {
    // reset the "node" to the root object for each work
    let node = trie;
    // loop over every letter in the current word
    for (let i = 0; i < word.length; i += 1) {
      let l = word[i];
      // capture "qu" as a single die-face
      if (l === "q" && word[i + 1] === "u") {
        l = "qu";
        i += 1;
      }
      const letter = l as DieFace;
      let nextNode: WordTrie;
      const nodeLetter = node[letter] as WordTrie;
      // does this object exist already?
      if (!nodeLetter) {
        // if not let's create a new object
        nextNode = node[letter] = {};
      } else {
        // it exists already, so let's carry on using it and descending down,
        // appending new branches to the tree if necessary
        nextNode = nodeLetter;
      }
      // make this branch the current one and loop to the next letter
      node = nextNode;
    }
    // we've finished this word now, so let's set this as a whole word.
    node._ = true;
  }

  return trie;
}

export function verifyWordInTrie(word: string, trie: WordTrie) {
  let node = trie;
  for (let i = 0; i < word.length; i += 1) {
    let l = word[i];
    // capture "qu" as a single die-face
    if (l === "q" && word[i + 1] === "u") {
      l = "qu";
      i += 1;
    }
    const letter = l as DieFace;
    if (typeof node[letter] !== "undefined") {
      node = node[letter] as WordTrie;
    } else {
      return false;
    }
  }
  return !!node._;
}

if (process.mainModule) {
  // fs.readdirSync(__dirname)
  //   .filter(fn => fn.match(/\.json$/))
  //   .forEach(fn => {
  //     const words = require(`${__dirname}/${fn}`);
  //     const trie = buildTrie(words);
  //     const trieJson = JSON.stringify(trie);
  //     const trieFilename = fn.replace(/\.json$/, ".trie.json");
  //     fs.writeFileSync(`${__dirname}/${trieFilename}`, trieJson);
  //   });
}
