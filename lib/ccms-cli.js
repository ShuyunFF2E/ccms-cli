import program from 'commander';
import { version } from '../package';

program
	.version(version)
	.usage('<command> [options]')
	.command('new <project-name>', '创建一个 ccms 子项目')
	.parse(process.argv);

