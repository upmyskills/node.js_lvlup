const process = require('process');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { validateConfig, validateTemplate } = require('./utils');
const { CustomTransformStream } = require('./CustomTransformStream');
const { CustomWriteStream } = require('./CustomWriteStream');
const { CustomReadStream } = require('./CustomReadStream');

const configCommand = ['-c', '--config'];
const outputCommand = ['-o', '--output'];
const inputCommand = ['-i', '--input'];
const currentConfig = { conf: [], outputFileName: '', inputFileName: ''};

const args = process.argv.slice(2);

validateTemplate(args, inputCommand);
validateTemplate(args, outputCommand);
validateTemplate(args, configCommand);

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

const tr = currentConfig.conf.map((code) => new CustomTransformStream(code));

const stdout = currentConfig.outputFileName ? new CustomWriteStream(`./${currentConfig.outputFileName}`) : process.stdout;
const stdin = currentConfig.inputFileName ? new CustomReadStream(`./${currentConfig.inputFileName}`) : process.stdin;

const piplineAsync = promisify(pipeline);
(async () => {
  try {
    await piplineAsync(
      stdin,
      ...tr,
      stdout,
    );
  }
  catch(err) {
    console.log('Error!\n', err);
  }
})();

// pipeline(stdin, ...tr, stdout, (err) => { console.log(err) });

console.log(currentConfig);
