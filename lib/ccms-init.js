import fs from 'fs';
import { execSync } from 'child_process';

import program from 'commander';
import validate from 'validate-npm-package-name';
import unzipper from 'unzipper';
import fse from 'fs-extra';

import log from './log';
import download from './download';
import { noFailure } from './util';

program
	.usage('<project-name>')
	.parse(process.argv);

const args = program.args;

if (program.args.length !== 1) {
	program.help();
}

const projectName = args[0];
const validateInfo = validate(projectName);

// 验证 package name
if (!validateInfo.validForNewPackages) {
	log.error([
		...(validateInfo.errors || []),
		...(validateInfo.warnings || [])
	].join('\n'));
	process.exit(1);
}

// 创建项目目录
try {
	fs.mkdirSync(projectName);
} catch (e) {
	if (e.code === 'EEXIST') {
		log.error(`"${projectName}" is already existed.`);
		process.exit(1);
	}
	throw e;
}

// 下载项目模版
const downloadSeed = () => new Promise((resolve, reject) => {
	const projectSeedPackage = 'https://github.com/ShuyunFF2E/ccms-angular-styleguide/archive/master.zip';

	log.info('\n=> Download project seed:\n', projectSeedPackage);

	download(projectSeedPackage)
		.pipe(unzipper.Parse())
		.on('entry', (entry) => {
			const
				oldPath = entry.path,
				newPath = `${projectName}/${oldPath.slice(oldPath.indexOf('/') + 1)}`;

			if (newPath.endsWith('/')) {
				try {
					fs.mkdirSync(newPath);
				} catch (e) {
					if (e.code !== 'EEXIST') {
						throw e;
					}
				}
			} else {
				entry.pipe(fs.createWriteStream(newPath));
			}
		})
		.on('close', () => {
			resolve();
		})
		.on('error', (error) => {
			log.error(error);
		});
})
	.catch((e) => {
		fse.removeSync(projectName);
		throw new Error('=> Download project seed fail.');
	});

// 下载 portal
const downloadPortal = () => new Promise((resolve, reject) => {
	const portalPackage = 'http://114.215.169.170:8080/portal.zip';

	log.info('\n\n=> Download portal:\n', portalPackage);

	download(portalPackage)
		.pipe(unzipper.Extract({ path: projectName }))
		.on('close', () => {
			resolve();
		})
		.on('error', () => {
			reject();
		});
})
	.catch((e) => {
		throw new Error('=> Download portal fail.')
	});

// 安装依赖
const installDependencies = () => new Promise((resolve, reject) => {
	const cmd = 'npm install --registry=http://r.cnpmjs.org/';
	log.info(`\n\n=> Install project dependencies [${projectName}]:\n`, cmd);
	execSync(cmd, { cwd: projectName, stdio: 'inherit' });
	resolve();
})
	.catch((e) => {
		throw new Error(`依赖安装失败，请在[${projectName}]中运行\`npm install\`手动安装。`);
	});

(async function initProject() {
	await noFailure(downloadSeed);
	await noFailure(downloadPortal);
	await installDependencies();
})()
	.then(() => {
		log.info('\nRun `npm start` to start development.\n')
	})
	.catch((e) => {
		log.error(`\n${e.message}`);
	});

