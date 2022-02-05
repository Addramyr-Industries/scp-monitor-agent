const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const Agent = require("./agent/Agent");

const argv = yargs(hideBin(process.argv)).argv;

process.stdout.write('\u001b[3J\u001b[1J');
console.clear();

process.title = 'SCPrime Agent';

console.log(`=`.repeat(process.stdout.columns));
console.log('SCPrime Agent');
console.log(`=`.repeat(process.stdout.columns));

delete argv['_'];
delete argv['$0'];

new Agent(argv);