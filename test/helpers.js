import FS from "fs"
import OS from "os"
import PATH from "path"

// временная папка для теста; удалять через removeTmpDir в after()
export function makeTmpDir() {
  return FS.mkdtempSync(PATH.join(OS.tmpdir(), "obyte-icons-test-"));
}

export function removeTmpDir(dir) {
  FS.rmSync(dir, { recursive: true, force: true });
}

export function read(dir, file) {
  return FS.readFileSync(PATH.join(dir, file), "utf8");
}

export function write(dir, file, content) {
  FS.writeFileSync(PATH.join(dir, file), content);
}
