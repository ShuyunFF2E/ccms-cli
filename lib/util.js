import log from './log';

export const noFailure = (promiseFn, times = 3) => {
	let timesRemain = times;

	return new Promise((resolve, reject) => {
		(async function () {
			while (--timesRemain > -1) {
				await promiseFn()
					.then((value) => {
						timesRemain = 0;
						resolve(value);
					})
					.catch((e) => {
						if (timesRemain < 1) {
							reject(e);
						} else {
							log.error(`\n${e.message}`, `retry: ${times - timesRemain}`);
						}
					});
			}
		})();
	});
};

