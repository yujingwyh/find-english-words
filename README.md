# find-english-words
在内容或者文件中找出英语单词

## 安装

```bash
$ npm install find-english-words --save-dev
```

## 使用

```
const findEnglishWords = require('find-english-words');

findEnglishWords({
  src:['./node_modules/**/*'],
  order:'frequency',
  outpath:'./words.txt'
});

/*
 * words.txt
 * 词                 频率     释义
 * i                  5445     .我
 * the                3359     (定冠词)那，这
 * to                 2290     prep.向，到
 * if                 1900     conj.如果，虽然,是否
 * function           1551     n.作用，集会，函数
 * this               1482     adj.,pron.这，这个
 * ...
*/

```

## API

### findEnglishWords(options)

#### options

##### content

Type: `string`<br>
Default: `null`

直接指定内容

##### src

Type: `glob`<br>
Default: `null`

指定查找的文件源

##### order

Type: `string`<br>
Default: `null`

排序，默认按字母排序，值为frequency按出现的频率排序

##### outpath

Type: `string`<br>
Default: `null`

指定输出的文件路径

## License

[MIT](http://opensource.org/licenses/MIT)
