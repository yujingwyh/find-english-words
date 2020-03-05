const vfs = require('vinyl-fs');
const mapStream = require('map-stream');
const Promise = require('promise');
const ora = require('ora');

function getContentByFiles(glob) {
  return new Promise(function (resolve) {
    let total = 0, contents = [];

    const spinner = ora('find contents in files').start();

    vfs.src(glob, {nodir: true})
      .pipe(mapStream(function (file, cb) {
        total++;

        contents.push(file.contents.toString());
        spinner.text = `find contents（${total}） in files`;

        cb();
      }))
      .on('end', function () {
        spinner.succeed();
        resolve(contents);
      })
  });
}

module.exports = async function (options) {
  if (options.content) {
    return [options.content];
  } else if (options.src) {
    return await getContentByFiles(options.src);
  } else {
    throw Error('请指定内容或者文件地址！');
  }
};
