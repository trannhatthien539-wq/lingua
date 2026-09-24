import test from "node:test";
import assert from "node:assert/strict";
import { utf8ByteLength } from "../src/utils/utf8.js";

test("đo payload tiếng Việt và emoji theo byte UTF-8 thay vì số ký tự", () => {
  const value = JSON.stringify({ text: "Tiếng Việt 🌍" });
  assert.equal(utf8ByteLength(value), new TextEncoder().encode(value).byteLength);
  assert.ok(utf8ByteLength(value) > value.length);
});
