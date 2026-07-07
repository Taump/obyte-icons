import FS from "fs"
import PATH from "path"
import { BUILD_DIR, ALIASES_PATH } from "./paths.js"

// aliases.json: { "ALIAS": "SOURCE" } — ALIAS.svg и ALIAS-INV.svg будут копиями иконок SOURCE
export function applyAliases(symbols, { aliasesPath = ALIASES_PATH, buildDir = BUILD_DIR } = {}) {
  if (!FS.existsSync(aliasesPath)) return;

  const aliases = JSON.parse(FS.readFileSync(aliasesPath, "utf8"));

  for (const [alias, source] of Object.entries(aliases)) {
    if (!symbols.has(source)) {
      throw new Error(`Unknown source symbol "${source}" for alias "${alias}" in aliases.json`);
    }
    if (symbols.has(alias)) {
      throw new Error(`Alias "${alias}" clashes with an existing symbol`);
    }

    FS.copyFileSync(PATH.join(buildDir, `${source}.svg`), PATH.join(buildDir, `${alias}.svg`));
    FS.copyFileSync(PATH.join(buildDir, `${source}-INV.svg`), PATH.join(buildDir, `${alias}-INV.svg`));
    symbols.add(alias);
  }
}
