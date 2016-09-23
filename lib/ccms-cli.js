import program from 'commander';
import { version } from '../package';

program
	.version(version)
	.usage('<command> [options]')
	.command('init <project-name>', '初始化一个 ccms 子项目')
	.parse(process.argv);

