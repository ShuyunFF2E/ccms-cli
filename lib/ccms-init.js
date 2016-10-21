import fs from 'fs';

import program from 'commander';
import validate from 'validate-npm-package-name';

import log from './log';
import { noFailure } from './util';
import downloadSeed from './download-seed';
import downloadPortal from './download-portal';
import preparePackage from './prepare-package';
import prepareRouter from './prepare-router';
import installDependencies from './install-dependencies';

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

(async function initProject() {
	await noFailure(() => downloadSeed(projectName));
	await noFailure(() => downloadPortal(projectName));
	await preparePackage(projectName);
	await prepareRouter(projectName);
	await installDependencies(projectName);
})()
	.then(() => {
		log.info('\nRun `npm start` to start development.\n')
	})
	.catch((e) => {
		log.error(`\n${e.message}`);
	});

