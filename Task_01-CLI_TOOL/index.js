const process = require('process');
const { createWriteStream, createReadStream } = require('fs');
const { pipeline } = require('stream');
const { CustomTransformStream } = require('./CustomTransformStream');
const { validateConfig, validateTemplate } = require('./utils');

const configCommand = ['-c', '--config'];
const outputCommand = ['-o', '--output'];
const inputCommand = ['-i', '--input'];
const currentConfig = { conf: '', outputFileName: '', inputFileName: ''};

const args = process.argv.slice(2);

console.log();

validateTemplate(args, inputCommand);
validateTemplate(args, outputCommand);
validateTemplate(args, configCommand);

console.log(args);

for (let i = 0; i < args.length; i += 2) {
  const [tempParam, tempVal] = args.slice(i, args.length);
  
  if (configCommand.includes(tempParam)) {
    currentConfig.conf = tempVal.split('-');
  }
  
  if (inputCommand.includes(tempParam)) {
    currentConfig.inputFileName = tempVal;
  }
  
  if (outputCommand.includes(tempParam)) {
    currentConfig.outputFileName = tempVal;
  }
}

validateConfig(currentConfig.conf);

const stdout = currentConfig.outputFileName ? createWriteStream(`./${currentConfig.outputFileName}`) : process.stdout;
const stdin = currentConfig.inputFileName ? createReadStream(`./${currentConfig.inputFileName}`) : process.stdin;

const tr = currentConfig.conf.map((code) => new CustomTransformStream(code));

pipeline(stdin, ...tr, stdout, (err) => { process.stderr.write(err)});

console.log(currentConfig);