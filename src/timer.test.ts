import tape from "tape";

import { calcTimeDiff } from "./timer";

tape("calcTimeDiff() calculates difference for the same second", t => {
  const start = [355770, 384364348];
  const end = [355770, 843769026];
  const result = calcTimeDiff(start, end);
  t.equal(result, 0.459405);
  t.end();
});

tape("calcTimeDiff() calculates difference for the next second", t => {
  const start = [355959, 978133947];
  const end = [355960, 406788291];
  const result = calcTimeDiff(start, end);
  t.equal(result, 0.428654);
  t.end();
});
