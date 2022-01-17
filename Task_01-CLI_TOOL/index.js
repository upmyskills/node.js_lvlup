const process = require('process');
const fs = require('fs');
const { pipeline } = require('stream');
const { CustomTransformStream } = require('./CustomTransformStream');

const configCommand = ['-c', '--config'];
const outputCommand = ['-o', '--output'];
const inputCommand = ['-i', '--input'];
const currentConfig = { conf: '', outputFileName: 'outfile.txt', inputFileName: 'datafile.txt'};

const args = process.argv.slice(2);

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

const tr = currentConfig.conf.map((code) => new CustomTransformStream(code));
pipeline(process.stdin, ...tr, process.stdout, err => { console.log(err)});

console.log(currentConfig);