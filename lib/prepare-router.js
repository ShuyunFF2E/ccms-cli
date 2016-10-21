import fs from 'fs';

import log from './log';

const createProjectRouter = (projectPath) => {
	const projectRouterContent = `
angular
	.module('ccmsApp')
	.config(projectConfig)
	.run(redirect);

projectConfig.$inject = ['$projectProvider'];
function projectConfig($projectProvider) {
	$projectProvider
		.state('app', {
			url: '/app',
			templateUrl: '/app/index.html'
		});
}

redirect.$inject = ['$rootScope', '$state'];
function redirect($rootScope, $state) {
	$rootScope.$on('$stateChangeSuccess', function (_, toState, toParams) {
		if (toState.name === 'insert' && toParams.context === 'index') {
			$state.go('app');
		}
	});
}

`;
	fs.writeFileSync(`${projectPath}/portal/project.js`, projectRouterContent);
};

const setPortalIndex = projectPath => new Promise((resolve, reject) => {
	const portalIndex = `${projectPath}/portal/index.html`;

	try {
		const oldContent = fs.readFileSync(portalIndex, { encoding: 'UTF-8' });
		const newContent = oldContent.replace(
			/(<\/body>)/,
			'<script src="/portal/project.js"></script>$1'
		);
		fs.writeFileSync(portalIndex, newContent);
		resolve();
	} catch (e) {
		reject(e);
	}
});

const prepareRouter = projectPath => new Promise((resolve, reject) => {
	log.info('\n=> Set project router:', '/portal/project.js');
	try {
		createProjectRouter(projectPath);
		setPortalIndex(projectPath);
		resolve();
	} catch (e) {
		reject(e);
	}
});

export default prepareRouter;

