import FS from "fs"
import PATH from "path"
import { fileURLToPath } from 'url';
import { optimize } from "svgo"

const __dirname = PATH.dirname(fileURLToPath(import.meta.url));

const filePathStable = PATH.resolve(__dirname, './template/stable.svg');
const filePathInterest = PATH.resolve(__dirname, './template/interest.svg');
const filePathFund = PATH.resolve(__dirname, './template/fund.svg');

const filePathStablecoins = __dirname + "/icons/stablecoins";

const buildFolderName = "build";

if (!FS.existsSync(__dirname + "/" + buildFolderName)) {
  FS.mkdirSync(__dirname + "/" + buildFolderName);
}


FS.readdir(filePathStablecoins, (_, files) => {
  let symbols = [];
  files.forEach(file => {
    if (file === ".DS_Store") return;
    const [fundName, interestName, stableName] = file.replace(".svg", "").split("-");
    if (!fundName || !interestName || !stableName) throw "Error name";
    symbols = [...symbols, fundName, interestName, stableName]
    FS.readFile(filePathStablecoins + "/" + file, 'utf8', function (_, fileIcon) {
      FS.readFile(filePathStable, 'utf8', function (_, fileStableTemplate) {
        const res = fileStableTemplate.replace("{{logo}}", fileIcon);
        const resBuffer = Buffer.from(res, 'utf-8');
        const optimizeRes = optimize(resBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });
        FS.writeFileSync(__dirname + `/${buildFolderName}/${stableName}.svg`, optimizeRes.data);
      })

      FS.readFile(filePathInterest, 'utf8', function (_, fileInterestTemplate) {
        const res = fileInterestTemplate.replace("{{logo}}", fileIcon);

        const resBuffer = Buffer.from(res, 'utf-8');
        const optimizeRes = optimize(resBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        FS.writeFileSync(__dirname + `/${buildFolderName}/${interestName}.svg`, optimizeRes.data);
      })

      FS.readFile(filePathFund, 'utf8', function (_, fileFundTemplate) {
        const res = fileFundTemplate.replace("{{logo}}", fileIcon);
        const resBuffer = Buffer.from(res, 'utf-8');
        const optimizeRes = optimize(resBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });
        FS.writeFileSync(__dirname + `/${buildFolderName}/${fundName}.svg`, optimizeRes.data);
      });
    })
  });
  FS.writeFileSync(__dirname + `/${buildFolderName}/list.json`, JSON.stringify(symbols));
});

FS.readdir(__dirname + "/icons/other", (_, files) => {
  const symbols = [];
  files.forEach(file => {
    if (file === ".DS_Store") return;
    const oldPath = __dirname + "/icons/other/" + file;
    const newPath = __dirname + `/${buildFolderName}/` + file;
    symbols.push(file.replace(".svg", ""));
    FS.readFile(oldPath, 'utf8', function (_, otherFile) {
      const otherFileBuffer = Buffer.from(otherFile, 'utf-8');

      const optimizeRes = optimize(otherFileBuffer, {
        plugins: [
          { name: 'removeAttrs', params: { attrs: '(width|height)' } },
        ]
      });

      FS.writeFileSync(newPath, optimizeRes.data);
    })
  })
  FS.readFile(__dirname + `/${buildFolderName}/list.json`, 'utf8', function (_, listFile) {
    const oldArray = JSON.parse(listFile);
    const newArray = [...oldArray, ...symbols];
    FS.writeFileSync(__dirname + `/${buildFolderName}/list.json`, JSON.stringify(newArray));
  })
})