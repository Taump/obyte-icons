import PATH from "path"
import { STABLECOINS_DIR, TEMPLATES_DIR, BUILD_DIR } from "./paths.js"
import { readSvg, listSvgFiles, optimizeSvg, writeIcon } from "./svg.js"

const templates = {
  stable: readSvg(PATH.join(TEMPLATES_DIR, "stable.svg")),
  interest: readSvg(PATH.join(TEMPLATES_DIR, "interest.svg")),
  fund: readSvg(PATH.join(TEMPLATES_DIR, "fund.svg")),
};

// [growth-]fund-interest-stable.svg → { growth?, fund, interest, stable }
export function parseStablecoinFileName(file) {
  const parts = file.replace(/\.svg$/, "").split("-");
  if (parts.length < 3 || parts.length > 4 || parts.some((part) => !part)) {
    throw new Error(`Invalid stablecoin file name "${file}", expected [growth-]fund-interest-stable.svg`);
  }
  const [stable, interest, fund, growth] = parts.reverse();
  return { growth, fund, interest, stable };
}

export function generateStablecoinIcons({ stablecoinsDir = STABLECOINS_DIR, buildDir = BUILD_DIR } = {}) {
  const symbols = [];

  for (const file of listSvgFiles(stablecoinsDir)) {
    const { growth, fund, interest, stable } = parseStablecoinFileName(file);
    const logo = readSvg(PATH.join(stablecoinsDir, file));

    const templateBySymbol = {
      [fund]: templates.fund,
      [interest]: templates.interest,
      [stable]: templates.stable,
    };
    if (growth) templateBySymbol[growth] = templates.fund;

    for (const [symbol, template] of Object.entries(templateBySymbol)) {
      // replacer-функция, чтобы $-паттерны внутри логотипа не ломали подстановку
      writeIcon(symbol, optimizeSvg(template.replace("{{logo}}", () => logo)), buildDir);
      symbols.push(symbol);
    }
  }

  return symbols;
}
