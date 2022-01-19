const { Transform } = require('stream');

class CustomTransformStream extends Transform {
  constructor(conf) {
    super();
    this.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.subAlphabet = [];
    [this.code, this.variant] = conf.split('');
    // console.log(`Current config is ${this.code} ${this.variant}!`);
  }

  _construct(cb) {
    let step;
    const alphLength = this.alphabet.length;
    if (this.code === 'R') step = 8;
    if (this.code === 'C') step = 1;

    if (this.variant == true) {
      this.subAlphabet = [...this.alphabet.slice(step), ...this.alphabet.slice(0, step)];
    } else if (typeof(this.variant) === 'undefined') {
      this.subAlphabet = [...this.alphabet].reverse();
    } else {
      this.subAlphabet = [...this.alphabet.slice(alphLength - step), ...this.alphabet.slice(0, alphLength - step)];
    }
    // console.log(this.subAlphabet);
    cb();
  }

  // _construct() {
  //   console.log(conf);
  //   const [code, variant] = conf.split('');
  //   console.log(code , variant);
  // }
  _transform(chunk, enc, cb) {
    // console.log(`Use ${this.code}${this.variant}!`);
    // console.log(chunk.toString());
    const phrase = chunk.toString().trim().split('');
    const codePhrase = phrase.map((letter) => {
      const isUpperCase = letter === letter.toUpperCase();
      const index = this.alphabet.indexOf(letter.toUpperCase());
      if (!this.alphabet.includes(letter.toUpperCase())) return letter;
      return isUpperCase ? this.subAlphabet[index].toUpperCase() : this.subAlphabet[index].toLowerCase();
    });
    // console.log(codePhrase);
    this.push(`${codePhrase.join('')}\n`);

    cb();
  }
}

module.exports = { CustomTransformStream };