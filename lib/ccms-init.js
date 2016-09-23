import fs from 'fs';
import { execSync } from 'child_process';

import program from 'commander';
import validate from 'validate-npm-package-name';
import unzipper from 'unzipper';

import log from './log';
import download from './download';

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
			// TODO: modify package.json
			entry.pipe(fs.createWriteStream(newPath));
		}
	})
	.on('close', () => {
		const cmd = 'npm install --registry=http://r.cnpmjs.org/';
		log.info(`\n\n=> Install project dependencies [${projectName}]:\n`, cmd);
		execSync(cmd, { cwd: projectName, stdio: 'inherit' });
	})
	.on('error', (error) => {
		log.error(error);
	});

