import chalk from "chalk";
import { execSync } from "child_process";

const depsList = [
  "zod",
  "@tanstack/react-query",
  "axios",
  "react-hook-form",
  "use-mask-input",
  "zustand",
  "prettier",
  "prettier-plugin-organize-imports",
  "prettier-plugin-tailwindcss",
  "eslint-plugin-prettier",
  "@next/eslint-plugin-next",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "jsonwebtoken",
  "js-cookie",
  "@types/jsonwebtoken",
  "@types/js-cookie"
];

const spinner = ["|", "/", "-", "\\"];

export const InstallDeps = () => {
  let spinnerIndex = 0;
  const interval = setInterval(() => {
    process.stdout.write(`\r${chalk.blue("📦 Installing dependencies...")} ${spinner[spinnerIndex]}`);
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
  }, 100);

  try {
    execSync(`bun install ${depsList.join(" ")}`, {
      stdio: ["ignore", process.stderr],
    });
    clearInterval(interval);
    console.log(chalk.green("\n✅ Dependencies installed successfully!"));
  } catch (error) {
    clearInterval(interval);
    console.log(chalk.red("\n❌ Error installing dependencies."));
  }
};
