import test from "node:test";
import assert from "node:assert/strict";
import { getVisitId } from "./page-view-session.js";

function fakeBrowser() {
  const store = new Map();
  globalThis.window = {};
  globalThis.localStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) };
}

test("getVisitId: same visit while active, new visit after 30 minutes of inactivity", () => {
  fakeBrowser();
  const min = 60 * 1e3;
  const first = getVisitId(0);
  assert.ok(first);
  assert.equal(getVisitId(20 * min), first); // 20 min later: still the same visit
  assert.equal(getVisitId(49 * min), first); // activity keeps extending it (29 min since the last event)
  const next = getVisitId(49 * min + 31 * min); // 31 min of silence
  assert.notEqual(next, first);
});

test("getVisitId: returns an empty string when storage is unavailable", () => {
  globalThis.window = {};
  globalThis.localStorage = { getItem() { throw new Error("blocked"); }, setItem() {} };
  assert.equal(getVisitId(0), "");
});
