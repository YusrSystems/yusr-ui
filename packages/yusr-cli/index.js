#!/usr/bin/env node

import { program } from 'commander';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';


program
  .version('1.0.0')
  .description('Yusr Systems Project Initializer');

program
  .command('create')
  .description('Create a new project with Yusr Systems')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: 'my-yusr-app',
        },
        {
          type: 'list',
          name: 'framework',
          message: 'Which framework would you like to use?',
          choices: ['Next.js', 'Vite (React)'],
        },
      ]);

      const { projectName, framework } = answers;
      const projectPath = path.join(process.cwd(), projectName);

      console.log(chalk.blue.bold(`\n🚀 Creating ${framework} project: ${projectName}...`));

      if (framework === 'Next.js') {
        console.log(chalk.yellow('📦 Bootstrapping Next.js...'));
        await execa('npx', ['create-next-app@latest', projectName, '--ts', '--tailwind', '--eslint', '--app', '--src-dir', 'false', '--import-alias', '@/*'], { stdio: 'inherit' });
      } else {
        console.log(chalk.yellow('📦 Bootstrapping Vite...'));
        await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react-ts'], { stdio: 'inherit' });
        
        console.log(chalk.yellow('📦 Installing base Vite dependencies...'));
        await execa('npm', ['install'], { cwd: projectPath, stdio: 'inherit' });
        
        // Vite needs Tailwind installed manually because it doesn't come built-in like Next.js
        console.log(chalk.yellow('📦 Adding Tailwind CSS to Vite...'));
        await execa('npm', ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], { cwd: projectPath, stdio: 'inherit' });
        await execa('npx', ['tailwindcss', 'init', '-p'], { cwd: projectPath, stdio: 'inherit' });
      }

      console.log(chalk.yellow('\n📦 Installing @yusr_systems packages...'));
      await execa('npm', ['install', '@yusr_systems/ui', '@yusr_systems/core'], { cwd: projectPath, stdio: 'inherit' });

      console.log(chalk.yellow('\n🎨 Setting up shadcn/ui...'));
      await execa('npx', ['shadcn-ui@latest', 'init', '-y'], { cwd: projectPath, stdio: 'inherit' });

      console.log(chalk.yellow('\n🛠️ Applying Yusr Custom Styles...'));
      const customCss = `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        :root { --yusr-primary: 200 100% 50%; }
        body { background: white; color: black; }
      `;

      const cssPath = framework === 'Next.js' 
        ? path.join(projectPath, 'app/globals.css') 
        : path.join(projectPath, 'src/index.css');

      await fs.writeFile(cssPath, customCss);

      console.log(chalk.green.bold(`\n✨ Success! Your ${framework} project is ready.`));
      console.log(chalk.cyan(`\nRun these commands to start:\n  cd ${projectName}\n  npm run dev`));

    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);