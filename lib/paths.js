import PATH from "path"
import { fileURLToPath } from "url"

const ROOT_DIR = PATH.resolve(PATH.dirname(fileURLToPath(import.meta.url)), "..");

export const BUILD_DIR = PATH.join(ROOT_DIR, "build");
export const STABLECOINS_DIR = PATH.join(ROOT_DIR, "icons", "stablecoins");
export const OTHER_DIR = PATH.join(ROOT_DIR, "icons", "other");
export const TEMPLATES_DIR = PATH.join(ROOT_DIR, "template");
export const ALIASES_PATH = PATH.join(ROOT_DIR, "aliases.json");
