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
    const fileNameSplit = file.replace(".svg", "").split("-");
    let fundName, interestName, stableName, growthName;

    if (fileNameSplit.length === 3) {
      [fundName, interestName, stableName] = fileNameSplit;
    } else {
      [growthName, fundName, interestName, stableName] = fileNameSplit;
    }

    if (!fundName || !interestName || !stableName) throw "Error name";

    if (!symbols.includes(fundName)) symbols.push(fundName);
    if (!symbols.includes(interestName)) symbols.push(interestName);
    if (!symbols.includes(stableName)) symbols.push(stableName);
    if (growthName && !symbols.includes(growthName)) symbols.push(growthName);

    FS.readFile(filePathStablecoins + "/" + file, 'utf8', function (_, fileIcon) {
      FS.readFile(filePathStable, 'utf8', function (_, fileStableTemplate) {
        const res = fileStableTemplate.replace("{{logo}}", fileIcon);
        const normalRes = String(res).replace(/{{color}}/g, "black");
        const inverseRes = String(res).replace(/{{color}}/g, "white");
        const normalResBuffer = Buffer.from(normalRes, 'utf-8');
        const inverseResBuffer = Buffer.from(inverseRes, 'utf-8');

        const optimizeNormalRes = optimize(normalResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        const inverseNormalRes = optimize(inverseResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        FS.writeFileSync(__dirname + `/${buildFolderName}/${stableName}.svg`, optimizeNormalRes.data);
        FS.writeFileSync(__dirname + `/${buildFolderName}/${stableName}-INV.svg`, inverseNormalRes.data);
      })

      FS.readFile(filePathInterest, 'utf8', function (_, fileInterestTemplate) {
        const res = fileInterestTemplate.replace("{{logo}}", fileIcon);
        const normalRes = String(res).replace(/{{color}}/g, "black");
        const inverseRes = String(res).replace(/{{color}}/g, "white");
        const normalResBuffer = Buffer.from(normalRes, 'utf-8');
        const inverseResBuffer = Buffer.from(inverseRes, 'utf-8');

        const optimizeNormalRes = optimize(normalResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        const inverseNormalRes = optimize(inverseResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        FS.writeFileSync(__dirname + `/${buildFolderName}/${interestName}.svg`, optimizeNormalRes.data);
        FS.writeFileSync(__dirname + `/${buildFolderName}/${interestName}-INV.svg`, inverseNormalRes.data);
      })

      FS.readFile(filePathFund, 'utf8', function (_, fileFundTemplate) {
        const res = fileFundTemplate.replace("{{logo}}", fileIcon);
        const normalRes = String(res).replace(/{{color}}/g, "black");
        const inverseRes = String(res).replace(/{{color}}/g, "white");
        const normalResBuffer = Buffer.from(normalRes, 'utf-8');
        const inverseResBuffer = Buffer.from(inverseRes, 'utf-8');

        const optimizeNormalRes = optimize(normalResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        const inverseNormalRes = optimize(inverseResBuffer, {
          plugins: [
            { name: 'removeAttrs', params: { attrs: '(width|height)' } },
          ]
        });

        FS.writeFileSync(__dirname + `/${buildFolderName}/${fundName}.svg`, optimizeNormalRes.data);
        FS.writeFileSync(__dirname + `/${buildFolderName}/${fundName}-INV.svg`, inverseNormalRes.data);

        if (growthName) {
          FS.writeFileSync(__dirname + `/${buildFolderName}/${growthName}.svg`, optimizeNormalRes.data);
          FS.writeFileSync(__dirname + `/${buildFolderName}/${growthName}-INV.svg`, inverseNormalRes.data);
        }
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
    const invNewPath = __dirname + `/${buildFolderName}/` + file.replace(".svg", "") + "-INV.svg";
    const symbol = file.replace(".svg", "");

    if (!symbols.includes(symbol)) {
      symbols.push(symbol);
    }

    FS.readFile(oldPath, 'utf8', function (_, otherFile) {
      const otherFileBuffer = Buffer.from(otherFile, 'utf-8');

      const optimizeRes = optimize(otherFileBuffer, {
        plugins: [
          { name: 'removeAttrs', params: { attrs: '(width|height)' } },
        ]
      });

      FS.writeFileSync(newPath, optimizeRes.data);
      FS.writeFileSync(invNewPath, optimizeRes.data);
    })
  })
  FS.readFile(__dirname + `/${buildFolderName}/list.json`, 'utf8', function (_, listFile) {
    const oldArray = JSON.parse(listFile);
    const newArray = [...oldArray, ...symbols];
    FS.writeFileSync(__dirname + `/${buildFolderName}/list.json`, JSON.stringify(newArray));
  })
})