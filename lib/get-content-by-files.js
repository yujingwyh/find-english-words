const vfs = require('vinyl-fs');
const mapStream = require('map-stream');
const Promise = require('promise');
const ora = require('ora');

function main(fileGlob) {
  const spinner = ora('find contents in files').start();

  let fileContents = [];

  return new Promise(function (resolve) {
    let total = 0;

    vfs
      .src(fileGlob, {
        nodir: true
      })
      .pipe(mapStream(function (file, cb) {
        total++;

        fileContents.push(file.contents.toString());
        spinner.text = `find contents（${total}） in files`;

        cb();
      }))
      .on('end', function () {
        spinner.succeed();
        resolve(fileContents);
      })
  });
}
module.exports = main;
