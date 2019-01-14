import tape from "tape";

import { WordTrie } from "../types";
import { buildTrie, verifyWordInTrie } from "./trie-builder";

tape("buildTrie() creates a basic trie", t => {
  const list = ["aa", "aah"];
  const trie: WordTrie = buildTrie(list);
  t.deepEqual(trie, { a: { a: { _: true, h: { _: true } } } });
  t.end();
});

tape("buildTrie() collects qu as a single die face", t => {
  const list = ["quick", "quiet"];
  const trie: WordTrie = buildTrie(list);
  t.deepEqual(trie, {
    qu: { i: { c: { k: { _: true } }, e: { t: { _: true } } } },
  });
  t.end();
});

tape("verifyWordInTrie() verifies a valid word", t => {
  const word = "why";
  const trie: WordTrie = { w: { h: { y: { _: true } } } };
  const result = verifyWordInTrie(word, trie);
  t.ok(result);
  t.end();
});

tape("verifyWordInTrie() verifies a valid partial word", t => {
  const word = "how";
  const trie: WordTrie = { h: { o: { w: { _: true }, l: { _: true } } } };
  const result = verifyWordInTrie(word, trie);
  t.ok(result);
  t.end();
});

tape("verifyWordInTrie() verifies an invalid word", t => {
  const word = "howl";
  const trie: WordTrie = { h: { o: { w: { _: true }, e: { _: true } } } };
  const result = verifyWordInTrie(word, trie);
  t.notOk(result);
  t.end();
});

tape("verifyWordInTrie() verifies an invalid partial word", t => {
  const word = "ho";
  const trie: WordTrie = { h: { o: { w: { _: true }, e: { _: true } } } };
  const result = verifyWordInTrie(word, trie);
  t.notOk(result);
  t.end();
});

tape("verifyWordInTrie() collects qu as a single die face", t => {
  const word = "aqua";
  const trie: WordTrie = { a: { qu: { a: { _: true } } } };
  const result = verifyWordInTrie(word, trie);
  t.ok(result);
  t.end();
});
