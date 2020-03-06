const fs = require('fs');
const ora = require('ora');

const getContent = require('./lib/get-content');
const getEnglishWords = require('./lib/get-english-words');


//写文件
function writeWords(words, output) {
  const spinner = ora('write english words').start();

  const writeStream = fs.createWriteStream(output);

  writeStream.write(getFull('词', 20) + getFull('频率', 10) + '释义\n');

  words.forEach(function (word, index) {
    spinner.text = `write english words(${index + 1})`;
    writeStream.write(getFull(word.word, 19) + getFull(word.frequency, 10) + word.explain + '\n');
  });
  spinner.succeed();
  writeStream.end();

  function getFull(word, total) {
    const length = String(word).replace(/[^\x00-\xff]/g, 'aa').length;
    const supplement = total - length;

    return supplement > 0 ? word + new Array(supplement + 1).join(' ') : word;
  }
}

/**
 * 在内容或者文件中找出英语单词
 * @param options {Object} 选项
 * @param [options.content] {string} 内容
 * @param [options.src] {Array|string} glob 文件源
 * @param [options.order] {string} 排序 默认按字母排序 为frequency按出现的频率排序
 * @param [options.output] {string} 输出的文件路径
 * @return {Array} words
 */
module.exports = async function (options = {}) {
  const contents = await getContent(options);
  const englishWords = await getEnglishWords(options, contents);


  if (options.output) {
    writeWords(englishWords, options.output);
  }

  console.log('√ finished find english words');

  return englishWords;
};
