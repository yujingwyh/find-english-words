const lineReader = require('line-reader');
const Promise = require('promise');
const ora = require('ora');

const path = './lib/english-words.txt';

function findInDictionary(argWords) {
  return new Promise(function (resolve) {
    const spinner = ora('find english words').start();
    let word, data,
      total = 0,
      words = [];

    lineReader.eachLine(path, {encoding: 'utf8'}, function (line, last, cb) {
      data = line.split(' ');
      word = data[0];

      if (argWords[word]) {
        words.push({
          word: word,
          frequency: argWords[word],
          explain: data[data.length - 1]
        });
        total++;
        spinner.text = `find english words（${total}）`;
      }

      if (last) {
        spinner.succeed();
        resolve(words);
      }

      cb();
    });
  });
}

module.exports = async function (contents) {
  const spinner = ora('find words in contents').start();

  let total = 0;
  let words = {};

  for (let len = contents.length - 1; len >= 0; len--) {
    contents[len].replace(/[a-z]*/ig, function (content) {
      //驼峰转换
      content.replace(/.[^A-Z]*/g, function (word) {
        word = word.toLowerCase();

        if (words[word]) {
          words[word]++;
        }
        else {
          words[word] = 1;
        }
        total++;
        spinner.text = `find words（${total}） in contents`;
      })
    })
  }
  spinner.succeed();

  return await findInDictionary(words);
};
