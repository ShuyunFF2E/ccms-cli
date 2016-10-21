import unzipper from 'unzipper';

import log from './log';
import download from './download';

const downloadPortal = projectPath => new Promise((resolve, reject) => {
	const portalPackage = 'http://114.215.169.170:8080/portal.zip';

	log.info('\n\n=> Download portal:\n', portalPackage);

	try {
		download(portalPackage)
			.pipe(unzipper.Extract({ path: projectPath }))
			.on('close', () => {
				resolve();
			})
			.on('error', () => {
				reject();
			});
	} catch (e) {
		throw new Error('=> Download portal fail.');
	}
});

export default downloadPortal;

