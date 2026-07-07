import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import { generateOtherIcons } from "../lib/other.js"
import { makeTmpDir, removeTmpDir, read, write } from "./helpers.js"

describe("generateOtherIcons", () => {
  let otherDir, buildDir, symbols;

  before(() => {
    otherDir = makeTmpDir();
    buildDir = makeTmpDir();
    write(otherDir, "COLORED.svg", '<svg viewBox="0 0 88 88"><path fill="{{color}}" d="M0 0h10z"/></svg>');
    write(otherDir, "PLAIN.svg", '<svg width="88" height="88" viewBox="0 0 88 88"><path fill="red" d="M0 0h10z"/></svg>');
    write(otherDir, "notes.txt", "not an icon");
    symbols = generateOtherIcons({ otherDir, buildDir });
  });
  after(() => {
    removeTmpDir(otherDir);
    removeTmpDir(buildDir);
  });

  it("returns a symbol per svg file, ignoring other files", () => {
    assert.deepEqual(symbols, ["COLORED", "PLAIN"]);
  });

  it("writes black and white variants for icons with {{color}}", () => {
    assert.ok(read(buildDir, "COLORED.svg").includes('fill="black"'));
    assert.ok(read(buildDir, "COLORED-INV.svg").includes('fill="white"'));
  });

  it("writes identical variants for icons without {{color}}", () => {
    assert.equal(read(buildDir, "PLAIN.svg"), read(buildDir, "PLAIN-INV.svg"));
  });

  it("removes width and height attributes", () => {
    const plain = read(buildDir, "PLAIN.svg");

    assert.ok(!plain.includes("width="));
    assert.ok(!plain.includes("height="));
    assert.ok(plain.includes('viewBox="0 0 88 88"'));
  });
});
