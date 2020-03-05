const lineReader = require('line-reader');
const Promise = require('promise');
const ora = require('ora');
const path = require('path');

function convertContentsToWord(contents) {
  const spinner = ora('find words in contents').start();

  let total = 0;
  let words = {};

  for (let content of contents) {
    content.replace(/[a-z]*/ig, function (phrase) {
      //驼峰转换
      phrase.replace(/.[^A-Z]*/g, function (word) {
        word = word.toLowerCase();

        if (words[word]) {
          words[word]++;
        } else {
          words[word] = 1;
        }
        total++;
        spinner.text = `find words（${total}） in contents`;
      })
    })
  }
  spinner.succeed();

  return words;
}


//按频率排序
function orderFrequency(words) {
  words.sort(function (a, b) {
    return b.frequency - a.frequency;
  });

  return words;
}

function findEnglishWords(words) {
  const wordPath = path.resolve(__dirname, './english-words.txt');

  return new Promise(function (resolve) {
    const spinner = ora('find english words').start();
    let lines, word, total = 0, englishWords = [];

    lineReader.eachLine(wordPath, {encoding: 'utf8'}, function (line, last, cb) {
      lines = line.split(' ');
      word = lines[0];

      if (words[word]) {
        englishWords.push({
          word: word,
          frequency: words[word],
          explain: lines[lines.length - 1]
        });
        total++;
        spinner.text = `find english words（${total}）`;
      }

      if (last) {
        spinner.succeed();
        resolve(englishWords);
      }

      cb();
    });
  });
}

module.exports = async function (options, contents) {
  const words = convertContentsToWord(contents);
  const englishWords = await findEnglishWords(words);

  if (options.order === 'frequency') {
    return orderFrequency(englishWords);
  }

  return englishWords;
};
