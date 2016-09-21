/* eslint no-console: off */
import chalk from 'chalk';

const
	info = chalk.bold.green,
	error = chalk.bold.red,
	warn = chalk.bold.yellow;

const log = (...message) => {
	console.log(...message);
};

Object.assign(log, {
	info(...message) {
		console.log(info(...message));
	},
	error(...message) {
		console.log(error(...message));
	},
	warn(...message) {
		console.log(warn(...message));
	}
});

export default log;

