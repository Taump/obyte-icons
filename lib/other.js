import PATH from "path"
import { OTHER_DIR, BUILD_DIR } from "./paths.js"
import { readSvg, listSvgFiles, optimizeSvg, writeIcon } from "./svg.js"

export function generateOtherIcons({ otherDir = OTHER_DIR, buildDir = BUILD_DIR } = {}) {
  const symbols = [];

  for (const file of listSvgFiles(otherDir)) {
    const symbol = file.replace(/\.svg$/, "");
    writeIcon(symbol, optimizeSvg(readSvg(PATH.join(otherDir, file))), buildDir);
    symbols.push(symbol);
  }

  return symbols;
}
