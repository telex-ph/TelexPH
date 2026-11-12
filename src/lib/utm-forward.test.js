import test from "node:test";
import assert from "node:assert/strict";
import { firstAttr, intlHref } from "./utm-forward.js";

const day = 86400e3, t = Date.parse("2026-11-12T00:00:00Z");
const q = (s) => new URLSearchParams(s);

test("firstAttr: first UTMs kept 30 days, never overwritten, bad values dropped", () => {
  const paid = firstAttr(null, q("utm_source=facebook&utm_medium=paid&utm_campaign=test-nov&utm_content=a1&utm_term=va"), t);
  assert.deepEqual(paid, { at: t, utm_source: "facebook", utm_medium: "paid", utm_campaign: "test-nov", utm_content: "a1", utm_term: "va" });
  assert.equal(firstAttr(paid, q("utm_source=linkedin&utm_medium=organic"), t + 7 * day), paid);
  assert.equal(firstAttr(paid, q(""), t + 7 * day), paid);
  assert.deepEqual(firstAttr(paid, q("utm_source=website&utm_medium=blog"), t + 31 * day), { at: t + 31 * day, utm_source: "website", utm_medium: "blog" });
  assert.equal(firstAttr(paid, q(""), t + 31 * day), null);
  assert.equal(firstAttr(null, q("utm_source=<script>"), t), null);
  for (const bad of [5, "x", {}, { at: t }, { utm_source: "facebook" }, { utm_source: "facebook", at: t + day }]) {
    assert.deepEqual(firstAttr(bad, q("utm_source=clutch"), t), { at: t, utm_source: "clutch" }, JSON.stringify(bad));
  }
});

test("intlHref: intl links carry the saved UTMs, other links are untouched", () => {
  const saved = { at: t, utm_source: "facebook", utm_medium: "paid", utm_campaign: "test-nov" };
  const base = "https://www.telexph.com/blogs/x";
  assert.equal(
    intlHref("https://intl.telexph.com/?ref=telexph-website", saved, base),
    "https://intl.telexph.com/?ref=telexph-website&utm_source=facebook&utm_medium=paid&utm_campaign=test-nov"
  );
  assert.equal(
    intlHref("https://intl.telexph.com/?utm_source=website&utm_medium=blog&utm_term=old", saved, base),
    "https://intl.telexph.com/?utm_source=facebook&utm_medium=paid&utm_campaign=test-nov",
    "first touch wins over the link's own tags"
  );
  assert.equal(intlHref("https://intl.telexph.com/?utm_source=website&utm_medium=blog", null, base), "https://intl.telexph.com/?utm_source=website&utm_medium=blog");
  assert.equal(intlHref("/services", saved, base), "/services");
  assert.equal(intlHref("https://intl.telexph.com.evil.io/", saved, base), "https://intl.telexph.com.evil.io/");
  assert.equal(intlHref("mailto:business@telexph.com", saved, base), "mailto:business@telexph.com");
});
