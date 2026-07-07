import FS from "fs"
import PATH from "path"
import { BUILD_DIR } from "./lib/paths.js"
import { generateStablecoinIcons } from "./lib/stablecoins.js"
import { generateOtherIcons } from "./lib/other.js"
import { applyAliases } from "./lib/aliases.js"

FS.mkdirSync(BUILD_DIR, { recursive: true });

const symbols = new Set([...generateStablecoinIcons(), ...generateOtherIcons()]);
applyAliases(symbols);

FS.writeFileSync(PATH.join(BUILD_DIR, "list.json"), JSON.stringify([...symbols]));
console.log(`Generated ${symbols.size} symbols`);
