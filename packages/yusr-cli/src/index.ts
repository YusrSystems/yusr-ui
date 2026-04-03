#!/usr/bin/env node

import { program } from "commander";
import execa from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import os from "os";
import YusrDefaultCss from "./yusr_default_code/yusr_default_css";

interface ProjectAnswers {
  projectName: string;
  framework: "Next.js" | "Vite (React)";
}

program.version("1.0.0").description("Yusr Systems Project Initializer");

program
  .command("create")
  .description("Create a new project using the Yusr environment")
  .action(async (): Promise<void> => {
    try {
      const answers: ProjectAnswers = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "What is your project name?",
          default: "my-yusr-app",
        },
        {
          type: "list",
          name: "framework",
          message: "Which framework would you like to use?",
          choices: ["Next.js", "Vite (React)"],
        },
      ]);

      const { projectName, framework } = answers;
      const finalDestination = path.resolve(process.cwd(), projectName);

      // Extract a safe folder name
      const safeName = path.basename(finalDestination);

      // 1. SAFE CLEANUP
      if (await fs.pathExists(finalDestination)) {
        const { overwrite } = await inquirer.prompt([
          {
            type: "confirm",
            name: "overwrite",
            message: chalk.red(
              `⚠️  Directory "${projectName}" already exists. Overwrite it?`,
            ),
            default: false,
          },
        ]);

        if (!overwrite) {
          console.log(chalk.yellow("❌ Initialization aborted."));
          process.exit(1);
        }
        await fs.remove(finalDestination);
      }

      console.log(
        chalk.blue.bold(`\n🚀 Initializing your ${framework} project...`),
      );

      // 2. CREATE A TEMPORARY DIRECTORY
      const tempDir = path.join(os.tmpdir(), `yusr-init-${Date.now()}`);
      await fs.ensureDir(tempDir);

      try {
        const template = framework === "Next.js" ? "next" : "vite";

        // 3. RUN SHADCN IN THE TEMP DIRECTORY
        // Using your discovered flags: -n, -d, -b radix, and --no-monorepo
        await execa(
          "npx",
          [
            "shadcn@latest",
            "init",
            "-t",
            template,
            "-n",
            safeName,
            "-b",
            "radix",
            "-d",
            "--no-monorepo",
            "--preset",
            "nova",
            "--rtl",
          ],
          {
            cwd: tempDir,
            stdio: "inherit",
          },
        );

        // 4. MOVE THE PROJECT TO THE FINAL DESTINATION
        const createdProjectPath = path.join(tempDir, safeName);
        await fs.move(createdProjectPath, finalDestination);

        console.log(chalk.green("\n✅ Project created and configured."));
      } finally {
        // Always clean up the temp directory
        await fs.remove(tempDir);
      }

      // 5. INSTALL YUSR PACKAGES
      console.log(
        chalk.yellow("\n📦 Installing @yusr_systems dependencies..."),
      );
      await execa(
        "npm",
        [
          "install",
          "@yusr_systems/ui",
          "@yusr_systems/core",
          "--legacy-peer-deps",
        ],
        {
          cwd: finalDestination,
          stdio: "inherit",
        },
      );
      console.log(chalk.green("✅ Packages installed."));

      // 6. FINAL CSS OVERRIDE
      console.log(chalk.yellow("\n🛠️  Applying Yusr custom styles..."));

      const cssPath =
        framework === "Next.js"
          ? path.join(finalDestination, "app/globals.css")
          : path.join(finalDestination, "src/index.css");

      const customCss = YusrDefaultCss.getDefaultCss(framework);
      // Append our custom CSS to the bottom of the file
      await fs.writeFile(cssPath, customCss);
      console.log(chalk.green("✅ Styles applied."));

      console.log(
        chalk.green.bold(`\n✨ Success! Your project ${projectName} is ready.`),
      );
      console.log(
        chalk.cyan(`\nNext steps:\n  cd ${projectName}\n  npm run dev\n`),
      );
    } catch (error: any) {
      console.error(chalk.red("\n❌ An error occurred:"), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
