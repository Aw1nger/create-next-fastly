#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const program = new Command();

program
  .name("create-next-fastly")
  .description("CLI for fast development NextJS apps")
  .version("1.0.0");

program.argument("<project-name>", "project name").action((projectName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatesDir = path.join(__dirname, "templates");

  console.log(chalk.green(`🚀 Creating project: ${projectName}...`));

  execSync(
    `pnpm dlx create-next-app@latest ${projectName} --use-pnpm --tailwind --ts --eslint --app --src-dir --turbopack`,
    { stdio: "inherit" }
  );

  process.chdir(projectName);

  console.log(chalk.blue("🖌 Installing ShadCN UI..."));
  execSync("pnpm dlx shadcn@latest init -d", { stdio: "inherit" });

  console.log(chalk.blue("📦 Installing dependencies..."));
  execSync(
    "pnpm add zod @tanstack/react-query axios react-hook-form use-mask-input zustand prettier prettier-plugin-organize-imports prettier-plugin-tailwindcss eslint-plugin-prettier",
    { stdio: "inherit" }
  );

  console.log(chalk.cyan("📂 Make FSD folders..."));
  const projectDir = process.cwd();
  const srcDir = path.join(projectDir, "src");
  const fsdDirs = ["shared", "entities", "features", "widgets"];
  fsdDirs.forEach((dir) => {
    fs.mkdirSync(path.join(srcDir, dir), { recursive: true });
    console.log(chalk.green(`✔`), ` Make ${dir}...`);
  });

  console.log(chalk.yellow("📂 Copying template files..."));

  if (fs.existsSync(templatesDir)) {
    const projectDir = process.cwd();
    fs.readdirSync(templatesDir).forEach((file) => {
      const srcFile = path.join(templatesDir, file);
      const destFile = path.join(projectDir, file);

      if (fs.statSync(srcFile).isDirectory()) {
        fs.cpSync(srcFile, destFile, { recursive: true });
        console.log(chalk.green(`📁 Copied folder ${file} to project.`));
      } else {
        fs.copyFileSync(srcFile, destFile);
        console.log(chalk.green(`✔ Copied file ${file} to project.`));
      }
    });
  } else {
    console.log(chalk.red("⚠ No templates folder found. Skipping..."));
  }


  console.log(chalk.green("✅ Install complete! Run dev-server..."));
  execSync("pnpm dev", { stdio: "inherit" });
});

program.parse();