import { describe, it, before, after } from "node:test"
import assert from "node:assert/strict"
import FS from "fs"
import PATH from "path"
import { parseStablecoinFileName, generateStablecoinIcons } from "../lib/stablecoins.js"
import { makeTmpDir, removeTmpDir, read, write } from "./helpers.js"

describe("parseStablecoinFileName", () => {
  it("parses fund-interest-stable", () => {
    assert.deepEqual(parseStablecoinFileName("SFUSD-IUSD-OUSD.svg"), {
      growth: undefined,
      fund: "SFUSD",
      interest: "IUSD",
      stable: "OUSD",
    });
  });

  it("parses growth-fund-interest-stable", () => {
    assert.deepEqual(parseStablecoinFileName("GRDV2-SFUSD-IUSD-OUSD.svg"), {
      growth: "GRDV2",
      fund: "SFUSD",
      interest: "IUSD",
      stable: "OUSD",
    });
  });

  it("throws on too few parts", () => {
    assert.throws(() => parseStablecoinFileName("IUSD-OUSD.svg"), /Invalid stablecoin file name/);
  });

  it("throws on too many parts", () => {
    assert.throws(() => parseStablecoinFileName("A-B-C-D-E.svg"), /Invalid stablecoin file name/);
  });

  it("throws on empty part", () => {
    assert.throws(() => parseStablecoinFileName("A--C.svg"), /Invalid stablecoin file name/);
  });
});

describe("generateStablecoinIcons", () => {
  let stablecoinsDir, buildDir, symbols;

  before(() => {
    stablecoinsDir = makeTmpDir();
    buildDir = makeTmpDir();
    write(stablecoinsDir, "FND-INT-STB.svg", '<svg viewBox="0 0 88 88"><circle cx="44" cy="44" r="40"/></svg>');
    write(stablecoinsDir, "GRW-FN2-IN2-ST2.svg", '<svg viewBox="0 0 88 88"><rect x="4" y="4"/></svg>');
    symbols = generateStablecoinIcons({ stablecoinsDir, buildDir });
  });
  after(() => {
    removeTmpDir(stablecoinsDir);
    removeTmpDir(buildDir);
  });

  it("returns all symbols from file names", () => {
    assert.deepEqual(symbols, ["FND", "INT", "STB", "FN2", "IN2", "ST2", "GRW"]);
  });

  it("writes normal and inverse icons for every symbol", () => {
    for (const symbol of symbols) {
      assert.ok(FS.existsSync(PATH.join(buildDir, `${symbol}.svg`)), `${symbol}.svg is missing`);
      assert.ok(FS.existsSync(PATH.join(buildDir, `${symbol}-INV.svg`)), `${symbol}-INV.svg is missing`);
    }
  });

  it("embeds the logo into the template", () => {
    assert.ok(read(buildDir, "STB.svg").includes("circle"));
  });

  it("replaces {{color}} so inverse differs from normal", () => {
    const normal = read(buildDir, "FND.svg");
    const inverse = read(buildDir, "FND-INV.svg");

    assert.ok(!normal.includes("{{color}}"));
    assert.notEqual(normal, inverse);
  });

  it("generates growth icon from the fund template", () => {
    assert.equal(read(buildDir, "GRW.svg"), read(buildDir, "FN2.svg"));
    assert.equal(read(buildDir, "GRW-INV.svg"), read(buildDir, "FN2-INV.svg"));
  });

  it("throws on invalid file name in the folder", () => {
    const badDir = makeTmpDir();
    write(badDir, "BAD.svg", "<svg/>");

    assert.throws(
      () => generateStablecoinIcons({ stablecoinsDir: badDir, buildDir }),
      /Invalid stablecoin file name "BAD\.svg"/,
    );
    removeTmpDir(badDir);
  });
});
