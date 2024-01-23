import {Command} from 'commander';
import reverse from './core';

const program = new Command();

program
  .option('-p, --ports <ports...>', 'Ports that need to be reversed')
  .parse();

const options = program.opts<{ports?: number[]}>();

if (options.ports == null) {
  reverse([8081]);
} else {
  reverse(options.ports);
}
