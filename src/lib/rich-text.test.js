import test from "node:test";
import assert from "node:assert/strict";
import { toHtml, htmlToText } from "./rich-text.js";

// Plain-text (legacy) paths only: the HTML paths need a browser DOM for DOMPurify.
test("legacy plain text becomes escaped paragraphs", () => {
  assert.equal(toHtml("a < b\nline2\n\nsecond"), "<p>a &lt; b<br>line2</p><p>second</p>");
  assert.equal(toHtml(""), "");
});

test("htmlToText collapses plain text whitespace", () => {
  assert.equal(htmlToText("  hello \n world  "), "hello world");
  assert.equal(htmlToText(null), "");
});
