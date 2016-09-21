import path from 'path';

import request from 'request';
import statusBar from 'status-bar';

const download = (url) => {
	let bar;
	return request
		.get(url)
		.on('response', (response) => {
			const statusCode = response.statusCode;

			if (statusCode !== 200) {
				throw new Error(`${statusCode} ${response.statusMessage}`);
			}

			bar = statusBar
				.create({
					total: response.headers['content-length']
				})
				.on('render', (stats) => {
					process.stdout.write([
						path.basename(url),
						bar.format.storage(stats.currentSize),
						bar.format.speed(stats.speed),
						bar.format.time(stats.remainingTime),
						`[${bar.format.progressBar(stats.percentage)}]`,
						bar.format.percentage(stats.percentage)
					].join(' '));
					process.stdout.cursorTo(0);
				});

			response.pipe(bar);
		})
		.on('error', (error) => {
			if (bar) {
				bar.cancel();
			}
			throw new Error(error);
		});
};

export default download;

