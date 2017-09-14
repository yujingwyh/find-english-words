const fs = require('fs');
const ora = require('ora');

const getContentByFiles = require('./lib/get-content-by-files');
const getEnglishWords = require('./lib/get-english-words');

//按频率排序
function orderFrequency(words) {
  words.sort(function (a, b) {
    return b.frequency - a.frequency;
  });

  return words;
}

//写文件
function writeWords(words, outpath) {
  const spinner = ora('write english words').start();

  let writeStream = fs.createWriteStream(outpath, {
    defaultEncoding: 'utf8'
  });
  let word;

  writeStream.write(getFull('词', 20) + getFull('频率', 10) + '释义\n');
  for (let i = 0, len = words.length; i < len; i++) {
    word = words[i];

    spinner.text = `write english words（${i + 1}）`;
    writeStream.write(getFull(word.word, 20) + getFull(word.frequency, 10) + word.explain + '\n');
  }
  spinner.succeed();
  writeStream.end();

  function getLength(str) {
    return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
  }

  function getFull(word, total) {
    const supplement = total - getLength(word);

    return supplement > 0 ? word + new Array(supplement).join(' ') : word;
  }
}

/**
 * 在内容或者文件中找出英语单词
 * @param options {Object} 选项
 * @param [options.content] {string} 内容
 * @param [options.src] {Array|string} glob 文件源
 * @param [options.order] {string} 排序 默认按字母排序 为frequency按出现的频率排序
 * @param [options.outpath] {string} 输出的文件路径
 * @return {Array} words
 */
module.exports = async function (options = {}) {
  let contents, words;

  if (options.content) {
    contents = [options.content];
  }
  else if (options.src) {
    contents = await getContentByFiles(options.src);
  }
  else {
    throw Error('请指定内容或者文件地址！');
  }
  words = await getEnglishWords(contents);

  if (options.order === 'frequency') {
    words = orderFrequency(words);
  }

  if (options.outpath) {
    writeWords(words, options.outpath);
  }

  return words;
};
