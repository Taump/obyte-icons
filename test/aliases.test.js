import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import FS from "fs"
import PATH from "path"
import { applyAliases } from "../lib/aliases.js"
import { makeTmpDir, removeTmpDir, read, write } from "./helpers.js"

describe("applyAliases", () => {
  let buildDir, aliasesPath, symbols;

  beforeEach(() => {
    buildDir = makeTmpDir();
    aliasesPath = PATH.join(buildDir, "aliases.json");
    write(buildDir, "SRC.svg", '<svg fill="black"/>');
    write(buildDir, "SRC-INV.svg", '<svg fill="white"/>');
    symbols = new Set(["SRC"]);
  });
  afterEach(() => removeTmpDir(buildDir));

  it("copies both icon variants and registers the alias", () => {
    FS.writeFileSync(aliasesPath, JSON.stringify({ SRC_2: "SRC" }));

    applyAliases(symbols, { aliasesPath, buildDir });

    assert.equal(read(buildDir, "SRC_2.svg"), read(buildDir, "SRC.svg"));
    assert.equal(read(buildDir, "SRC_2-INV.svg"), read(buildDir, "SRC-INV.svg"));
    assert.ok(symbols.has("SRC_2"));
  });

  it("supports alias chains declared in order", () => {
    FS.writeFileSync(aliasesPath, JSON.stringify({ SRC_2: "SRC", SRC_3: "SRC_2" }));

    applyAliases(symbols, { aliasesPath, buildDir });

    assert.equal(read(buildDir, "SRC_3.svg"), read(buildDir, "SRC.svg"));
    assert.deepEqual([...symbols], ["SRC", "SRC_2", "SRC_3"]);
  });

  it("does nothing when the aliases file is missing", () => {
    applyAliases(symbols, { aliasesPath, buildDir });

    assert.deepEqual([...symbols], ["SRC"]);
  });

  it("throws on unknown source symbol", () => {
    FS.writeFileSync(aliasesPath, JSON.stringify({ FOO_2: "FOO" }));

    assert.throws(
      () => applyAliases(symbols, { aliasesPath, buildDir }),
      /Unknown source symbol "FOO" for alias "FOO_2"/,
    );
  });

  it("throws when alias clashes with an existing symbol", () => {
    symbols.add("TAKEN");
    FS.writeFileSync(aliasesPath, JSON.stringify({ TAKEN: "SRC" }));

    assert.throws(
      () => applyAliases(symbols, { aliasesPath, buildDir }),
      /Alias "TAKEN" clashes with an existing symbol/,
    );
  });
});
