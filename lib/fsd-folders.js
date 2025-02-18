import fs from "fs";
import path from "path";
import chalk from "chalk";

export const MakeFSD = () => {
  console.log(chalk.cyan("📂 Make FSD folders..."));
  const srcDir = path.join(process.cwd(), "src");
  const fsdDirs = ["shared", "entities", "features", "widgets"];
  fsdDirs.forEach((dir) => {
    fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
    console.log(chalk.green(`✔`), ` Make ${dir}...`);
  });
};
