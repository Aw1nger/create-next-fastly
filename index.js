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

  console.log(chalk.yellow("📂 Copying template files..."));

  if (fs.existsSync(templatesDir)) {
    const projectDir = process.cwd();
    fs.readdirSync(templatesDir).forEach((file) => {
      const srcFile = path.join(templatesDir, file);
      const destFile = path.join(projectDir, file);

      // if (fs.existsSync(destFile)) {
      //   fs.rmSync(destFile);
      //   console.log(chalk.yellow(`⚠ Overwriting ${file}...`));
      // }

      fs.copyFileSync(srcFile, destFile);
      console.log(chalk.green(`✔ Copied ${file} to project.`));
    });
  } else {
    console.log(chalk.red("⚠ No templates folder found. Skipping..."));
  }


  console.log(chalk.green("✅ Install complete! Run dev-server..."));
  execSync("pnpm dev", { stdio: "inherit" });
});

program.parse();