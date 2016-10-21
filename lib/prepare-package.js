import fs from 'fs';
import Path from 'path';

import log from './log';

const preparePackage = projectPath => new Promise((resolve, reject) => {
	log.info('\n\n=> Update package.json');
	const projectName = Path.basename(projectPath);
	const jsonFile = `${projectPath}/package.json`;
	try {
		const oldContent = fs.readFileSync(jsonFile, { encoding: 'UTF-8' });
		const newContent = oldContent.replace(
			/("name":\s*")[^"]+(")/, `$1${projectName}$2`
		);
		fs.writeFileSync(jsonFile, newContent);
		resolve();
	} catch (e) {
		reject(e);
	}
});

export default preparePackage;

