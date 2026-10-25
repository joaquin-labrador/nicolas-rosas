import test from "node:test";
import assert from "node:assert/strict";
import { ageAt } from "../src/utils/player.ts";

test("age changes on 29 November, with no dependency on locale or translated strings", () => {
  assert.equal(ageAt(new Date(2026, 9, 25, 12)), 20);
  assert.equal(ageAt(new Date(2026, 10, 28, 23, 59)), 20);
  assert.equal(ageAt(new Date(2026, 10, 29, 0, 0)), 21);
  assert.equal(ageAt(new Date(2027, 0, 1, 12)), 21);
  assert.equal(ageAt(new Date(2027, 10, 29, 12)), 22);
});
