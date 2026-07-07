import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import { listSvgFiles, optimizeSvg, writeIcon } from "../lib/svg.js"
import { makeTmpDir, removeTmpDir, read, write } from "./helpers.js"

describe("listSvgFiles", () => {
  let dir;

  before(() => {
    dir = makeTmpDir();
    write(dir, "A.svg", "<svg/>");
    write(dir, "B.svg", "<svg/>");
    write(dir, ".DS_Store", "");
    write(dir, "readme.txt", "");
  });
  after(() => removeTmpDir(dir));

  it("returns only .svg files", () => {
    assert.deepEqual(listSvgFiles(dir).sort(), ["A.svg", "B.svg"]);
  });
});

describe("optimizeSvg", () => {
  it("removes width and height, keeps viewBox and {{color}}", () => {
    const svg = '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path fill="{{color}}" d="M0 0h10v10z"/></svg>';
    const result = optimizeSvg(svg);

    assert.ok(!result.includes("width="));
    assert.ok(!result.includes("height="));
    assert.ok(result.includes('viewBox="0 0 10 10"'));
    assert.ok(result.includes('fill="{{color}}"'));
  });
});

describe("writeIcon", () => {
  let dir;

  before(() => { dir = makeTmpDir(); });
  after(() => removeTmpDir(dir));

  it("writes black normal and white inverse variants for {{color}}", () => {
    writeIcon("FOO", '<svg fill="{{color}}"/>', dir);

    assert.equal(read(dir, "FOO.svg"), '<svg fill="black"/>');
    assert.equal(read(dir, "FOO-INV.svg"), '<svg fill="white"/>');
  });

  it("writes identical variants when there is no {{color}}", () => {
    writeIcon("BAR", '<svg fill="red"/>', dir);

    assert.equal(read(dir, "BAR.svg"), read(dir, "BAR-INV.svg"));
  });
});
