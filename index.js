#!/usr/bin/env node

import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { InstallDeps } from "./lib/install-deps.js";
import { MakeFSD } from "./lib/fsd-folders.js";
import { ProjectTemplate } from "./lib/project-template.js";

const program = new Command();

program
  .name("create-next-fastly")
  .description("CLI for fast development NextJS apps")
  .version("1.0.0");

program.argument("<project-name>", "project name").action((projectName) => {
  console.log(chalk.green(`🚀 Creating project: ${projectName}...`));
  execSync(
    `pnpm dlx create-next-app@latest ${projectName} --use-pnpm --tailwind --ts --eslint --app --src-dir --turbopack --import-alias @/*`,
    { stdio: "inherit" },
  );

  process.chdir(projectName);

  console.log(chalk.blue("🖌 Installing ShadCN UI..."));
  execSync("pnpm dlx shadcn@latest init -d", { stdio: "inherit" });

  InstallDeps();
  MakeFSD();
  ProjectTemplate();

  console.log(chalk.green("✅ Install complete! Run dev-server..."));
  execSync("pnpm dev", { stdio: "inherit" });
});

program.parse();
