import Path from 'path';
import { execSync } from 'child_process';

import log from './log';

// 安装依赖
const installDependencies = projectPath => new Promise((resolve, reject) => {
	const projectName = Path.basename(projectPath);
	const cmd = 'npm install --registry=http://r.cnpmjs.org/';
	log.info(`\n=> Install project dependencies [${projectName}]:\n`, cmd);
	try {
		execSync(cmd, { cwd: projectPath, stdio: 'inherit' });
		resolve();
	} catch (e) {
		throw new Error(`依赖安装失败，请在[${projectName}]中运行\`npm install\`手动安装。`);
	}
});

export default installDependencies;

