// This script modifies the package.json files of the shared packages to point
// to the compiled output, so that the dependent packages (e.g. the API server)
// can resolve them correctly in the final Docker image.

const fs = require("fs");

for (const p of fs.readdirSync("./packages")) {
  if (!fs.statSync(`./packages/${p}`).isDirectory()) {
    continue;
  }

  const f = `./packages/${p}/package.json`;
  if (!fs.existsSync(f)) {
    continue;
  }
  console.log(`Patching ${f}...`);

  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  j.main = "./dist/index.js";
  j.types = "./dist/index.d.ts";
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
}
