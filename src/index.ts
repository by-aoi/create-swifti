#!/usr/bin/env node

import inquirer from 'inquirer'
import fs from 'fs-extra'
import { Messages } from './lib/utils/messages'
import path from 'path'

const SwiftiVersion = '^0.2.0'

interface Answers {
	projectName: string
	typescript: boolean
}

async function main() {
	const { projectName, typescript } = (await inquirer.prompt([
		{
			name: 'projectName',
			message: 'What is your project named?',
			default: 'my-app',
		},
		{
			name: 'typescript',
			message: 'Would you like to use TypeScript?',
			type: 'confirm',
		},
	])) as Answers
	const projectPath = path.join(process.cwd(), projectName)
	const exists = await fs.exists(projectPath)
	if (exists) {
		Messages.error(`directory name in use "${projectName}"`)
		return
	}
	const templatePath = path.join(__dirname, `../templates/${typescript ? 'ts' : 'js'}`)
	await fs.copy(templatePath, projectPath)
	const packageJsonPath = path.join(projectPath, 'package.json')
	const packageJson: any = {
		name: path.basename(projectName).toLowerCase(),
		version: '1.0.0',
		scripts: {
			dev: 'swifti',
			build: 'swifti build',
		},
		dependencies: {
			swifti: SwiftiVersion,
		},
	}
	if (typescript) {
		packageJson.devDependencies = {
			typescript: '^5.3.2',
		}
	}
	const packageJsonString = JSON.stringify(packageJson, null, 2)
	await fs.writeFile(packageJsonPath, packageJsonString, 'utf-8')
	Messages.success('project created successfully.')
}

main()
