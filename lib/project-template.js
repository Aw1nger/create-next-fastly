import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { execSync } from "child_process";

const sharedFolders = ["action", "provider", "lib", "model"];
const baseComponents = ["button", "input", "form", "textarea", "checkbox", "sonner", "dialog", "dropdown-menu"]

export const ProjectTemplate = () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatesDir = path.join(__dirname, "..", "templates");
  const projectDir = process.cwd();


  if (fs.existsSync(templatesDir)) {
    console.log(chalk.cyan("📂 Copying config files..."));
    fs.readdirSync(templatesDir).forEach((file) => {
      const srcFile = path.join(templatesDir, file);
      const destFile = path.join(projectDir, file);

      if (!fs.statSync(srcFile).isDirectory()) {
        fs.copyFileSync(srcFile, destFile);
      }
    });

    console.log(chalk.cyan("📂 Copying shared folder files..."));
    fs.readdirSync(templatesDir).forEach((file) => {
      const srcFile = path.join(templatesDir, file);
      const destFile = path.join(projectDir, "src", "shared", file);

      if (sharedFolders.some((folder) => path.basename(srcFile) === folder)) {
        fs.cpSync(srcFile, destFile, { recursive: true });
      }
    });

    const srcFile = path.join(projectDir, "src", "lib", "utils.ts");
    const destFolder = path.join(projectDir, "src", "shared", "lib");

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    fs.renameSync(srcFile, path.join(destFolder, "utils.ts"));

    if (fs.existsSync(path.join(projectDir, "src", "lib"))) {
      fs.rmdirSync(path.join(projectDir, "src", "lib"));
    }

    console.log(chalk.cyan("📂 Copying entities folder files..."));
    if (fs.existsSync(path.join(templatesDir, "entities"))) {
      const entitiesDir = path.join(templatesDir, "entities");

      fs.readdirSync(entitiesDir).forEach((file) => {
        const srcFile = path.join(entitiesDir, file);
        const destFile = path.join(projectDir, "src", "entities", file);

        fs.cpSync(srcFile, destFile, { recursive: true });
      });
    }

    console.log(chalk.cyan("📂 Update app folder..."));
    if (fs.existsSync(path.join(templatesDir, "app"))) {
      const appDir = path.join(templatesDir, "app");

      fs.readdirSync(appDir).forEach((file) => {
        const srcFile = path.join(appDir, file);
        const destFile = path.join(projectDir, "src", "app", file);

        fs.cpSync(srcFile, destFile, { recursive: true });
      });
    }

    console.log(chalk.cyan("📂 Installing shadcn/ui components..."));
    execSync(`pnpm dlx shadcn@latest add ${baseComponents.join(" ")}`, { stdio: "inherit" });

  } else {
    console.log(chalk.red("⚠ No templates folder found. Skipping..."));
  }
};