import fs from 'fs';
import Path from 'path';

import fse from 'fs-extra';
import unzipper from 'unzipper';

import log from './log';
import download from './download';

// 下载项目模版
const downloadSeed = projectPath => new Promise((resolve, reject) => {
	const projectName = Path.basename(projectPath);
	const projectSeedPackage = 'https://github.com/ShuyunFF2E/ccms-angular-styleguide/archive/master.zip';

	log.info('\n=> Download project seed:\n', projectSeedPackage);

	try {
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
	} catch (e) {
		fse.removeSync(projectName);
		throw new Error('=> Download project seed fail.');
	}
});

export default downloadSeed;

