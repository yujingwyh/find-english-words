# find-english-words
在内容或者文件中找出英语单词

## 安装

```bash
$ npm install find-english-words --save-dev
```

## 使用

```
var findEnglishWords = require('find-english-words');

findEnglishWords({
  src:['./node_modules/**/*'],
  order:'frequency',
  outpath:'./words.txt'
});
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
