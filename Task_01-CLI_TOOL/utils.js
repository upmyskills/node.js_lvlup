const validateConfig = (conf) => {
  const regExp = /(A)|(C[1|0])|(R[1|0])/;
  for (let i = 0; i < conf.length; i++) {
    if (conf[i].match(regExp) === null) {
      process.stderr.write('Wrong config parameter!');
      process.exit(25);
    }
  }
};

const validateTemplate = (args, config) => {
  const argCount = args.filter((arg) => config.includes(arg)).length;
  if (argCount > 1) {
    process.stderr.write(`Wrong config keys count! [${config}] - ${argCount}`);
    process.exit(26);
  };
};

module.exports = {
  validateConfig,
  validateTemplate,
};