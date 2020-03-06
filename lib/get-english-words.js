const lineReader = require('line-reader');
const Promise = require('promise');
const ora = require('ora');
const path = require('path');

//按频率排序
function orderFrequency(words) {
  words.sort(function (a, b) {
    return b.frequency - a.frequency;
  });

  return words;
}

function convertContentsToWord(contents) {
  return new Promise(async function (resolve) {
    const spinner = ora('find words in contents').start();

    let total = 0;
    let words = {};

    parseContent();

    function parseContent() {
      if (contents.length === 0) {
        spinner.succeed();
        resolve(words);
        return;
      }
      const content = contents.splice(0, 1);
      const matches = content[0].match(/[a-zA-Z][a-z]*/g);

      for (let word of matches || []) {
        const firstWord = word.charAt(0);
        //首字母小写
        word = word.replace(firstWord, firstWord.toLowerCase());

        if (words[word]) {
          words[word]++;
        } else {
          words[word] = 1;
        }
        total++;
        spinner.text = `find words(${total}) in contents`;
      }
      setTimeout(parseContent, 20)
    }
  });
}

function findEnglishWords(words) {
  const wordPath = path.resolve(__dirname, './english-words.txt');

  return new Promise(function (resolve) {
    const spinner = ora('find english words').start();
    let lines, word, total = 0, englishWords = [];

    lineReader.eachLine(wordPath, {encoding: 'utf8'}, function (line, last, cb) {
      lines = line.split('   ');
      word = lines[0];

      if (words[word]) {
        englishWords.push({
          word: word,
          frequency: words[word],
          explain: lines[lines.length - 1]
        });
        total++;
        spinner.text = `find english words(${total})`;
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
  const words = await convertContentsToWord(contents);
  const englishWords = await findEnglishWords(words);

  if (options.order === 'frequency') {
    return orderFrequency(englishWords);
  }

  return englishWords;
};
