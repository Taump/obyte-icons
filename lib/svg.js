import FS from "fs"
import PATH from "path"
import { optimize } from "svgo"
import { BUILD_DIR } from "./paths.js"

export const readSvg = (path) => FS.readFileSync(path, "utf8");

export function listSvgFiles(dir) {
  return FS.readdirSync(dir).filter((file) => file.endsWith(".svg"));
}

export function optimizeSvg(svg) {
  return optimize(svg, {
    plugins: [
      { name: "removeAttrs", params: { attrs: "(width|height)" } },
    ],
  }).data;
}

// пишет SYMBOL.svg и SYMBOL-INV.svg; если в svg нет {{color}}, обе версии одинаковые
export function writeIcon(symbol, svg, buildDir = BUILD_DIR) {
  FS.writeFileSync(PATH.join(buildDir, `${symbol}.svg`), svg.replace(/{{color}}/g, "black"));
  FS.writeFileSync(PATH.join(buildDir, `${symbol}-INV.svg`), svg.replace(/{{color}}/g, "white"));
}
