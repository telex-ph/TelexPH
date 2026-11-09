import test from "node:test";
import assert from "node:assert/strict";
import { emptySeo, seoFromRecord, seoError, seoPayload, appendSeo, withoutGeneratedFaq, clipDescription } from "./seo-fields.js";

const seo = (over = {}) => ({ ...emptySeo(), ...over });

test("fullTitle adds the brand only while the title stays within 60 chars", async () => {
  const { fullTitle } = await import("../data/seo-pages.js");
  assert.equal(fullTitle("About"), "About | TelexPH");
  assert.equal(fullTitle("x".repeat(55)), "x".repeat(55));
  assert.equal(fullTitle("TelexPH Careers"), "TelexPH Careers");
});

test("clipDescription keeps short text and cuts long text to 155 chars at a word", () => {
  assert.equal(clipDescription("Short."), "Short.");
  assert.equal(clipDescription(undefined), undefined);
  const out = clipDescription("word ".repeat(60).trim());
  assert.ok(out.length <= 155 && out.endsWith("word…"), out);
});

test("seoFromRecord copes with records that have none of the fields", () => {
  assert.deepEqual(seoFromRecord({}), emptySeo());
  assert.deepEqual(seoFromRecord(undefined), emptySeo());
  assert.deepEqual(seoFromRecord({ metaTitle: "T", coverAlt: "A", faq: [{ question: "Q?", answer: "A" }] }), seo({ metaTitle: "T", coverAlt: "A", faq: [{ question: "Q?", answer: "A" }] }));
});

test("seoError flags the same limits the API enforces", () => {
  assert.equal(seoError(seo()), "");
  assert.match(seoError(seo({ metaTitle: "x".repeat(71) })), /Meta title/);
  assert.match(seoError(seo({ metaDescription: "x".repeat(171) })), /Meta description/);
  assert.match(seoError(seo({ coverAlt: "x".repeat(201) })), /alt text/);
  assert.match(seoError(seo({ faq: [{ question: "Only a question?", answer: "" }] })), /both the question and the answer/);
  assert.match(seoError(seo({ faq: [{ question: "no", answer: "short" }] })), /too short/);
  assert.equal(seoError(seo({ faq: [{ question: "", answer: "" }] })), "", "an untouched empty row is ignored");
});

test("seoPayload trims and drops empty FAQ rows; empty strings are sent so fields can be cleared", () => {
  const p = seoPayload(seo({ metaTitle: "  Hi ", faq: [{ question: " Why? ", answer: " Because. " }, { question: "", answer: "" }] }));
  assert.deepEqual(p, { metaTitle: "Hi", metaDescription: "", coverAlt: "", faq: [{ question: "Why?", answer: "Because." }] });
});

test("appendSeo writes the multipart fields, faq as JSON", () => {
  const fd = new FormData();
  appendSeo(fd, seo({ metaTitle: "T", faq: [{ question: "Why?", answer: "Because." }] }));
  assert.equal(fd.get("metaTitle"), "T");
  assert.equal(fd.get("metaDescription"), "");
  assert.equal(fd.get("coverAlt"), "");
  assert.deepEqual(JSON.parse(fd.get("faq")), [{ question: "Why?", answer: "Because." }]);
});

test("withoutGeneratedFaq hides the FAQ section only when FAQ pairs are stored", () => {
  const sections = [{ title: "Overview" }, { title: "Frequently Asked Questions" }];
  assert.equal(withoutGeneratedFaq(sections, { faq: [{ question: "Q?", answer: "A" }] }).length, 1);
  assert.equal(withoutGeneratedFaq(sections, { faq: [] }).length, 2, "older hand-written FAQ section stays editable");
  assert.equal(withoutGeneratedFaq(sections, {}).length, 2);
  assert.deepEqual(withoutGeneratedFaq(undefined, {}), []);
  const cs = [{ subtitle: "Intro" }, { subtitle: "Frequently Asked Questions" }];
  assert.equal(withoutGeneratedFaq(cs, { faq: [{ question: "Q?", answer: "A" }] }, "subtitle").length, 1);
});
